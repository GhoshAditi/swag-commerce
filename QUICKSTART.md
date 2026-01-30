# 🎯 Complete Integration Guide - Database-Driven Backend

## What Changed?

Your backend has been **completely transformed** from using mock data to a **real database** with proper business logic, validation, and transactional operations.

---

## 📦 NEW Files Created

1. **`backend/database.py`** (250+ lines)
   - SQLAlchemy ORM models
   - Database connection setup
   - Seed data function
   
2. **`backend/schemas.py`** (100+ lines)
   - Pydantic validation schemas
   - Request/response models
   
3. **`backend/main.py`** (UPDATED - 500+ lines)
   - Database integration
   - Complete CRUD operations
   - Business logic implementation
   
4. **`backend/setup.ps1`**
   - Automated setup script for Windows
   
5. **`BACKEND_DATABASE_INTEGRATION.md`**
   - Complete documentation

---

## 🎯 Step-by-Step Instructions

### Option 1: Automated Setup (Recommended)

Just run this **ONE** command in PowerShell:

```powershell
cd c:\Users\ADITI\port\backend
.\setup.ps1
```

This will automatically:
- Create virtual environment (if needed)
- Install all dependencies
- Initialize database
- Seed sample data

Then start the server:
```powershell
uvicorn main:app --reload
```

### Option 2: Manual Setup

If you prefer manual control:

```powershell
# 1. Navigate to backend
cd c:\Users\ADITI\port\backend

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Initialize database
python database.py

# 5. Start server
uvicorn main:app --reload
```

---

## ✅ What You Can Test Now

### 1. Products from Database
```
GET http://localhost:8000/api/products
```
Returns 6 products with tiered pricing from database (not mock data!)

### 2. Coupon Validation (Edge Cases)

**Valid Coupon:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "SUMMER50"}'
```

**Expired Coupon:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "EXPIRED2025"}'
```
Should return: `"message": "Coupon code 'EXPIRED2025' has expired"`

**Usage Limit Reached:**
After using `LIMITED2` twice:
```bash
curl -X POST http://localhost:8000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "LIMITED2"}'
```
Should return: `"message": "Coupon code 'LIMITED2' has reached its usage limit"`

### 3. Order with Stock Validation

Create an order and watch stock decrease:
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "items": [{"productId": "your-product-id", "quantity": 2, "price": 25.00}],
    "subtotal": 50.00,
    "discount": 0,
    "total": 50.00
  }'
```

Then check the product stock again - it should be reduced by 2!

### 4. Analytics Dashboard

Get real-time analytics:
```
GET http://localhost:8000/api/analytics/dashboard
```

Returns:
- Total revenue
- Total orders
- Top 5 products by revenue
- Low stock alerts
- Revenue by day (last 7 days)

---

## 🗄️ Database Schema

Your SQLite database (`swagcommerce.db`) has these tables:

### `products`
```sql
- id (UUID, Primary Key)
- name (String)
- description (Text)
- base_price (Float)
- stock_quantity (Integer)
- image_url (String)
- category (String)
- created_at (DateTime)
- updated_at (DateTime)
```

### `tiered_pricing`
```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key → products)
- min_quantity (Integer)
- price (Float)
```

### `coupons`
```sql
- id (UUID, Primary Key)
- code (String, Unique)
- discount_type ("percentage" or "fixed")
- discount_value (Float)
- expires_at (DateTime, Nullable)
- usage_limit (Integer, Nullable)
- used_count (Integer, Default: 0)
- makes_free (Boolean, Default: False)
- is_active (Boolean, Default: True)
```

### `orders`
```sql
- id (UUID, Primary Key)
- customer_email (String)
- customer_name (String)
- subtotal (Float)
- discount (Float)
- total (Float)
- status (String, Default: "confirmed")
- applied_coupon_code (String, Nullable)
- created_at (DateTime)
```

### `order_items`
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key → orders)
- product_id (UUID, Foreign Key → products)
- quantity (Integer)
- unit_price (Float)
- total_price (Float)
```

---

## 🧪 Seeded Test Data

### Products (6 items)
1. **Premium Company T-Shirt** - $25, 150 in stock
2. **Branded Water Bottle** - $15, 200 in stock
3. **Custom Laptop Stickers** - $8, 500 in stock
4. **Executive Notebook** - $35, 75 in stock
5. **Wireless Mouse** - $45, 120 in stock
6. **Canvas Tote Bag** - $12, 300 in stock

All have tiered pricing (discounts for bulk orders)

