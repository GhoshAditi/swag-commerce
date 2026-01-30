"""
Script to create database tables
Run this: python create_tables.py
"""
import asyncio
from app.database import init_db

async def create_tables():
    """Create all database tables"""
    print("🔨 Creating database tables...")
    await init_db()
    print("✅ All tables created successfully!")
    print("\nTables created:")
    print("  - products")
    print("  - tiered_pricing")
    print("  - coupons")
    print("  - orders")
    print("  - order_items")

if __name__ == "__main__":
    asyncio.run(create_tables())
