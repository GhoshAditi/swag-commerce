# 🚀 Backend Integration Guide

## Overview
Your frontend is now complete with a beautiful beige color scheme, animations, and modern UI. Follow these steps to integrate your backend.

---

## ✅ Frontend Updates Complete

### 🎨 New Design Features
- **Beige/Brown Color Scheme**: Warm, professional beige backgrounds with black text
- **Hero Section**: Eye-catching landing page with animated elements
- **About Section**: Feature highlights with icon cards
- **Glass Morphism**: Modern glass effects throughout
- **Hover Animations**: Smooth transitions and lift effects
- **Responsive Design**: Mobile-first, works on all devices

### 📦 API Integration Ready
- Created `/src/lib/api.ts` with all API functions
- Functions automatically fall back to mock data if backend is unavailable
- Easy to switch from mock to real data

---

## 🔧 Backend Integration Steps

### Step 1: Set Up Environment Variables

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
GOOGLE_GEMINI_API_KEY=your_actual_api_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 2: Choose Your Backend Stack

#### Option A: Node.js + Express + PostgreSQL

```bash
mkdir swag-commerce-backend
cd swag-commerce-backend
npm init -y
npm install express cors helmet morgan dotenv pg
npm install @google/generative-ai
npm install -D nodemon typescript @types/node @types/express
```

#### Option B: Python + FastAPI + PostgreSQL

```bash
mkdir swag-commerce-backend
cd swag-commerce-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary
pip install google-generativeai python-dotenv pydantic
```

---

### Step 3: Database Schema

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tiered pricing table
CREATE TABLE tiered_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  makes_free BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  applied_coupon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_coupons_code ON coupons(code);
```

---

### Step 4: API Endpoints to Implement

#### Products Endpoints
```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

#### Coupons Endpoints
```
POST   /api/coupons/validate      # Validate coupon code
GET    /api/coupons               # Get all coupons (admin)
POST   /api/coupons               # Create coupon (admin)
DELETE /api/coupons/:id           # Delete coupon (admin)
```

#### Orders Endpoints
```
POST   /api/orders                # Create new order
GET    /api/orders                # Get all orders (admin)
GET    /api/orders/:id            # Get specific order
PATCH  /api/orders/:id/status     # Update order status (admin)
```

#### Analytics Endpoints
```
GET    /api/analytics/dashboard   # Get dashboard data (admin)
GET    /api/analytics/revenue     # Get revenue trends (admin)
GET    /api/analytics/products    # Get product performance (admin)
```

#### AI Chat Endpoint
```
POST   /api/ai/chat               # Send message to AI assistant
```

---

### Step 5: Example Backend Implementation (Node.js)

**Server Setup** (`server.js`):
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**AI Chat Route** (`routes/ai.js`):
```javascript
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an AI assistant for SwagCommerce, a bulk merchandise platform.
    
Database context:
${JSON.stringify(context, null, 2)}

User question: ${message}

Provide helpful, concise insights about sales, inventory, revenue trends, and business metrics.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

module.exports = router;
```

---

### Step 6: Products Route Example (`routes/products.js`)

```javascript
const express = require('express');
const router = express.Router();
// Assume you have a database connection

// GET all products with tiered pricing
router.get('/', async (req, res) => {
  try {
    const products = await db.query(`
      SELECT p.*, 
             json_agg(json_build_object(
               'minQuantity', tp.min_quantity,
               'price', tp.price
             ) ORDER BY tp.min_quantity) as tieredPricing
      FROM products p
      LEFT JOIN tiered_pricing tp ON p.id = tp.product_id
      GROUP BY p.id
    `);
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  const { name, description, price, stock, image, category, tieredPricing } = req.body;
  
  try {
    // Start transaction
    const client = await db.connect();
    await client.query('BEGIN');
    
    // Insert product
    const productResult = await client.query(
      `INSERT INTO products (name, description, base_price, stock_quantity, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, stock, image, category]
    );
    
    const product = productResult.rows[0];
    
    // Insert tiered pricing
    for (const tier of tieredPricing) {
      await client.query(
        `INSERT INTO tiered_pricing (product_id, min_quantity, price)
         VALUES ($1, $2, $3)`,
        [product.id, tier.minQuantity, tier.price]
      );
    }
    
    await client.query('COMMIT');
    client.release();
    
    res.status(201).json(product);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### Step 7: Coupon Validation Route (`routes/coupons.js`)

