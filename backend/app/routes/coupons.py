"""Coupons API routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import List

from app.database import get_db
from app.models import Coupon
from app.schemas import CouponValidateRequest, CouponValidateResponse, CouponResponse

router = APIRouter(prefix="/coupons", tags=["coupons"])


@router.get("/", response_model=List[CouponResponse])
async def get_available_coupons(db: AsyncSession = Depends(get_db)):
    """
    Get all available and active coupons
    """
    query = select(Coupon).where(
        Coupon.is_active == True
    )
    
    result = await db.execute(query)
    coupons = result.scalars().all()
    
    # Filter out expired coupons - make current_time timezone-aware
    from datetime import timezone
    current_time = datetime.now(timezone.utc)
    available_coupons = [
        coupon for coupon in coupons
        if coupon.expires_at is None or coupon.expires_at.replace(tzinfo=timezone.utc) > current_time
    ]
    
    # Filter out coupons that have reached usage limit
    available_coupons = [
        coupon for coupon in available_coupons
        if coupon.usage_limit is None or coupon.used_count < coupon.usage_limit
    ]
    
    return available_coupons


@router.get("/{code}", response_model=CouponResponse)
async def get_coupon_by_code(code: str, db: AsyncSession = Depends(get_db)):
    """
    Get a specific coupon by code
    """
    query = select(Coupon).where(Coupon.code == code.upper())
    result = await db.execute(query)
    coupon = result.scalar_one_or_none()
    
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    return coupon


@router.post("/validate", response_model=CouponValidateResponse)
async def validate_coupon(
    request: CouponValidateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Validate a coupon code"""
    result = await db.execute(
        select(Coupon).where(Coupon.code == request.code.upper())
    )
    coupon = result.scalar_one_or_none()
    
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    
    # Validate coupon is active
    if not coupon.is_active:
        raise HTTPException(status_code=400, detail="Coupon is inactive and cannot be used")
    
    # Validate coupon expiration
    if coupon.expires_at:
        from datetime import timezone
        current_time = datetime.now(timezone.utc)
        expires_at = coupon.expires_at.replace(tzinfo=timezone.utc) if coupon.expires_at.tzinfo is None else coupon.expires_at
        if expires_at < current_time:
            raise HTTPException(
                status_code=400, 
                detail=f"Coupon has expired on {expires_at.strftime('%Y-%m-%d')} and cannot be used"
            )
    
    # Validate coupon usage limit
    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        raise HTTPException(
            status_code=400, 
            detail=f"Coupon has reached its usage limit ({coupon.usage_limit} uses) and cannot be used"
        )
    
    return {
        "valid": True,
        "discount_type": coupon.discount_type,
        "discount_value": coupon.discount_value,
        "makes_free": coupon.makes_free
    }
