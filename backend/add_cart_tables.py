"""Add cart and cart_items tables to database"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def migrate():
    """Create cart tables"""
    async with engine.begin() as conn:
        print("Creating cart tables...")
        
        # Check if carts table exists
        result = await conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='carts'
        """))
        if result.fetchone() is None:
            # Create carts table
            await conn.execute(text("""
                CREATE TABLE carts (
                    id VARCHAR PRIMARY KEY,
                    user_id VARCHAR NOT NULL UNIQUE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE,
                    FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE
                )
            """))
            print("✅ Created carts table")
        else:
            print("ℹ️  carts table already exists")
        
        # Check if cart_items table exists
        result = await conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='cart_items'
        """))
        if result.fetchone() is None:
            # Create cart_items table
            await conn.execute(text("""
                CREATE TABLE cart_items (
                    id VARCHAR PRIMARY KEY,
                    cart_id VARCHAR NOT NULL,
                    product_id VARCHAR NOT NULL,
                    quantity INTEGER NOT NULL DEFAULT 1,
                    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                )
            """))
            
            # Create index for faster lookups
            await conn.execute(text("""
                CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id)
            """))
            await conn.execute(text("""
                CREATE INDEX idx_cart_items_product_id ON cart_items(product_id)
            """))
            
            print("✅ Created cart_items table with indexes")
        else:
            print("ℹ️  cart_items table already exists")
        
        print("\n✅ Cart tables migration completed successfully!")


if __name__ == "__main__":
    asyncio.run(migrate())
