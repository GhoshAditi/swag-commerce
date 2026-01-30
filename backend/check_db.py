"""Check database schema and test signup"""
import asyncio
from sqlalchemy import text
from app.database import engine
from app.models import User
from app.auth import hash_password
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db


async def check_database():
    """Check database tables and schema"""
    print("\n=== Checking Database Schema ===\n")
    
    async with engine.begin() as conn:
        # Check users table structure
        print("📋 Users table columns:")
        result = await conn.execute(text("""
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_name='users'
            ORDER BY ordinal_position
        """))
        for row in result:
            print(f"  - {row[0]}: {row[1]} (default: {row[2]}, nullable: {row[3]})")
        
        # Check if tier column exists
        result = await conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='tier'
        """))
        tier_exists = result.fetchone()
        print(f"\n✅ Tier column exists: {tier_exists is not None}")
        
        # Count users
        result = await conn.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        print(f"📊 Total users: {count}")
        
        # Show sample users
        if count > 0:
            result = await conn.execute(text("""
                SELECT userid, email, name, tier, status 
                FROM users 
                LIMIT 3
            """))
            print("\n👥 Sample users:")
            for row in result:
                print(f"  - {row[1]} (Tier {row[3]}, {row[4]})")


async def test_signup():
    """Test creating a new user"""
    print("\n\n=== Testing User Creation ===\n")
    
    async with engine.begin() as conn:
        # Try to create a test user
        test_email = "test_tier_user@example.com"
        
        # Check if user exists
        result = await conn.execute(
            text("SELECT userid FROM users WHERE email = :email"),
            {"email": test_email}
        )
        existing = result.fetchone()
        
        if existing:
            print(f"ℹ️  Test user {test_email} already exists, deleting...")
            await conn.execute(
                text("DELETE FROM users WHERE email = :email"),
                {"email": test_email}
            )
        
        # Insert new user with tier
        hashed_pw = hash_password("test123")
        await conn.execute(text("""
            INSERT INTO users (email, password, name, tier, status)
            VALUES (:email, :password, :name, :tier, :status)
        """), {
            "email": test_email,
            "password": hashed_pw,
            "name": "Test User",
            "tier": 2,
            "status": "active"
        })
        
        print(f"✅ Successfully created user: {test_email} with Tier 2")
        
        # Verify
        result = await conn.execute(
            text("SELECT email, tier, status FROM users WHERE email = :email"),
            {"email": test_email}
        )
        row = result.fetchone()
        print(f"✅ Verified: {row[0]}, Tier {row[1]}, Status: {row[2]}")


if __name__ == "__main__":
    asyncio.run(check_database())
    asyncio.run(test_signup())
