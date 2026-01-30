"""Add product_name column to order_items table"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def migrate():
    """Add product_name column if it doesn't exist"""
    async with engine.begin() as conn:
        # Check if column exists
        result = await conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='order_items' AND column_name='product_name'
        """))
        
        if result.fetchone() is None:
            # Add the column
            await conn.execute(text("""
                ALTER TABLE order_items 
                ADD COLUMN product_name VARCHAR(255)
            """))
            print("✅ Added product_name column to order_items table")
        else:
            print("ℹ️  product_name column already exists")


if __name__ == "__main__":
    asyncio.run(migrate())