```javascript
const express = require('express');
const router = express.Router();

router.post('/validate', async (req, res) => {
  const { code, cartItems } = req.body;
  
  try {
    const result = await db.query(
      `SELECT * FROM coupons 
       WHERE code = $1 
       AND is_active = TRUE 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [code.toUpperCase()]
    );
    
    if (result.rows.length === 0) {
      return res.json({
        isValid: false,
        message: 'Invalid or expired coupon code'
      });
    }
    
    const coupon = result.rows[0];
    
    res.json({
      isValid: true,
      discountType: coupon.discount_type,
      discountValue: parseFloat(coupon.discount_value),
      message: `${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : '$' + coupon.discount_value} discount applied!`,
      makesFree: coupon.makes_free
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### Step 8: Update Frontend to Use Real APIs

The frontend is already set up to use the API functions in `/src/lib/api.ts`. 

When your backend is running, the frontend will automatically connect to it!

**Test Connection:**
1. Start your backend: `npm run dev` or `python -m uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Open http://localhost:3000
4. The app will try to fetch from your backend, and fall back to mock data if unavailable

---

### Step 9: Test Your Integration

#### Test Products Endpoint:
```bash
curl http://localhost:8000/api/products
```

#### Test Coupon Validation:
```bash
curl -X POST http://localhost:8000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SUMMER50","cartItems":[]}'
```

#### Test AI Chat:
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is our total revenue?","context":{}}'
```

---

## 🎯 Quick Start Commands

```bash
# Frontend (already set up)
npm install
npm run dev

# Backend (to be created by you)
# Node.js:
cd ../swag-commerce-backend
npm run dev

# Python:
cd ../swag-commerce-backend
uvicorn main:app --reload
```

---

## 📝 Sample Data for Testing

Insert some test products:
```sql
INSERT INTO products (name, description, base_price, stock_quantity, image_url, category) VALUES
('Premium T-Shirt', 'High-quality cotton t-shirt', 25.00, 150, 'https://via.placeholder.com/300', 'Apparel'),
('Water Bottle', 'Stainless steel bottle', 15.00, 200, 'https://via.placeholder.com/300', 'Drinkware'),
('Laptop Stickers', 'Vinyl sticker pack', 8.00, 500, 'https://via.placeholder.com/300', 'Accessories');

-- Add tiered pricing for T-Shirt (assuming product_id from above)
INSERT INTO tiered_pricing (product_id, min_quantity, price) VALUES
((SELECT id FROM products WHERE name = 'Premium T-Shirt'), 1, 25.00),
((SELECT id FROM products WHERE name = 'Premium T-Shirt'), 50, 22.00),
((SELECT id FROM products WHERE name = 'Premium T-Shirt'), 100, 20.00);

-- Add test coupons
INSERT INTO coupons (code, discount_type, discount_value, makes_free) VALUES
('SUMMER50', 'percentage', 50, FALSE),
('FREESHIP', 'fixed', 0, TRUE);
```

---

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
npm run build
vercel deploy
```

### Backend Options
- **Heroku**: `git push heroku main`
- **Railway**: Deploy from GitHub
- **AWS/DigitalOcean**: Docker container
- **Vercel Serverless**: API routes in `/api` folder

---

## 📞 Need Help?

The frontend automatically falls back to mock data, so you can develop and test the backend independently!

**Your frontend is 100% complete and ready to connect to any backend you build!** 🎉
