from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone
import google.generativeai as genai

from app.database import get_db
from app.models import Product, Order, OrderItem, Coupon
from app.schemas import ChatRequest, ChatResponse
from app.config import get_settings

settings = get_settings()

router = APIRouter(
    prefix="/admin/ai", 
    tags=["Admin AI"],
    include_in_schema=True
)


async def get_database_context(db: AsyncSession) -> str:
    """Fetch database context for AI responses"""
    context_parts = []
    
    # Get product inventory
    products_result = await db.execute(select(Product).order_by(Product.stock_quantity.asc()).limit(10))
    products = products_result.scalars().all()
    
    context_parts.append("=== INVENTORY STATUS ===")
    context_parts.append(f"Total Products: {len(products)}")
    context_parts.append("\nLow Stock Products:")
    for product in products:
        context_parts.append(f"- {product.name}: {product.stock_quantity} units (${product.base_price} each)")
    
    # Get today's revenue
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today_result = await db.execute(select(Order).where(Order.created_at >= today_start))
    orders_today = orders_today_result.scalars().all()
    
    total_revenue_today = sum(order.total for order in orders_today)
    context_parts.append(f"\n=== TODAY'S SALES ===")
    context_parts.append(f"Orders Today: {len(orders_today)}")
    context_parts.append(f"Total Revenue Today: ${total_revenue_today:.2f}")
    
    # Get total revenue
    all_orders_result = await db.execute(select(func.sum(Order.total)))
    all_revenue = all_orders_result.scalar() or 0
    context_parts.append(f"Total Revenue (All Time): ${all_revenue:.2f}")
    
    # Get active coupons
    coupons_result = await db.execute(select(Coupon).where(Coupon.is_active == True))
    coupons = coupons_result.scalars().all()
    
    context_parts.append(f"\n=== ACTIVE COUPONS ===")
    context_parts.append(f"Total Active Coupons: {len(coupons)}")
    for coupon in coupons[:5]:  # Top 5
        discount_info = "Makes order FREE" if coupon.makes_free else (
            f"{coupon.discount_value}% off" if coupon.discount_type == "percentage" 
            else f"${coupon.discount_value} off"
        )
        context_parts.append(f"- {coupon.code}: {discount_info} | Used: {coupon.used_count} times")
    
    return "\n".join(context_parts)


@router.post("/chat", response_model=ChatResponse)
async def admin_ai_chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """Admin AI chat endpoint with database context"""
    try:
        # Validate API key
        if not settings.GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
        
        # Get database context
        db_context = await get_database_context(db)
        
        # Create the prompt with context
        system_prompt = """You are an intelligent admin assistant for SwagCommerce.
You have access to real-time database information including inventory, sales, orders, and coupons.

Your role is to:
1. Answer questions about inventory, stock levels, and product information
2. Provide sales analytics and revenue information
3. Give insights about order history and customer behavior
4. Be concise and accurate

Current Database Context:
{context}

User Question: {question}

IMPORTANT FORMATTING RULES:
- Generate response in PLAIN TEXT format (no markdown)
- Use proper line breaks for readability (\n for new lines)
- Use CAPS or ALL UPPERCASE for emphasis on important numbers, metrics, and key terms
- Use proper indentation with spaces or tabs for hierarchical data
- Use bullet points with dashes (-) or asterisks (*) for lists
- Use separators like === or --- for sections
- Keep numbers, percentages, and currency values clear and prominent
- Structure data in tables using spaces for alignment when showing multiple items

Provide a clear, well-structured answer based on the data above."""

        prompt = system_prompt.format(context=db_context, question=request.question)
        
        # Call Gemini API with generation config for better text formatting
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(
            'gemini-2.0-flash-exp',
            generation_config={
                'temperature': 0.7,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 2048,
            }
        )
        response = model.generate_content(prompt)
        
        return ChatResponse(
            answer=response.text,
            context_used={"message": "Database context included in response"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"AI Error: {str(e)}")
        print(error_details)
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