### Coupons (4 items)
1. **SUMMER50** - 50% off, no expiration
2. **FREESHIP** - Makes order free, no expiration
3. **BULK10** - 10% off, no expiration
4. **EXPIRED2025** - Expired (for testing), should fail validation
5. **LIMITED2** - Usage limit of 2, test usage tracking

---

## 🔍 Business Logic Implemented

### 1. Coupon Validation Pipeline
```
Check exists → Check active → Check expired → Check usage limit → Apply discount
```

Each failure returns a specific error message.

### 2. Order Transaction Flow
```
Verify products exist
    ↓
Check stock availability
    ↓
Create order (BEGIN TRANSACTION)
    ↓
Create order items
    ↓
Decrement stock
    ↓
Increment coupon usage
    ↓
COMMIT
```

If ANY step fails → ROLLBACK entire transaction!

### 3. Analytics Aggregation
All metrics computed from real database queries:
- Revenue = SUM of all orders
- Top products = GROUP BY product with highest revenue
- Low stock = Products with quantity < 50
- Daily revenue = GROUP BY date

---

## 🚀 Full Stack Testing Flow

### Step 1: Start Backend
```powershell
cd c:\Users\ADITI\port\backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Backend running at: http://localhost:8000

### Step 2: Start Frontend (New Terminal)
```powershell
cd c:\Users\ADITI\port
npm run dev
```

Frontend running at: http://localhost:3000

### Step 3: Test User Flow
1. Visit http://localhost:3000
2. Click "Browse Marketplace"
3. **Products load from database** (not mock data)
4. Add items to cart
5. Try coupon codes:
   - `SUMMER50` → Should work
   - `EXPIRED2025` → Should show "expired" error
6. Place order
7. Check admin dashboard → See real analytics

### Step 4: Verify in Database
You can inspect the database directly:
```powershell
sqlite3 swagcommerce.db
```

Then run SQL:
```sql
-- See all products
SELECT * FROM products;

-- See all coupons with usage
SELECT code, used_count, usage_limit, expires_at FROM coupons;

-- See all orders
SELECT * FROM orders;

-- See stock levels
SELECT name, stock_quantity FROM products;
```

---

## 🎨 Frontend Connection

Your frontend (`src/lib/api.ts`) already has the structure to connect. Just make sure `.env.local` has:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The frontend will automatically:
- Fetch products from database
- Validate coupons with edge cases
- Create orders with stock validation
- Display real analytics

---

## 📊 Interactive API Docs

Once backend is running, visit:
**http://localhost:8000/docs**

You'll see Swagger UI with:
- All endpoints listed
- Request/response schemas
- "Try it out" buttons to test directly
- Example payloads

---

## 🐛 Common Issues & Solutions

### "Module 'database' not found"
**Solution:** Make sure you're in the backend directory and `database.py` exists.

### "No module named 'sqlalchemy'"
**Solution:** Install dependencies: `pip install -r requirements.txt`

### "Database file not found"
**Solution:** Run `python database.py` to create the database.

### "CORS error in browser"
**Solution:** 
- Backend must be running on port 8000
- Frontend must be on port 3000
- Both must be running simultaneously

### "Products not loading"
**Solution:**
1. Check backend logs for errors
2. Verify database has products: Open `swagcommerce.db` in DB browser
3. Test endpoint directly: http://localhost:8000/api/products
4. Check browser console for network errors

---

## 📈 Production Considerations

For production deployment, consider:

1. **PostgreSQL Instead of SQLite**
   ```python
   # In database.py, change:
   DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@host/db")
   ```

2. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   GEMINI_API_KEY=your-api-key
   ```

3. **Database Migrations**
   Use Alembic for schema changes:
   ```bash
   pip install alembic
   alembic init migrations
   ```

4. **Connection Pooling**
   Already configured in `database.py` with proper session management

---

## ✅ Final Checklist

Before you're done, verify:

- [ ] Backend starts without errors
- [ ] Database file `swagcommerce.db` created
- [ ] http://localhost:8000/api/products returns 6 products
- [ ] http://localhost:8000/docs shows Swagger UI
- [ ] Frontend loads products from backend
- [ ] Can add to cart and see tiered pricing
- [ ] Coupon `SUMMER50` works
- [ ] Coupon `EXPIRED2025` shows error
- [ ] Can place order
- [ ] Stock decreases after order
- [ ] Admin dashboard shows real data
- [ ] AI chat responds with analytics

---

## 🎉 You're Ready!

Your Swag Commerce platform now has:
✅ Real database persistence  
✅ Complete business logic  
✅ Coupon validation with edge cases  
✅ Transactional order processing  
✅ Stock management  
✅ Real-time analytics  
✅ API documentation  

**Next step:** Run `.\setup.ps1` and start building your swag empire! 🚀
