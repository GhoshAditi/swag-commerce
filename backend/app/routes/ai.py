"""AI Chat API routes using Gemini"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone, timedelta
import google.generativeai as genai
import os

from app.database import get_db
from app.models import Product, Order, OrderItem, Coupon
from app.config import get_settings

settings = get_settings()

# Validate API key is loaded
if not settings.GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please check your .env file.")

genai.configure(api_key=settings.GEMINI_API_KEY)

router = APIRouter(prefix="/ai", tags=["ai"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    context_used: dict = {}


async def get_database_context(db: AsyncSession) -> str:
    """
    Fetch relevant database statistics and information
    to provide context to the AI
    """
    context_parts = []
    
    # Get product inventory information
    products_query = select(Product).order_by(Product.stock_quantity.asc())
    products_result = await db.execute(products_query)
    products = products_result.scalars().all()
    
    context_parts.append("=== INVENTORY STATUS ===")
    context_parts.append(f"Total Products: {len(products)}")
    context_parts.append("\nProduct Stock Levels:")
    for product in products[:10]:  # Top 10 lowest stock
        context_parts.append(f"- {product.name}: {product.stock_quantity} units (${product.base_price} each)")
    
    # Get today's revenue
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today_query = select(Order).where(Order.created_at >= today_start)
    orders_today_result = await db.execute(orders_today_query)
    orders_today = orders_today_result.scalars().all()
    
    total_revenue_today = sum(order.total for order in orders_today)
    context_parts.append(f"\n=== TODAY'S SALES ===")
    context_parts.append(f"Orders Today: {len(orders_today)}")
    context_parts.append(f"Total Revenue Today: ${total_revenue_today:.2f}")
    
    # Get total revenue all time
    all_orders_query = select(func.sum(Order.total))
    all_revenue_result = await db.execute(all_orders_query)
    all_revenue = all_revenue_result.scalar() or 0
    
    context_parts.append(f"Total Revenue (All Time): ${all_revenue:.2f}")
    
    # Get coupon information
    coupons_query = select(Coupon)
    coupons_result = await db.execute(coupons_query)
    coupons = coupons_result.scalars().all()
    
    context_parts.append(f"\n=== COUPONS ===")
    context_parts.append(f"Total Coupons: {len(coupons)}")
    for coupon in coupons:
        status = "ACTIVE" if coupon.is_active else "INACTIVE"
        expiry = "No expiry" if not coupon.expires_at else f"Expires: {coupon.expires_at.strftime('%Y-%m-%d')}"
        usage = f"Used: {coupon.used_count}"
        if coupon.usage_limit:
            usage += f"/{coupon.usage_limit}"
        
        discount_info = "Makes order FREE" if coupon.makes_free else (
            f"{coupon.discount_value}% off" if coupon.discount_type == "percentage" 
            else f"${coupon.discount_value} off"
        )
        
        context_parts.append(f"- {coupon.code}: {discount_info} | {status} | {expiry} | {usage}")
    
    # Get order statistics
    total_orders_query = select(func.count(Order.id))
    total_orders_result = await db.execute(total_orders_query)
    total_orders = total_orders_result.scalar() or 0
    
    context_parts.append(f"\n=== ORDER STATISTICS ===")
    context_parts.append(f"Total Orders: {total_orders}")
    
    # Get most ordered products
    most_ordered_query = (
        select(
            OrderItem.product_id,
            func.sum(OrderItem.quantity).label('total_qty')
        )
        .group_by(OrderItem.product_id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
    )
    most_ordered_result = await db.execute(most_ordered_query)
    most_ordered = most_ordered_result.all()
    
    if most_ordered:
        context_parts.append("\nTop 5 Most Ordered Products:")
        for item in most_ordered:
            product_query = select(Product).where(Product.id == item.product_id)
            product_result = await db.execute(product_query)
            product = product_result.scalar_one_or_none()
            if product:
                context_parts.append(f"- {product.name}: {item.total_qty} units sold")
    
    return "\n".join(context_parts)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    AI chat endpoint using Gemini API with database context
    """
    try:
        # Get database context
        db_context = await get_database_context(db)
        
        # Create the prompt with context
        system_prompt = """You are an intelligent assistant for SwagCommerce, a bulk merchandise e-commerce platform.
You have access to real-time database information including inventory, sales, orders, and coupons.

Your role is to:
1. Answer questions about inventory, stock levels, and product information
2. Provide sales analytics and revenue information
3. Check coupon validity and usage
4. Give insights about order history and customer behavior
5. Be concise and accurate

Use the database context provided to answer questions. If you don't have the information, say so clearly.

Current Database Context:
{context}

User Question: {question}

Provide a clear, concise answer based on the data above."""

        prompt = system_prompt.format(context=db_context, question=request.message)
        
        # Call Gemini API
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        return ChatResponse(
            response=response.text,
            context_used={"message": "Database context included in response"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
