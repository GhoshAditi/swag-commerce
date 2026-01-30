from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from datetime import datetime, timezone

from app.database import get_db
from app.models import Coupon, Cart, CartItem as CartItemModel, Product, User
from app.schemas import CartCalculateRequest, CartCalculateResponse, AppliedCouponInfo
from app.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.post("/calculate", response_model=CartCalculateResponse)
async def calculate_cart_total(
    request: CartCalculateRequest,
    db: AsyncSession = Depends(get_db)
):
    subtotal = sum(item.price * item.quantity for item in request.items)

    applied_coupons = []
    total_discount = 0.0
    remaining_amount = subtotal

    for coupon_code in request.coupon_codes:
        if remaining_amount <= 0:
            break

        query = select(Coupon).where(Coupon.code == coupon_code.upper())
        result = await db.execute(query)
        coupon = result.scalar_one_or_none()

        if not coupon:
            raise HTTPException(status_code=404, detail=f"Coupon '{coupon_code}' not found")

        if not coupon.is_active:
            raise HTTPException(status_code=400, detail="Coupon is inactive")

        if coupon.expires_at:
            now = datetime.now(timezone.utc)
            expires_at = coupon.expires_at.replace(tzinfo=timezone.utc)
            if expires_at < now:
                raise HTTPException(status_code=400, detail="Coupon expired")

        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            raise HTTPException(status_code=400, detail="Coupon usage limit reached")

        if coupon.makes_free:
            discount_amount = remaining_amount
        elif coupon.discount_type == "percentage":
            discount_amount = remaining_amount * (coupon.discount_value / 100)
        else:
            discount_amount = min(coupon.discount_value, remaining_amount)

        remaining_amount -= discount_amount
        total_discount += discount_amount

        applied_coupons.append(
            AppliedCouponInfo(
                code=coupon.code,
                discount_type=coupon.discount_type,
                discount_value=coupon.discount_value,
                discount_amount=discount_amount
            )
        )

    final_total = max(0, subtotal - total_discount)

    return CartCalculateResponse(
        subtotal=subtotal,
        applied_coupons=applied_coupons,
        total_discount=total_discount,
        final_total=final_total,
        can_add_more_coupons=final_total > 0
    )


@router.post("/items")
async def add_to_cart(
    product_id: str,
    quantity: int = 1,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add item to user's cart"""
    # Verify product exists
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create cart for user
    result = await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    cart = result.scalar_one_or_none()
    
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        await db.flush()
    
    # Check if item already in cart
    result = await db.execute(
        select(CartItemModel).where(
            CartItemModel.cart_id == cart.id,
            CartItemModel.product_id == product_id
        )
    )
    cart_item = result.scalar_one_or_none()
    
    if cart_item:
        # Update quantity
        cart_item.quantity += quantity
    else:
        # Add new item
        cart_item = CartItemModel(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity
        )
        db.add(cart_item)
    
    cart.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(cart_item)
    
    return {
        "message": "Item added to cart",
        "cart_item_id": cart_item.id,
        "quantity": cart_item.quantity
    }


@router.get("/items")
async def get_cart_items(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all items in user's cart"""
    # Get user's cart
    result = await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    cart = result.scalar_one_or_none()
    
    if not cart:
        return {"items": []}
    
    # Get cart items with product details
    result = await db.execute(
        select(CartItemModel, Product)
        .join(Product, CartItemModel.product_id == Product.id)
        .where(CartItemModel.cart_id == cart.id)
    )
    
    items = []
    for cart_item, product in result:
        items.append({
            "cart_item_id": cart_item.id,
            "product_id": product.id,
            "name": product.name,
            "price": product.base_price,
            "quantity": cart_item.quantity,
            "image_url": product.image_url,
            "added_at": cart_item.added_at.isoformat()
        })
    
    return {"items": items, "cart_id": cart.id}


@router.put("/items/{cart_item_id}")
async def update_cart_item(
    cart_item_id: str,
    quantity: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update cart item quantity"""
    if quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity must be non-negative")
    
    # Get user's cart
    result = await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    cart = result.scalar_one_or_none()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Get cart item
    result = await db.execute(
        select(CartItemModel).where(
            CartItemModel.id == cart_item_id,
            CartItemModel.cart_id == cart.id
        )
    )
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if quantity == 0:
        # Remove item
        await db.delete(cart_item)
        await db.commit()
        return {"message": "Item removed from cart"}
    else:
        # Update quantity
        cart_item.quantity = quantity
        cart.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return {"message": "Cart item updated", "quantity": quantity}


@router.delete("/items/{cart_item_id}")
async def remove_cart_item(
    cart_item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove item from cart"""
    # Get user's cart
    result = await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    cart = result.scalar_one_or_none()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Delete cart item
    result = await db.execute(
        delete(CartItemModel).where(
            CartItemModel.id == cart_item_id,
            CartItemModel.cart_id == cart.id
        )
    )
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart.updated_at = datetime.now(timezone.utc)
    await db.commit()
    
    return {"message": "Item removed from cart"}


@router.delete("/clear")
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clear all items from cart"""
    # Get user's cart
    result = await db.execute(select(Cart).where(Cart.user_id == current_user.id))
    cart = result.scalar_one_or_none()
    
    if not cart:
        return {"message": "Cart is already empty"}
    
    # Delete all cart items
    await db.execute(delete(CartItemModel).where(CartItemModel.cart_id == cart.id))
    cart.updated_at = datetime.now(timezone.utc)
    await db.commit()
    
    return {"message": "Cart cleared successfully"}
