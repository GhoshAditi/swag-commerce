from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date
from pydantic import BaseModel

from app.database import get_db
from app.models import Product, Order, Coupon
from app.ai.gemini import ask_gemini

router = APIRouter(prefix="/admin/ai", tags=["Admin AI"])


async def get_admin_context(db: AsyncSession):
    """Collect structured database context for AI"""
    
    # Lowest stock item
    low_stock = await db.execute(
        select(Product.name, Product.stock_quantity)
        .order_by(Product.stock_quantity.asc())
        .limit(1)
    )
    low_stock_item = low_stock.first()

    # Today's revenue
    today = date.today()
    revenue_today = await db.execute(
        select(func.sum(Order.total))
        .where(func.date(Order.created_at) == today)
    )
    total_revenue = revenue_today.scalar() or 0

    # Active coupons
    coupons = await db.execute(select(Coupon))
    coupon_list = coupons.scalars().all()

    return {
        "lowest_stock_item": {
            "name": low_stock_item[0],
            "stock": low_stock_item[1]
        } if low_stock_item else None,
        "revenue_today": float(total_revenue),
        "coupons": [
            {
                "code": c.code,
                "is_active": c.is_active,
                "expires_at": str(c.expires_at) if c.expires_at else None
            } for c in coupon_list
        ]
    }


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
async def admin_ai_chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """Admin AI copilot endpoint - answers business questions using DB context"""
    
    context = await get_admin_context(db)

    prompt = f"""
You are an admin assistant for an e-commerce system.

DATABASE CONTEXT:
{context}

Answer the admin's question clearly and concisely.

QUESTION:
{request.question}
"""

    answer = await ask_gemini(prompt)

    return {"answer": answer}
