"""
Database seeding script - run once to populate initial data
Usage: python -m app.seed
"""
import asyncio
from datetime import datetime, timedelta

from app.database import AsyncSessionLocal, init_db
from app.models import Product, TieredPricing, Coupon


async def seed_database():
    """Seed database with initial products and coupons"""
    
    # Initialize database tables
    await init_db()
    print("✅ Database tables created")
    
    async with AsyncSessionLocal() as db:
        try:
            # Check if already seeded
            from sqlalchemy import select
            result = await db.execute(select(Product))
            if result.first():
                print("⚠️  Database already seeded. Skipping...")
                return
            
            print("🌱 Seeding database...")
            
            # Products with tiered pricing and tier assignments
            products = [
                # Tier 1 Products (Basic merchandise for all users)
                Product(
                    name="Economy Widget",
                    description="Budget-friendly widget for basic needs",
                    base_price=9.99,
                    stock_quantity=500,
                    image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
                    category="Electronics",
                    tier=1,
                    tiered_pricing=[
                        TieredPricing(min_quantity=50, price=8.99),
                        TieredPricing(min_quantity=200, price=6.99)
                    ]
                ),
                Product(
                    name="Basic T-Shirt",
                    description="Comfortable cotton t-shirt",
                    base_price=12.99,
                    stock_quantity=300,
                    image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                    category="Apparel",
                    tier=1,
                    tiered_pricing=[
                        TieredPricing(min_quantity=25, price=10.99),
                        TieredPricing(min_quantity=100, price=8.99)
                    ]
                ),
                
                # Tier 2 Products (Premium merchandise for tier 2+ users)
                Product(
                    name="Standard Widget",
                    description="Reliable widget for everyday use",
                    base_price=19.99,
                    stock_quantity=200,
                    image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
                    category="Electronics",
                    tier=2,
                    tiered_pricing=[
                        TieredPricing(min_quantity=20, price=17.99),
                        TieredPricing(min_quantity=100, price=14.99)
                    ]
                ),
                Product(
                    name="Premium Hoodie",
                    description="High-quality branded hoodie",
                    base_price=34.99,
                    stock_quantity=150,
                    image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
                    category="Apparel",
                    tier=2,
                    tiered_pricing=[
                        TieredPricing(min_quantity=15, price=29.99),
                        TieredPricing(min_quantity=50, price=24.99)
                    ]
                ),
                
                # Tier 3 Products (Exclusive merchandise for tier 3 users)
                Product(
                    name="Premium Widget",
                    description="High-quality widget for professional use",
                    base_price=29.99,
                    stock_quantity=100,
                    image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                    category="Electronics",
                    tier=3,
                    tiered_pricing=[
                        TieredPricing(min_quantity=10, price=27.99),
                        TieredPricing(min_quantity=50, price=24.99),
                        TieredPricing(min_quantity=100, price=19.99)
                    ]
                ),
                Product(
                    name="Smart Widget Pro",
                    description="AI-powered widget with advanced features",
                    base_price=49.99,
                    stock_quantity=50,
                    image_url="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
                    category="Electronics",
                    tier=3,
                    tiered_pricing=[
                        TieredPricing(min_quantity=5, price=45.99),
                        TieredPricing(min_quantity=25, price=39.99)
                    ]
                ),
                Product(
                    name="Compact Widget Mini",
                    description="Space-saving widget perfect for small spaces",
                    base_price=15.99,
                    stock_quantity=150,
                    image_url="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
                    category="Home & Garden",
                    tiered_pricing=[
                        TieredPricing(min_quantity=30, price=13.99),
                        TieredPricing(min_quantity=150, price=11.99)
                    ]
                ),
                Product(
                    name="Industrial Widget XL",
                    description="Heavy-duty widget for industrial applications",
                    base_price=99.99,
                    stock_quantity=25,
                    image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                    category="Industrial",
                    tiered_pricing=[
                        TieredPricing(min_quantity=10, price=89.99),
                        TieredPricing(min_quantity=50, price=79.99)
                    ]
                )
            ]
            
            # Add products to session
            for product in products:
                db.add(product)
            
            await db.commit()
            print(f"✅ Seeded {len(products)} products with tiered pricing")
            
            # Sample coupons
            coupons = [
                Coupon(
                    code="WELCOME10",
                    discount_type="percentage",
                    discount_value=10.0,
                    usage_limit=100,
                    expires_at=datetime.utcnow() + timedelta(days=30)
                ),
                Coupon(
                    code="SAVE20",
                    discount_type="percentage",
                    discount_value=20.0,
                    usage_limit=50,
                    expires_at=datetime.utcnow() + timedelta(days=7)
                ),
                Coupon(
                    code="FLAT50",
                    discount_type="fixed",
                    discount_value=50.0,
                    usage_limit=25,
                    expires_at=datetime.utcnow() + timedelta(days=14)
                ),
                Coupon(
                    code="FREESHIP",
                    discount_type="percentage",
                    discount_value=0.0,
                    makes_free=True,
                    usage_limit=None
                ),
                Coupon(
                    code="BULK30",
                    discount_type="percentage",
                    discount_value=30.0,
                    usage_limit=10,
                    expires_at=datetime.utcnow() + timedelta(days=60)
                )
            ]
            
            # Add coupons to session
            for coupon in coupons:
                db.add(coupon)
            
            await db.commit()
            print(f"✅ Seeded {len(coupons)} coupons")
            
            print("🎉 Database seeding completed successfully!")
    
        except Exception as e:
            print(f"❌ Error seeding database: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_database())
