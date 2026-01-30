
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import init_db, close_db
from app.routes import products, coupons, orders, analytics, ai, auth, cart, admin_ai

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Initialize database
    await init_db()
    print("✅ Database initialized")
    
    yield
    
    # Shutdown: Close connections
    await close_db()
    print("✅ Database connections closed")


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(products.router, prefix=settings.API_V1_PREFIX)
app.include_router(coupons.router, prefix=settings.API_V1_PREFIX)
app.include_router(cart.router, prefix=settings.API_V1_PREFIX)
app.include_router(orders.router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX)
app.include_router(ai.router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_ai.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "endpoints": {
            "products": f"{settings.API_V1_PREFIX}/products",
            "coupons": f"{settings.API_V1_PREFIX}/coupons/validate",
            "orders": f"{settings.API_V1_PREFIX}/orders",
            "analytics": f"{settings.API_V1_PREFIX}/analytics/dashboard",
            "ai_chat": f"{settings.API_V1_PREFIX}/ai/chat"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
