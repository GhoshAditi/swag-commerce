# Swag Commerce & Analytics System 🛍️

A modern fullstack e-commerce platform for bulk merchandise purchasing with **real database integration**, AI-powered analytics, and dynamic pricing.

> **✨ NEW: Complete Database Integration!** Backend now uses SQLAlchemy ORM with proper business logic, coupon validation, transactional orders, and real-time analytics.

## 🎨 Design Highlights

- **Elegant Beige/Brown Color Scheme**: Warm, professional aesthetic with high contrast
- **Animated Hero Section**: Eye-catching landing page with smooth animations
- **Glass Morphism Effects**: Modern, sophisticated UI elements
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Hover Animations**: Interactive elements with smooth transitions
- **Professional Typography**: Clean, readable fonts throughout

## 🚀 Features

### Frontend (✅ Complete & Production-Ready)
- **Landing Page**: Hero section, about section, feature highlights
- **Modern Marketplace**: Product catalog with tiered pricing and bulk discounts
- **Smart Shopping Cart**: Real-time price calculations and coupon system
- **Admin Dashboard**: Comprehensive analytics with AI-powered insights
- **AI Chat Assistant**: Natural language queries for business intelligence
- **Dynamic Coupons**: Support for percentage, fixed amount, and "make free" coupons
- **Backend Integration**: Full API connection with database

### Backend (✅ Complete & Production-Ready) **NEW!**
- **SQLAlchemy ORM**: Complete database models with relationships
- **Product Management**: CRUD operations with tiered pricing support
- **Order Processing**: Transactional order flow with stock validation
- **Coupon System**: Advanced validation (expiration, usage limits, edge cases)
- **Inventory Management**: Automatic stock updates after orders
- **Analytics Engine**: Real-time aggregation from database
- **AI Integration Ready**: Google Gemini SDK for intelligent insights

### Business Logic Implemented ✨
- ✅ Coupon validation with edge cases (expired, usage limit, inactive)
- ✅ Stock verification before order creation
- ✅ Atomic transactions (rollback if any step fails)
- ✅ Automatic stock decrement after successful orders
- ✅ Coupon usage tracking
- ✅ Real-time analytics (revenue, top products, low stock alerts)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS 3.3
- **Animations**: Custom CSS animations + Tailwind transitions
- **Backend**: FastAPI 0.109 (Python)
- **ORM**: SQLAlchemy 2.0
- **Database**: SQLite (dev), PostgreSQL-ready
- **Validation**: Pydantic 2.5
- **AI**: Google Gemini SDK (@google/generative-ai 0.3.2)

## 📦 Quick Start

### Option 1: Automated Setup (Recommended) ⚡

```powershell
# Backend setup (one command!)
cd c:\Users\ADITI\port\backend
.\setup.ps1

# Then start the backend
uvicorn main:app --reload

# In a new terminal, start frontend
cd c:\Users\ADITI\port
npm install
npm run dev
```

**That's it!** 🎉
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Frontend Setup
```bash
# Install dependencies
npm install
```

# Configure frontend environment
cp .env.example .env.local
# Edit .env.local: Set NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start frontend
npm run dev
```

#### Backend Setup
```powershell
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Initialize database
python database.py

# Start server
uvicorn main:app --reload
```

## 🗄️ Database Schema

The backend uses SQLAlchemy ORM with these models:

- **Product**: name, price, stock, category, tiered pricing
- **TieredPricing**: bulk discount rules (min quantity → price)
- **Coupon**: code, type, value, expiration, usage limits
- **Order**: customer info, totals, status, timestamps
- **OrderItem**: line items linking orders to products

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed schema and relationships.

## 🎨 Color Palette

- **Primary (Brown/Tan)**: `#8b6f47` - Main brand color
- **Accent (Orange)**: `#ff9640` - Call-to-action buttons
- **Beige Backgrounds**: `#fdfbf7` to `#f8f4ed` - Warm, inviting
- **Success Green**: `#22c55e` - Positive actions
- **Warning Orange**: `#f59e0b` - Alerts and notifications
- **Black Text**: `#000000` - High contrast, readable

## 🔧 Environment Variables

