"""Check password for existing user"""
import asyncio
from sqlalchemy import text
from app.database import engine
from app.auth import verify_password

async def check_user_password():
    """Check if the existing user's password is correct"""
    async with engine.begin() as conn:
        # Get user by email
        result = await conn.execute(
            text("SELECT userid, email, password FROM users WHERE email = :email"),
            {"email": "rudra@gmail.com"}
        )
        user = result.fetchone()
        
        if user:
            print(f"✅ Found user: {user[1]}")
            print(f"   User ID: {user[0]}")
            print(f"   Password hash: {user[2][:50]}...")
            
            # Test verification
            test_password = "Pavi@1234"
            is_valid = verify_password(test_password, user[2])
            print(f"\n🔐 Password '{test_password}' verification: {is_valid}")
            
            if not is_valid:
                print("\n⚠️  Password does not match! The user might have a different password.")
                print("   Try: test123, password123, or the user's actual password")
        else:
            print("❌ User not found")

if __name__ == "__main__":
    asyncio.run(check_user_password())
