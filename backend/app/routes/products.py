"""Products API routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.database import get_db
from app.models import Product, User
from app.schemas import ProductResponse
from app.auth import get_current_user_optional

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[ProductResponse])
async def get_products(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get products based on user's tier.
    - Unauthenticated users: see Tier 1 products only
    - Tier 1 users: see Tier 1 products
    - Tier 2 users: see Tier 1 and 2 products
    - Tier 3 users: see all products (Tier 1, 2, and 3)
    """
    # Get user's tier (default to 1 if not authenticated)
    user_tier = current_user.tier if current_user and hasattr(current_user, 'tier') else 1
    
    # Query products based on tier
    result = await db.execute(
        select(Product)
        .where(Product.tier <= user_tier)
        .options(selectinload(Product.tiered_pricing))
        .order_by(Product.created_at.desc())
    )
    products = result.scalars().all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    """Get single product by ID"""
    result = await db.execute(
        select(Product)
        .where(Product.id == product_id)
        .options(selectinload(Product.tiered_pricing))
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product