### Frontend (.env.local)
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Google Gemini API (for AI features)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend (.env)
```bash
# Database URL (default: SQLite)
DATABASE_URL=sqlite:///./swagcommerce.db

# For production, use PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/swagcommerce

# Google Gemini API (optional, for AI chat)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📋 Current Status

### ✅ Completed
- Frontend UI with beige design theme
- Landing page with hero and about sections
- Marketplace with shopping cart
- Admin dashboard with analytics
- **Backend API with database integration** ⭐ NEW
- **SQLAlchemy ORM models** ⭐ NEW
- **Coupon validation with edge cases** ⭐ NEW
- **Transactional order processing** ⭐ NEW
- **Real-time analytics from database** ⭐ NEW

### 🚀 Ready to Use
The system is **fully functional** and ready for:
- Product browsing with tiered pricing
- Shopping cart with coupon codes
- Order placement with stock validation
- Analytics dashboard with insights
- AI chat assistant (basic responses)

### 🔮 Future Enhancements (Optional)
- User authentication (JWT tokens)
- Payment gateway integration (Stripe/PayPal)
- Email notifications for orders
- Advanced AI with real Gemini API integration
- Admin panel for product/coupon management
- Production deployment (Vercel + Railway/Render)

## 🧪 Testing the System

### Test Coupons
- **SUMMER50**: 50% off (valid)
- **FREESHIP**: Makes order free (valid)
- **BULK10**: 10% off (valid)
- **EXPIRED2025**: Expired coupon (should fail)
- **LIMITED2**: Usage limit of 2 (fails after 2 uses)

### Test Products
Database is seeded with 6 products:
1. Premium Company T-Shirt ($25)
2. Branded Water Bottle ($15)
3. Custom Laptop Stickers ($8)
4. Executive Notebook ($35)
5. Wireless Mouse ($45)
6. Canvas Tote Bag ($12)

All products have tiered pricing for bulk orders!

## 🎯 Features in Detail

### Landing Page
- **Hero Section**: Large, attention-grabbing headline with CTA buttons
- **Feature Cards**: Animated grid showing platform benefits
- **Visual Stats**: Dynamic cards highlighting key metrics
- **About Section**: Detailed feature explanations
- **Call-to-Action**: Multiple conversion points

### Marketplace
- **Product Grid**: Responsive card layout with hover effects
- **Tiered Pricing**: Automatic bulk discounts displayed
- **Live Cart**: Slide-in cart panel with real-time totals
- **Coupon System**: Visual feedback for applied discounts
- **Price Comparison**: Original vs. discounted pricing
- **Stock Validation**: Cannot order more than available

### Admin Dashboard
- **Analytics Cards**: Revenue, orders, avg. order value, alerts
- **AI Chat**: Interactive assistant for data queries
- **Top Products**: Revenue and quantity sold (from real data)
- **Low Stock Alerts**: Inventory warnings (< 50 units)
- **Revenue Trends**: 7-day revenue visualization from database

### Backend API Endpoints
```
GET  /api/products          - List all products with tiered pricing
GET  /api/products/{id}     - Get single product details
POST /api/coupons/validate  - Validate coupon (edge cases handled)
POST /api/orders            - Create order (transactional)
GET  /api/orders            - List all orders
GET  /api/analytics/dashboard - Real-time analytics
POST /api/ai/chat           - AI assistant queries
```

Interactive docs: http://localhost:8000/docs (when backend is running)

## 🎭 Animations

- `fade-in`: Smooth element entrance
- `fade-in-up`: Elements slide up while fading in
- `slide-in-left/right`: Directional slide animations
- `hover-lift`: Cards lift on hover
- `scale-up`: Button press feedback
- `shimmer`: Loading state animation

## 📱 Mobile Responsiveness

- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Collapsible navigation
- Touch-friendly buttons (min 44x44px)
- Optimized images and loading states
- Smooth scroll behavior

## 🔮 AI Features

- **Natural Language Queries**: "What's our total revenue?"
- **Context-Aware Responses**: Uses real database stats
- **Thinking State**: Visual feedback during processing
- **Business Intelligence**: Revenue, inventory, product insights
- **Rule-Based Responses**: Ready for Gemini API integration

## 📚 Documentation Files

- **[QUICKSTART.md](QUICKSTART.md)** - Fast setup guide with all commands
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and flow diagrams
- **[BACKEND_DATABASE_INTEGRATION.md](BACKEND_DATABASE_INTEGRATION.md)** - Detailed database docs
- **README.md** - This file (project overview)

## 📊 Example Database Queries

After running the backend, you can test these:

```bash
# Get all products
curl http://localhost:8000/api/products

# Validate coupon
curl -X POST http://localhost:8000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "SUMMER50"}'

# Get analytics
curl http://localhost:8000/api/analytics/dashboard
```

Or use the interactive docs: http://localhost:8000/docs

## 📦 Project Structure

```
port/
├── src/                          # Frontend (Next.js)
│   ├── app/
│   │   ├── globals.css          # Beige theme + animations
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page + routing
│   ├── components/
│   │   ├── Marketplace.tsx      # Products + cart
│   │   └── AdminDashboard.tsx   # Analytics + AI
│   ├── lib/
│   │   └── api.ts               # API integration
│   └── types/
│       └── index.ts             # TypeScript types
├── backend/                      # Backend (FastAPI)
│   ├── main.py                  # API routes ⭐
│   ├── database.py              # SQLAlchemy models ⭐
│   ├── schemas.py               # Pydantic validation ⭐
│   ├── requirements.txt         # Python deps
│   ├── setup.ps1                # Automated setup ⭐
│   └── swagcommerce.db          # SQLite database (created)
├── QUICKSTART.md                # Setup guide ⭐
├── ARCHITECTURE.md              # System design ⭐
├── BACKEND_DATABASE_INTEGRATION.md  # Database docs ⭐
├── README.md                    # This file
├── package.json                 # Node deps
└── tailwind.config.js           # Tailwind + colors
│   │   └── api.ts             # API functions (ready!)
│   └── types/
│       └── index.ts           # TypeScript types
├── public/                    # Static assets
├── .env.example               # Environment template
├── tailwind.config.js         # Beige color system
├── tsconfig.json              # TypeScript config
├── BACKEND_INTEGRATION_GUIDE.md  # Complete backend guide
└── README.md                  # This file
```

---

## 🎉 Ready to Go!

Your frontend is **100% complete** with:
- ✅ Modern beige/brown design
- ✅ Smooth animations
- ✅ Hero & about sections
- ✅ Backend integration ready
- ✅ Mobile responsive
- ✅ Production-ready code

**Next step**: Follow `BACKEND_INTEGRATION_GUIDE.md` to build your backend!