
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import User
from app.schemas import UserSignUp, UserSignIn, AuthResponse, UserResponse
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse)
async def sign_up(user_data: UserSignUp, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        password=hashed_password,
        name=user_data.name,
        server=user_data.server,
        tier=user_data.tier,
        status="active"
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id, "email": new_user.email})
    
    # Return user and token
    user_response = UserResponse(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        tier=new_user.tier,
        status=new_user.status,
        created_at=new_user.created_at
    )
    
    return AuthResponse(
        access_token=access_token,
        user=user_response
    )


@router.post("/signin", response_model=AuthResponse)
async def sign_in(credentials: UserSignIn, db: AsyncSession = Depends(get_db)):
    """Login an existing user"""
    
    # Find user by email
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user is active
    if user.status != "active":
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    
    # Return user and token
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        tier=user.tier if hasattr(user, 'tier') else 1,
        status=user.status,
        created_at=user.created_at
    )
    
    return AuthResponse(
        access_token=access_token,
        user=user_response
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str, db: AsyncSession = Depends(get_db)):
    """Get current user from token"""
    from app.auth import decode_access_token
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        tier=user.tier if hasattr(user, 'tier') else 1,
        status=user.status,
        created_at=user.created_at
    )


@router.put("/update-tier/{user_id}")
async def update_user_tier(
    user_id: str,
    tier: int,
    db: AsyncSession = Depends(get_db)
):
    """Update user tier (admin function)"""
    if tier not in [1, 2, 3]:
        raise HTTPException(status_code=400, detail="Tier must be 1, 2, or 3")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.tier = tier
    await db.commit()
    
    return {"message": f"User tier updated to {tier}", "user_id": user_id, "tier": tier}
