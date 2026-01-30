"""Update existing products with tier assignments"""
import asyncio
from sqlalchemy import text, select
from app.database import engine
from app.models import Product


async def assign_tiers():
    """Assign tiers to existing products"""
    from sqlalchemy.ext.asyncio import AsyncSession
    
    async with AsyncSession(engine) as db:
        # Get all products
        query = select(Product)
        result = await db.execute(query)
        products = result.scalars().all()
        
        if not products:
            print("⚠️  No products found in database")
            return
        
        print(f"Found {len(products)} products to update...")
        
        # Tier assignments based on product names
        tier_1_keywords = ["Economy", "Basic", "Compact", "Mini"]
        tier_2_keywords = ["Standard", "Premium Hoodie"]
        tier_3_keywords = ["Premium Widget", "Smart", "Pro", "Executive"]
        
        updated = 0
        for product in products:
            # Determine tier
            if any(keyword in product.name for keyword in tier_1_keywords):
                product.tier = 1
            elif any(keyword in product.name for keyword in tier_2_keywords):
                product.tier = 2
            elif any(keyword in product.name for keyword in tier_3_keywords):
                product.tier = 3
            else:
                product.tier = 1  # Default to tier 1
            
            updated += 1
            print(f"  ✓ {product.name} → Tier {product.tier}")
        
        await db.commit()
        print(f"\n✅ Updated {updated} products with tier assignments")


if __name__ == "__main__":
    asyncio.run(assign_tiers())
