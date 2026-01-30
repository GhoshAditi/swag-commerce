# 🗄️ PostgreSQL Database Setup Guide

## Why PostgreSQL?

PostgreSQL is chosen as the **production-ready database** for this project because:
- ✅ **Robust & Reliable**: Industry standard for production applications
- ✅ **ACID Compliant**: Full transaction support (critical for orders)
- ✅ **Async Support**: Works perfectly with FastAPI async patterns
- ✅ **Scalable**: Handles millions of records efficiently
- ✅ **Free Hosting**: Railway, Heroku, Render offer free tiers
- ✅ **Easy to Use**: pgAdmin GUI for management

---

## 📦 Option 1: Local PostgreSQL (Development)

### Step 1: Install PostgreSQL

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (PostgreSQL 16+)
3. During installation:
   - Remember your password (you'll need it!)
   - Port: Keep default **5432**
   - Install pgAdmin (GUI tool)

**Alternative (Chocolatey):**
```powershell
choco install postgresql
```

### Step 2: Create Database

**Option A - Using pgAdmin (GUI):**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `swagcommerce`
4. Click "Save"

**Option B - Using Command Line:**
```powershell
# Open PostgreSQL shell
psql -U postgres

# Create database
CREATE DATABASE swagcommerce;

# Exit
\q
```

### Step 3: Configure Environment

Create `.env` file in `backend` folder:

```bash
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/swagcommerce
```

**Important:** Replace `yourpassword` with your actual PostgreSQL password!

### Step 4: Install Python Dependencies

```powershell
cd c:\Users\ADITI\port\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 5: Seed Database

```powershell
# Create tables and add test data
python -m app.seed
```

You should see:
```
✅ Database initialized
🌱 Seeding database...
✅ Created 6 products with tiered pricing
✅ Created 5 coupons
🎉 Database seeded successfully!
```

### Step 6: Start Server

```powershell
uvicorn app.main:app --reload
```

Visit: **http://localhost:8000/docs** to see API documentation!

---

## ☁️ Option 2: Railway (Free Cloud Database)

Railway offers **$5 free credits** + 500 hours of usage per month.

### Step 1: Create Railway Account

1. Go to: https://railway.app/
2. Sign up with GitHub (easiest)

### Step 2: Create PostgreSQL Database

1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Wait for deployment (~30 seconds)

### Step 3: Get Connection URL

1. Click your PostgreSQL service
2. Go to "Connect" tab
3. Copy the **"Postgres Connection URL"**

It looks like:
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### Step 4: Convert to Async Format

Change `postgresql://` to `postgresql+asyncpg://`:

```bash
DATABASE_URL=postgresql+asyncpg://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### Step 5: Update .env File

Create `.env` in backend folder:

```bash
DATABASE_URL=postgresql+asyncpg://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### Step 6: Install Dependencies & Seed

```powershell
cd c:\Users\ADITI\port\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed
```

### Step 7: Start Server

```powershell
uvicorn app.main:app --reload
```

Your app now uses a **cloud database**! 🎉

---

## 🔧 Troubleshooting

### Error: "Could not connect to server"

**Check:**
1. PostgreSQL service is running
   ```powershell
   # Windows: Check Services
   Get-Service -Name postgresql*
   ```
2. Port 5432 is not blocked by firewall
3. Password in DATABASE_URL is correct

### Error: "password authentication failed"

**Fix:** Update password in `.env`:
```bash
DATABASE_URL=postgresql+asyncpg://postgres:CORRECT_PASSWORD@localhost:5432/swagcommerce
```

### Error: "database does not exist"

**Fix:** Create database first:
```powershell
psql -U postgres -c "CREATE DATABASE swagcommerce;"
```

### Error: "asyncpg module not found"

**Fix:** Install async dependencies:
```powershell
pip install asyncpg psycopg2-binary
```

---

## 📊 Verify Database

### Using pgAdmin (GUI)

1. Open pgAdmin
2. Connect to your database
3. Expand: Databases → swagcommerce → Schemas → public → Tables
4. You should see:
   - `products`
   - `tiered_pricing`
   - `coupons`
   - `orders`
   - `order_items`

### Using SQL Query

```sql
-- Count products
SELECT COUNT(*) FROM products;

-- Show all coupons
SELECT code, discount_value, expires_at FROM coupons;

-- Check stock levels
SELECT name, stock_quantity FROM products ORDER BY stock_quantity;
```

---

## 🔄 Reset Database

If you need to start fresh:

```powershell
# Drop and recreate database
psql -U postgres

DROP DATABASE swagcommerce;
CREATE DATABASE swagcommerce;
\q

# Reseed
python -m app.seed
```

---

## 🚀 Production Deployment

For production, use one of these:

### Railway (Recommended)
- Free tier: $5 credits
- Steps above ☝️

### Heroku PostgreSQL
```bash
# Add Heroku Postgres addon
heroku addons:create heroku-postgresql:hobby-dev

# Get DATABASE_URL
heroku config:get DATABASE_URL

# Convert to async format and add to .env
```

### Render
1. Go to: https://render.com/
2. Create new PostgreSQL database
3. Copy "External Database URL"
4. Convert to async format

---

## ✅ Success Checklist

Before moving forward, verify:

- [ ] PostgreSQL installed (local or Railway)
- [ ] Database `swagcommerce` created
- [ ] `.env` file created with correct `DATABASE_URL`
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Database seeded: `python -m app.seed`
- [ ] Server starts: `uvicorn app.main:app --reload`
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Products endpoint works: http://localhost:8000/api/products

---

## 🎯 Quick Commands Reference

```powershell
# Setup
cd c:\Users\ADITI\port\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Seed database
python -m app.seed

# Start server
uvicorn app.main:app --reload

# Or use hot reload with port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📝 Environment Variables Explained

```bash
# Required
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

# Optional (with defaults)
API_V1_PREFIX=/api
PROJECT_NAME=Swag Commerce API
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your_key_here
SECRET_KEY=your-secret-key
```

---

## 🔐 Security Notes

1. **Never commit `.env`** to git (it's in .gitignore)
2. Use strong passwords for production databases
3. Rotate `SECRET_KEY` regularly
4. Use environment variables in production (not .env file)
5. Enable SSL for production database connections:
   ```bash
   DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db?ssl=require
   ```

---

## 🎉 You're Ready!

Once you complete these steps, your backend will have:
- ✅ Production-ready PostgreSQL database
- ✅ Async FastAPI with clean architecture
- ✅ 6 products with tiered pricing
- ✅ 5 coupons (including test cases)
- ✅ Full business logic (validation, transactions)

**Next:** Start the frontend and test the full integration!

```powershell
# In a new terminal
cd c:\Users\ADITI\port
npm run dev
```

Visit http://localhost:3000 and enjoy your fully functional e-commerce platform! 🛍️
