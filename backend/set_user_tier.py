"""Update user tier for testing"""
import asyncio
from sqlalchemy import select, update
from app.database import engine
from app.models import User


async def update_user_tier():
    """Set user tier for testing"""
    from sqlalchemy.ext.asyncio import AsyncSession
    
    email = input("Enter user email: ")
    tier = int(input("Enter tier (1, 2, or 3): "))
    
    if tier not in [1, 2, 3]:
        print("❌ Invalid tier. Must be 1, 2, or 3")
        return
    
    async with AsyncSession(engine) as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ User {email} not found")
            return
        
        user.tier = tier
        await db.commit()
        print(f"✅ Updated {email} to Tier {tier}")
        print(f"\nTier {tier} users can see:")
        
        from app.models import Product
        products_result = await db.execute(
            select(Product).where(Product.tier <= tier)
        )
        products = products_result.scalars().all()
        for product in products:
            print(f"  - {product.name} (Tier {product.tier})")


if __name__ == "__main__":
    asyncio.run(update_user_tier())
