"""
Seed database with sample orders for analytics
Usage: python seed_orders.py
"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select

from app.database import AsyncSessionLocal, init_db
from app.models import Product, Order, OrderItem, User
from app.auth import hash_password


async def seed_orders():
    """Create sample orders for analytics dashboard"""
    
    await init_db()
    print("✅ Database initialized")
    
    async with AsyncSessionLocal() as db:
        try:
            # Get all products
            result = await db.execute(select(Product))
            products = result.scalars().all()
            
            if not products:
                print("❌ No products found. Please run seed.py first!")
                return
            
            print(f"Found {len(products)} products")
            
            # Create sample users if they don't exist
            result = await db.execute(select(User).where(User.email == "customer1@test.com"))
            user1 = result.scalar_one_or_none()
            
            if not user1:
                user1 = User(
                    email="customer1@test.com",
                    password=hash_password("password123"),
                    name="John Doe",
                    tier=2
                )
                db.add(user1)
                await db.commit()
                await db.refresh(user1)
                print("✅ Created customer1@test.com")
            
            result = await db.execute(select(User).where(User.email == "customer2@test.com"))
            user2 = result.scalar_one_or_none()
            
            if not user2:
                user2 = User(
                    email="customer2@test.com",
                    password=hash_password("password123"),
                    name="Jane Smith",
                    tier=3
                )
                db.add(user2)
                await db.commit()
                await db.refresh(user2)
                print("✅ Created customer2@test.com")
            
            # Create sample orders for last 7 days
            orders_created = 0
            
            for day_offset in range(7):
                order_date = datetime.utcnow() - timedelta(days=6-day_offset)
                
                # Create 2-3 orders per day
                num_orders = 2 if day_offset % 2 == 0 else 3
                
                for i in range(num_orders):
                    # Select random products
                    import random
                    selected_products = random.sample(products, min(3, len(products)))
                    
                    # Calculate order totals
                    subtotal = 0
                    order_items_data = []
                    
                    for product in selected_products:
                        quantity = random.randint(10, 50)
                        unit_price = product.base_price
                        total_price = unit_price * quantity
                        subtotal += total_price
                        
                        order_items_data.append({
                            'product': product,
                            'quantity': quantity,
                            'unit_price': unit_price,
                            'total_price': total_price
                        })
                    
                    # Apply random discount (0-20%)
                    discount_percent = random.choice([0, 5, 10, 15, 20])
                    discount = subtotal * (discount_percent / 100)
                    total = subtotal - discount
                    
                    # Create order
                    customer = user1 if i % 2 == 0 else user2
                    order = Order(
                        customer_email=customer.email,
                        customer_name=customer.name,
                        subtotal=subtotal,
                        discount=discount,
                        total=total,
                        status="confirmed",
                        created_at=order_date
                    )
                    db.add(order)
                    await db.flush()
                    
                    # Create order items
                    for item_data in order_items_data:
                        order_item = OrderItem(
                            order_id=order.id,
                            product_id=item_data['product'].id,
                            product_name=item_data['product'].name,
                            quantity=item_data['quantity'],
                            unit_price=item_data['unit_price'],
                            total_price=item_data['total_price']
                        )
                        db.add(order_item)
                    
                    orders_created += 1
            
            await db.commit()
            print(f"✅ Created {orders_created} sample orders")
            print("🎉 Order seeding completed successfully!")
            
        except Exception as e:
            print(f"❌ Error seeding orders: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_orders())
