"""Update password for existing user"""
import asyncio
from sqlalchemy import text
from app.database import engine
from app.auth import hash_password

async def update_password():
    """Update password for rudra@gmail.com"""
    async with engine.begin() as conn:
        email = "rudra@gmail.com"
        new_password = "Pavi@1234"
        
        # Hash the new password
        hashed = hash_password(new_password)
        
        # Update the user's password
        await conn.execute(
            text("UPDATE users SET password = :password WHERE email = :email"),
            {"password": hashed, "email": email}
        )
        
        print(f"✅ Updated password for {email}")
        print(f"   New password: {new_password}")
        print(f"   Hash: {hashed[:50]}...")

if __name__ == "__main__":
    asyncio.run(update_password())
