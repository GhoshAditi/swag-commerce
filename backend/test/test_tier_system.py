"""Test tier-based product filtering"""
import asyncio
from sqlalchemy import select
from app.database import engine
from app.models import User, Product


async def test_tier_system():
    """Test that tier system works correctly"""
    from sqlalchemy.ext.asyncio import AsyncSession
    
    async with AsyncSession(engine) as db:
        # Get all users
        users_result = await db.execute(select(User))
        users = users_result.scalars().all()
        
        print("\n=== USER TIERS ===")
        for user in users:
            print(f"User: {user.email} - Tier {user.tier}")
        
        # Get all products grouped by tier
        print("\n=== PRODUCTS BY TIER ===")
        for tier in [1, 2, 3]:
            products_result = await db.execute(
                select(Product).where(Product.tier == tier)
            )
            products = products_result.scalars().all()
            print(f"\nTier {tier} Products:")
            for product in products:
                print(f"  - {product.name} (${product.base_price})")
        
        # Simulate tier-based filtering
        print("\n=== TIER-BASED ACCESS ===")
        for user_tier in [1, 2, 3]:
            products_result = await db.execute(
                select(Product).where(Product.tier <= user_tier)
            )
            products = products_result.scalars().all()
            print(f"\nTier {user_tier} user sees {len(products)} products:")
            for product in products:
                print(f"  - {product.name} (Tier {product.tier})")
        
        # Check orders table for items_brought column
        print("\n=== CHECKING ORDERS TABLE ===")
        from sqlalchemy import text
        result = await db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name='orders' AND column_name='items_brought'
        """))
        column = result.fetchone()
        if column:
            print(f"✅ items_brought column exists: {column[0]} ({column[1]})")
        else:
            print("❌ items_brought column NOT found")


if __name__ == "__main__":
    asyncio.run(test_tier_system())
