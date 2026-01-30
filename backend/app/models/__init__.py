"""
Database models using SQLAlchemy ORM with async support
"""
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid


def generate_uuid():
    """Generate UUID string for primary keys"""
    return str(uuid.uuid4())


class Product(Base):
    """Product model with tiered pricing support"""
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String, nullable=True)
    base_price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    image_url = Column(String, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    tier = Column(Integer, default=1, nullable=False)  # Product tier: 1, 2, or 3
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tiered_pricing = relationship("TieredPricing", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")


class TieredPricing(Base):
    """Bulk pricing tiers for products"""
    __tablename__ = "tiered_pricing"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    min_quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    
    # Relationships
    product = relationship("Product", back_populates="tiered_pricing")


class Coupon(Base):
    """Coupon model with validation fields"""
    __tablename__ = "coupons"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, nullable=False, index=True)
    discount_type = Column(String(20), nullable=False)
    discount_value = Column(Float, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    usage_limit = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0, nullable=False)
    makes_free = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    """Order model with customer and payment info"""
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    customer_email = Column(String(255), nullable=False, index=True)
    customer_name = Column(String(255), nullable=True)
    items_brought = Column(JSON, nullable=True)  # List of items with name and quantity
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, default=0, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed", nullable=False)
    applied_coupon_code = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Individual items in an order"""
    __tablename__ = "order_items"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    product_name = Column(String(255), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class User(Base):
    """User model for authentication and order tracking"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid, name="userid")
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed password
    name = Column(String(255), nullable=True)
    tier = Column(Integer, default=1, nullable=False)  # User tier: 1, 2, or 3
   
    order_history = Column(JSON, default=list, nullable=False)  # List of order IDs
    coupons_used = Column(JSON, default=list, nullable=False)  # List of coupon codes used
    status = Column(String(50), default="active", nullable=False)  # active, inactive, suspended
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    cart = relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Cart(Base):
    """Shopping cart model for persistent cart storage"""
    __tablename__ = "carts"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.userid", ondelete="CASCADE"), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    """Individual items in a shopping cart"""
    __tablename__ = "cart_items"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    cart_id = Column(String, ForeignKey("carts.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")
