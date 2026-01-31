"""Verify cart tables schema"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def verify_schema():
    """Check cart tables structure"""
    print("\n=== Cart Database Schema Verification ===\n")
    
    async with engine.begin() as conn:
        # Check carts table
        print("📋 CARTS TABLE:")
        result = await conn.execute(text("""
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_name='carts'
            ORDER BY ordinal_position
        """))
        for row in result:
            print(f"  - {row[0]}: {row[1]} (default: {row[2]}, nullable: {row[3]})")
        
        # Check cart_items table
        print("\n📋 CART_ITEMS TABLE:")
        result = await conn.execute(text("""
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_name='cart_items'
            ORDER BY ordinal_position
        """))
        for row in result:
            print(f"  - {row[0]}: {row[1]} (default: {row[2]}, nullable: {row[3]})")
        
        # Check foreign keys
        print("\n🔗 FOREIGN KEY CONSTRAINTS:")
        result = await conn.execute(text("""
            SELECT
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_name IN ('carts', 'cart_items')
        """))
        for row in result:
            print(f"  - {row[0]}.{row[1]} → {row[2]}.{row[3]}")
        
        # Check indexes
        print("\n📊 INDEXES:")
        result = await conn.execute(text("""
            SELECT
                tablename,
                indexname,
                indexdef
            FROM pg_indexes
            WHERE tablename IN ('carts', 'cart_items')
            ORDER BY tablename, indexname
        """))
        for row in result:
            print(f"  - {row[0]}.{row[1]}")
        
        # Count existing data
        print("\n📈 DATA COUNT:")
        result = await conn.execute(text("SELECT COUNT(*) FROM carts"))
        cart_count = result.scalar()
        print(f"  - Carts: {cart_count}")
        
        result = await conn.execute(text("SELECT COUNT(*) FROM cart_items"))
        item_count = result.scalar()
        print(f"  - Cart Items: {item_count}")
        
        print("\n✅ Schema verification completed!\n")


if __name__ == "__main__":
    asyncio.run(verify_schema())
