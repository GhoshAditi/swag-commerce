"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


# =========================
# Product Schemas
# =========================

class TieredPriceSchema(BaseModel):
    """Tiered pricing for bulk discounts"""
    min_quantity: int = Field(gt=0)
    price: float = Field(gt=0)

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(BaseModel):
    """Product response schema"""
    id: str
    name: str
    description: Optional[str] = None
    base_price: float
    stock_quantity: int
    image_url: str
    category: str
    tier: int = 1
    tiered_pricing: List[TieredPriceSchema] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================
# Coupon Schemas
# =========================

class CouponValidateRequest(BaseModel):
    """Coupon validation request"""
    code: str


class CouponValidateResponse(BaseModel):
    """Coupon validation response"""
    valid: bool
    discount_type: str
    discount_value: float
    makes_free: bool = False


class CouponResponse(BaseModel):
    """Coupon details response"""
    id: str
    code: str
    discount_type: str
    discount_value: float
    expires_at: Optional[datetime] = None
    usage_limit: Optional[int] = None
    used_count: int
    makes_free: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# =========================
# Order Schemas
# =========================

class OrderItemCreate(BaseModel):
    """Order item creation"""
    product_id: str
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    """Order creation request"""
    customer_email: str
    customer_name: Optional[str] = None
    items: List[OrderItemCreate]
    coupon_code: Optional[str] = None


class OrderItemResponse(BaseModel):
    """Order item response"""
    product_id: str
    product_name: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    """Order response schema"""
    id: str
    customer_email: str
    customer_name: Optional[str] = None
    items: List[OrderItemResponse]
    subtotal: float
    discount: float
    total: float
    status: str
    applied_coupon_code: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================
# Auth Schemas
# =========================

class UserSignUp(BaseModel):
    """User registration request"""
    email: str = Field(
        ...,
        pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    password: str = Field(..., min_length=6)
    name: Optional[str] = None
    server: Optional[str] = None
    tier: int = Field(default=1, ge=1, le=3)


class UserSignIn(BaseModel):
    """User login request"""
    email: str
    password: str


class UserResponse(BaseModel):
    """User response schema"""
    id: str
    email: str
    name: Optional[str] = None
    tier: int = 1
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    """Authentication response with token"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# =========================
# Cart Calculation Schemas
# =========================

class CartItemInput(BaseModel):
    """Minimal cart item input for calculation"""
    product_id: str
    price: float = Field(gt=0)
    quantity: int = Field(gt=0)


class CartCalculateRequest(BaseModel):
    """Calculate cart total with coupons"""
    items: List[CartItemInput]
    coupon_codes: List[str] = []


class AppliedCouponInfo(BaseModel):
    """Information about an applied coupon"""
    code: str
    discount_type: str
    discount_value: float
    discount_amount: float


class CartCalculateResponse(BaseModel):
    """Cart calculation response"""
    subtotal: float
    applied_coupons: List[AppliedCouponInfo]
    total_discount: float
    final_total: float
    can_add_more_coupons: bool


# =========================
# Cart / Checkout Schemas
# =========================

class CartItem(BaseModel):
    """Cart item with display info"""
    product_id: str
    quantity: int = Field(gt=0)
    name: str
    price: float
    image_url: str


class PlaceOrderRequest(BaseModel):
    """Place order request"""
    items: List[CartItem]
    coupon_codes: List[str] = []


class OrderHistoryItem(BaseModel):
    """Order history item"""
    order_id: str
    items: List[OrderItemResponse]
    total_amount: float
    items_count: int
    coupons_used: List[str]
    created_at: datetime


class BillResponse(BaseModel):
    """Bill / Invoice response"""
    order_id: str
    customer_name: str
    customer_email: str
    items: List[OrderItemResponse]
    subtotal: float
    applied_coupons: List[AppliedCouponInfo]
    total_discount: float
    final_total: float
    created_at: datetime
    status: str


# =========================
# AI Chat Schemas
# =========================

class ChatRequest(BaseModel):
    """AI chat request"""
    question: str


class ChatResponse(BaseModel):
    """AI chat response"""
    answer: str
    context_used: dict = {}
