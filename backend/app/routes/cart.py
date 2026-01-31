from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import datetime, timezone

from app.database import get_db
from app.models import Coupon, Cart, CartItem as CartItemModel, Product
from app.schemas import (
    CartCalculateRequest,
    CartCalculateResponse,
    AppliedCouponInfo,
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart Operations"],
)


@router.post(
    "/calculate",
    response_model=CartCalculateResponse,
    summary="Calculate Cart Total",
    description="Calculate cart total with applied coupons and discounts. Apply multiple coupons sequentially.",
    operation_id="calculate_cart_total",
    tags=["Cart Operations"]
)
async def calculate_cart_total(
    request: CartCalculateRequest,
    db: AsyncSession = Depends(get_db),
):
    subtotal = sum(item.price * item.quantity for item in request.items)

    applied_coupons = []
    total_discount = 0.0
    remaining_amount = subtotal

    for coupon_code in request.coupon_codes:
        if remaining_amount <= 0:
            break

        result = await db.execute(
            select(Coupon).where(Coupon.code == coupon_code.upper())
        )
        coupon = result.scalar_one_or_none()

        if not coupon:
            raise HTTPException(status_code=404, detail=f"Coupon '{coupon_code}' not found")

        if not coupon.is_active:
            raise HTTPException(status_code=400, detail="Coupon is inactive")

        if coupon.expires_at:
            now = datetime.now(timezone.utc)
            if coupon.expires_at.replace(tzinfo=timezone.utc) < now:
                raise HTTPException(status_code=400, detail="Coupon expired")

        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            raise HTTPException(status_code=400, detail="Coupon usage limit reached")

        if coupon.makes_free:
            discount_amount = remaining_amount
        elif coupon.discount_type == "percentage":
            discount_amount = remaining_amount * (coupon.discount_value / 100)
        else:
            discount_amount = min(coupon.discount_value, remaining_amount)

        remaining_amount -= discount_amount
        total_discount += discount_amount

        applied_coupons.append(
            AppliedCouponInfo(
                code=coupon.code,
                discount_type=coupon.discount_type,
                discount_value=coupon.discount_value,
                discount_amount=discount_amount,
            )
        )

    final_total = max(0, subtotal - total_discount)

    return CartCalculateResponse(
        subtotal=subtotal,
        applied_coupons=applied_coupons,
        total_discount=total_discount,
        final_total=final_total,
        can_add_more_coupons=final_total > 0,
    )
