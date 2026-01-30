"""Add tier columns and items_brought to database tables"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def migrate():
    """Add new columns"""
    async with engine.begin() as conn:
        # Add tier to users table
        result = await conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='tier'
        """))
        if result.fetchone() is None:
            await conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN tier INTEGER DEFAULT 1 NOT NULL
            """))
            print("✅ Added tier column to users table")
        else:
            print("ℹ️  tier column already exists in users table")
        
        # Add tier to products table
        result = await conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='tier'
        """))
        if result.fetchone() is None:
            await conn.execute(text("""
                ALTER TABLE products 
                ADD COLUMN tier INTEGER DEFAULT 1 NOT NULL
            """))
            print("✅ Added tier column to products table")
        else:
            print("ℹ️  tier column already exists in products table")
        
        # Add items_brought to orders table
        result = await conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='orders' AND column_name='items_brought'
        """))
        if result.fetchone() is None:
            await conn.execute(text("""
                ALTER TABLE orders 
                ADD COLUMN items_brought JSON
            """))
            print("✅ Added items_brought column to orders table")
        else:
            print("ℹ️  items_brought column already exists in orders table")


if __name__ == "__main__":
    asyncio.run(migrate())
