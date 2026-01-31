"""
Script to create an admin user
Run this script once to create the admin account
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.models import User
from app.auth import hash_password
from app.config import get_settings

settings = get_settings()

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
)

# Create session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def create_admin_user():
    """Create admin user if it doesn't exist"""
    async with async_session() as session:
        # Check if admin already exists
        result = await session.execute(
            select(User).where(User.email == "admin@swagcommerce.com")
        )
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            print("✅ Admin user already exists!")
            print(f"   Email: admin@swagcommerce.com")
            print(f"   ID: {existing_admin.id}")
            return
        
        # Create admin user
        hashed_password = hash_password("admin123")
        admin_user = User(
            email="admin@swagcommerce.com",
            password=hashed_password,
            name="Administrator",
            tier=3,  # Highest tier
            status="active"
        )
        
        session.add(admin_user)
        await session.commit()
        await session.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"   Email: admin@swagcommerce.com")
        print(f"   Password: admin123")
        print(f"   ID: {admin_user.id}")
        print("\n⚠️  Please change the password after first login!")


async def main():
    print("Creating admin user...")
    await create_admin_user()
    await engine.dispose()
    print("\nDone!")


if __name__ == "__main__":
    asyncio.run(main())
