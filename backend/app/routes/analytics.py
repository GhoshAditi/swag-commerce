"""Analytics API routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Product, Order, OrderItem

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Get analytics dashboard data with charts"""
    
    # Total orders
    result = await db.execute(select(func.count(Order.id)))
    total_orders = result.scalar() or 0
    
    # Total revenue
    result = await db.execute(select(func.sum(Order.total)))
    total_revenue = result.scalar() or 0
    
    # Average order value
    avg_order_value = float(total_revenue / total_orders) if total_orders > 0 else 0
    
    # Low stock products (products with stock < 50)
    result = await db.execute(select(func.count(Product.id)).where(Product.stock_quantity < 50))
    low_stock_products = result.scalar() or 0
    
    # Revenue trend (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    result = await db.execute(
        select(
            func.date(Order.created_at).label('date'),
            func.sum(Order.total).label('revenue')
        )
        .where(Order.created_at >= seven_days_ago)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
    )
    revenue_trend = [
        {"date": row[0].strftime('%m/%d'), "revenue": float(row[1])}
        for row in result.all()
    ]
    
    # Fill missing days with zero revenue
    if len(revenue_trend) < 7:
        existing_dates = {item['date'] for item in revenue_trend}
        for i in range(7):
            date = (datetime.utcnow() - timedelta(days=6-i)).strftime('%m/%d')
            if date not in existing_dates:
                revenue_trend.append({"date": date, "revenue": 0})
        revenue_trend.sort(key=lambda x: x['date'])
    
    # Top products by sales
    result = await db.execute(
        select(
            Product.name,
            func.sum(OrderItem.quantity).label("sales"),
            func.sum(OrderItem.total_price).label("revenue")
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id, Product.name)
        .order_by(desc(func.sum(OrderItem.quantity)))
        .limit(5)
    )
    top_products = [
        {"name": row[0], "sales": int(row[1]), "revenue": float(row[2])}
        for row in result.all()
    ]
    
    # Category distribution
    result = await db.execute(
        select(
            Product.category,
            func.count(Product.id).label('count')
        )
        .group_by(Product.category)
    )
    category_distribution = [
        {"category": row[0], "count": int(row[1])}
        for row in result.all()
    ]
    
    return {
        "total_revenue": float(total_revenue),
        "total_orders": int(total_orders),
        "avg_order_value": avg_order_value,
        "low_stock_products": int(low_stock_products),
        "revenue_trend": revenue_trend,
        "top_products": top_products,
        "category_distribution": category_distribution
    }
