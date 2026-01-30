"""Verify order_items table structure"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def verify():
    """Check order_items columns"""
    async with engine.connect() as conn:
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name='order_items' 
            ORDER BY ordinal_position
        """))
        
        print("order_items table columns:")
        for row in result:
            print(f"  ✓ {row[0]} ({row[1]})")


if __name__ == "__main__":
    asyncio.run(verify())
