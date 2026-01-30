"""Orders API routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from typing import List

from app.database import get_db
from app.models import Order, OrderItem, Product, Coupon, User
from app.schemas import (
    PlaceOrderRequest, 
    OrderResponse, 
    OrderItemResponse,
    BillResponse,
    AppliedCouponInfo,
    OrderHistoryItem
)
from app.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=BillResponse)
async def place_order(
    request: PlaceOrderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Place a new order with items and coupons.
    Updates user's order history and coupons used.
    """
    if not request.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
    
    # Calculate subtotal
    subtotal = sum(item.price * item.quantity for item in request.items)
    
    # Apply coupons and calculate discount
    applied_coupons = []
    total_discount = 0.0
    remaining_amount = subtotal
    coupon_codes_used = []
    
    for coupon_code in request.coupon_codes:
        if remaining_amount <= 0:
            break
            
        # Fetch and validate coupon
        query = select(Coupon).where(Coupon.code == coupon_code.upper())
        result = await db.execute(query)
        coupon = result.scalar_one_or_none()
        
        if not coupon:
            raise HTTPException(status_code=404, detail=f"Coupon '{coupon_code}' not found")
        
        if not coupon.is_active:
            raise HTTPException(status_code=400, detail=f"Coupon '{coupon_code}' is inactive")
        
        # Fix timezone comparison
        if coupon.expires_at:
            current_time = datetime.now(timezone.utc)
            expires_at = coupon.expires_at.replace(tzinfo=timezone.utc) if coupon.expires_at.tzinfo is None else coupon.expires_at
            if expires_at < current_time:
                raise HTTPException(status_code=400, detail=f"Coupon '{coupon_code}' has expired")
        
        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            raise HTTPException(status_code=400, detail=f"Coupon '{coupon_code}' usage limit reached")
        
        # Calculate discount
        discount_amount = 0.0
        
        if coupon.makes_free:
            discount_amount = remaining_amount
        elif coupon.discount_type == "percentage":
            discount_amount = remaining_amount * (coupon.discount_value / 100)
        elif coupon.discount_type == "fixed":
            discount_amount = min(coupon.discount_value, remaining_amount)
        
        remaining_amount -= discount_amount
        total_discount += discount_amount
        
        applied_coupons.append(AppliedCouponInfo(
            code=coupon.code,
            discount_type=coupon.discount_type,
            discount_value=coupon.discount_value,
            discount_amount=discount_amount
        ))
        
        coupon_codes_used.append(coupon.code)
        
        # Increment coupon usage count
        coupon.used_count += 1
    
    final_total = max(0, subtotal - total_discount)
    
    # Prepare items_brought data
    items_brought = [
        {
            "name": item.name,
            "quantity": item.quantity,
            "price": item.price
        }
        for item in request.items
    ]
    
    # Create order
    new_order = Order(
        customer_email=current_user.email,
        customer_name=current_user.name,
        items_brought=items_brought,
        subtotal=subtotal,
        discount=total_discount,
        total=final_total,
        status="confirmed",
        applied_coupon_code=",".join(coupon_codes_used) if coupon_codes_used else None
    )
    
    db.add(new_order)
    await db.flush()  # Get order ID
    
    # Create order items
    order_items = []
    for item in request.items:
        # Verify product exists
        product_query = select(Product).where(Product.id == item.product_id)
        product_result = await db.execute(product_query)
        product = product_result.scalar_one_or_none()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product '{item.product_id}' not found")
        
        # Check stock
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.stock_quantity}"
            )
        
        # Deduct stock
        product.stock_quantity -= item.quantity
        
        # Create order item with product name
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            product_name=product.name,
            quantity=item.quantity,
            unit_price=item.price,
            total_price=item.price * item.quantity
        )
        db.add(order_item)
        order_items.append(order_item)
    
    # Update user's order history and coupons used
    user_query = select(User).where(User.id == current_user.id)
    user_result = await db.execute(user_query)
    user = user_result.scalar_one()
    
    # Build detailed order info with product names and quantities
    order_details = {
        "order_id": new_order.id,
        "items": [
            {
                "product_id": item.product_id,
                "name": item.name,
                "quantity": item.quantity,
                "price": item.price
            }
            for item in request.items
        ],
        "total": final_total,
        "coupons": coupon_codes_used,
        "date": new_order.created_at.isoformat() if new_order.created_at else datetime.utcnow().isoformat()
    }
    
    # Update order history
    if user.order_history is None:
        user.order_history = []
    user.order_history.append(order_details)
    
    # Update coupons used
    if user.coupons_used is None:
        user.coupons_used = []
    user.coupons_used.extend(coupon_codes_used)
    
    # Commit transaction
    await db.commit()
    await db.refresh(new_order)
    
    # Prepare response
    order_items_response = [
        OrderItemResponse(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        for item in order_items
    ]
    
    return BillResponse(
        order_id=new_order.id,
        customer_name=new_order.customer_name or "Guest",
        customer_email=new_order.customer_email,
        items=order_items_response,
        subtotal=subtotal,
        applied_coupons=applied_coupons,
        total_discount=total_discount,
        final_total=final_total,
        created_at=new_order.created_at,
        status=new_order.status
    )


@router.get("/history", response_model=List[OrderHistoryItem])
async def get_order_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get order history for the current user
    """
    if not current_user.order_history or len(current_user.order_history) == 0:
        return []
    
    # Order history now contains detailed order objects
    history = []
    for order_data in current_user.order_history:
        # Handle both old format (order_id string) and new format (dict)
        if isinstance(order_data, str):
            # Old format - fetch from orders table
            query = select(Order).where(Order.id == order_data)
            result = await db.execute(query)
            order = result.scalar_one_or_none()
            
            if order:
                items_query = select(OrderItem).where(OrderItem.order_id == order.id)
                items_result = await db.execute(items_query)
                items = items_result.scalars().all()
                items_count = sum(item.quantity for item in items)
                coupons_used = order.applied_coupon_code.split(",") if order.applied_coupon_code else []
                
                items_response = [
                    OrderItemResponse(
                        product_id=item.product_id,
                        product_name=item.product_name,
                        quantity=item.quantity,
                        unit_price=item.unit_price,
                        total_price=item.total_price
                    )
                    for item in items
                ]
                
                history.append(OrderHistoryItem(
                    order_id=order.id,
                    items=items_response,
                    total_amount=order.total,
                    items_count=items_count,
                    coupons_used=coupons_used,
                    created_at=order.created_at
                ))
        else:
            # New format - already has the data
            items_count = sum(item['quantity'] for item in order_data.get('items', []))
            items_response = [
                OrderItemResponse(
                    product_id=item['product_id'],
                    product_name=item['name'],
                    quantity=item['quantity'],
                    unit_price=item['price'],
                    total_price=item['price'] * item['quantity']
                )
                for item in order_data.get('items', [])
            ]
            
            history.append(OrderHistoryItem(
                order_id=order_data['order_id'],
                items=items_response,
                total_amount=order_data['total'],
                items_count=items_count,
                coupons_used=order_data.get('coupons', []),
                created_at=datetime.fromisoformat(order_data['date'])
            ))
    
    return history


@router.get("/{order_id}", response_model=BillResponse)
async def get_order_bill(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed bill for a specific order
    """
    # Fetch order
    query = select(Order).where(Order.id == order_id)
    result = await db.execute(query)
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify order belongs to current user
    if order.customer_email != current_user.email:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Fetch order items
    items_query = select(OrderItem).where(OrderItem.order_id == order_id)
    items_result = await db.execute(items_query)
    order_items = items_result.scalars().all()
    
    order_items_response = [
        OrderItemResponse(
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        for item in order_items
    ]
    
    # Parse applied coupons
    applied_coupons = []
    if order.applied_coupon_code:
        coupon_codes = order.applied_coupon_code.split(",")
        for code in coupon_codes:
            coupon_query = select(Coupon).where(Coupon.code == code)
            coupon_result = await db.execute(coupon_query)
            coupon = coupon_result.scalar_one_or_none()
            if coupon:
                # Calculate what discount was applied (approximate)
                discount_per_coupon = order.discount / len(coupon_codes)
                applied_coupons.append(AppliedCouponInfo(
                    code=coupon.code,
                    discount_type=coupon.discount_type,
                    discount_value=coupon.discount_value,
                    discount_amount=discount_per_coupon
                ))
    
    return BillResponse(
        order_id=order.id,
        customer_name=order.customer_name or "Guest",
        customer_email=order.customer_email,
        items=order_items_response,
        subtotal=order.subtotal,
        applied_coupons=applied_coupons,
        total_discount=order.discount,
        final_total=order.total,
        created_at=order.created_at,
        status=order.status
    )
