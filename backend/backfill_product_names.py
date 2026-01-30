"""Backfill product_name in existing order_items"""
import asyncio
from sqlalchemy import select, update
from app.database import engine
from app.models import OrderItem, Product


async def backfill_product_names():
    """Update existing order_items with product names"""
    from sqlalchemy.ext.asyncio import AsyncSession
    
    async with AsyncSession(engine) as db:
        # Get all order items without product_name
        query = select(OrderItem).where(
            (OrderItem.product_name == None) | (OrderItem.product_name == '')
        )
        result = await db.execute(query)
        items = result.scalars().all()
        
        if not items:
            print("✅ All order items already have product names")
            return
        
        print(f"Found {len(items)} order items to update...")
        updated = 0
        
        for item in items:
            # Fetch product name
            product_query = select(Product).where(Product.id == item.product_id)
            product_result = await db.execute(product_query)
            product = product_result.scalar_one_or_none()
            
            if product:
                item.product_name = product.name
                updated += 1
                print(f"  ✓ Updated order item {item.id} with product name: {product.name}")
            else:
                print(f"  ⚠ Product {item.product_id} not found for order item {item.id}")
        
        await db.commit()
        print(f"\n✅ Updated {updated} order items with product names")


if __name__ == "__main__":
    asyncio.run(backfill_product_names())
