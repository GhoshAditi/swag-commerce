"""Analytics API routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import Product, Order, OrderItem

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Get analytics dashboard data"""
    
    # Total products
    result = await db.execute(select(func.count(Product.id)))
    total_products = result.scalar()
    
    # Total orders
    result = await db.execute(select(func.count(Order.id)))
    total_orders = result.scalar()
    
    # Total revenue
    result = await db.execute(select(func.sum(Order.total)))
    total_revenue = result.scalar() or 0
    
    # Popular products (simplified for now)
    result = await db.execute(
        select(Product.name, func.sum(OrderItem.quantity).label("total_quantity"))
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
    )
    popular_products = [
        {"name": row[0], "total_quantity": row[1]}
        for row in result.all()
    ]
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "popular_products": popular_products
    }
