# 🛍️ Swag Commerce - E-Commerce Platform

A modern fullstack e-commerce platform with AI-powered analytics, tiered pricing, and real-time cart management.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### Customer Features
- 🛒 **Smart Shopping Cart** - Real-time price calculations with tier-based pricing
- 💳 **Order Management** - Complete order history and tracking
- 🎟️ **Coupon System** - Support for percentage, fixed amount, and free product coupons
- 👤 **User Profiles** - Tier-based access (Tier 1, 2, 3) with different pricing levels
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Admin Features
- 📊 **Analytics Dashboard** - Revenue tracking, top products, and sales insights
- 🤖 **AI-Powered Chat** - Natural language queries for business intelligence using Google Gemini
- 📦 **Product Management** - Full CRUD operations for products
- 🎫 **Coupon Management** - Create and manage discount coupons
- 👥 **Order Management** - View and process customer orders

### Technical Features
- 🔐 **JWT Authentication** - Secure user authentication with role-based access
- 💾 **PostgreSQL Database** - Production-ready database with asyncpg
- ⚡ **Async/Await** - High-performance async operations throughout
- 🔄 **Real-time Updates** - Cart and authentication state synchronization
- 📝 **Automatic API Docs** - Interactive Swagger documentation
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3
- **UI Components**: Lucide React Icons
- **Charts**: Recharts
- **AI**: Google Generative AI SDK

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **ORM**: SQLAlchemy with asyncpg
- **Database**: PostgreSQL
- **Authentication**: JWT (python-jose, bcrypt)
- **Validation**: Pydantic v2
- **AI**: Google Gemini API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)

### API Keys
- **Google Gemini API Key** (for AI features) - [Get Key](https://ai.google.dev/)

---

## 🚀 Quick Start

### Automated Setup (Windows)

Run these commands in PowerShell to set up everything automatically:

```powershell
# 1. Clone the repository (if not already cloned)
git clone <your-repo-url>
cd port

# 2. Install frontend dependencies
npm install

# 3. Setup backend and database
cd backend
.\setup.ps1

# 4. Create .env files (see configuration below)

# 5. Start the backend server (in backend directory)
.\venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --reload

# 6. Start the frontend (in new terminal, from root directory)
npm run dev
```

**🎉 Your application is now running!**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

## 📦 Detailed Setup

### Step 1: Database Setup

#### Install PostgreSQL

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. During installation:
   - Set a password for the `postgres` user (remember this!)
   - Use default port `5432`
   - Install pgAdmin (recommended for database management)

**Verify Installation:**
```powershell
psql --version
```

#### Create Database

**Option A - Using pgAdmin (GUI):**
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click on "Databases" → Create → Database
4. Name: `swagcommerce`
5. Click "Save"

**Option B - Using Command Line:**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE swagcommerce;

# Exit
\q
```

### Step 2: Backend Setup

#### Navigate to Backend Directory
```powershell
cd backend
```

#### Create Python Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Verify activation (you should see (venv) in your prompt)
```

#### Install Python Dependencies
```powershell
pip install --upgrade pip
pip install fastapi uvicorn sqlalchemy asyncpg psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart pydantic pydantic-settings python-dotenv google-generativeai
```

#### Create Backend .env File

Create a file named `.env` in the `backend` directory:

```powershell
# Create .env file
New-Item -Path ".env" -ItemType File -Force
```

Add the following content to `backend/.env`:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/swagcommerce

# API Configuration
API_V1_PREFIX=/api
PROJECT_NAME=Swag Commerce API

# CORS Settings (allow frontend to connect)
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret Key (change this in production!)
SECRET_KEY=your-secret-key-change-in-production-use-random-string
```

**Important**: Replace the following:
- `YOUR_PASSWORD` with your PostgreSQL password
- `your_gemini_api_key_here` with your actual Google Gemini API key

#### Initialize Database Tables

Run the setup script to create all database tables and seed initial data:

```powershell
# Make sure you're in the backend directory with venv activated
python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"

# Seed the database with sample products and admin user
python -c "from app.seed import seed_database; import asyncio; asyncio.run(seed_database())"
```

Or use the automated setup script:
```powershell
.\setup.ps1
```

### Step 3: Frontend Setup

#### Navigate to Root Directory
```powershell
cd ..  # Go back to project root
```

#### Install Node Dependencies
```powershell
npm install
```

#### Create Frontend .env File

Create a file named `.env.local` in the root directory:

```powershell
# Create .env.local file
New-Item -Path ".env.local" -ItemType File -Force
```

Add the following content to `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Google Gemini API Key (same as backend)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important**: Replace `your_gemini_api_key_here` with your actual Google Gemini API key.

---

## 🎯 Running the Application

### Start Backend Server

```powershell
# Navigate to backend directory
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Start FastAPI server with auto-reload
uvicorn main:app --host 0.0.0.0 --reload
```

**Backend is now running at:**
- API: http://localhost:8000
- Interactive API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### Start Frontend Server

Open a **new terminal** and run:

```powershell
# Navigate to project root
cd C:\Users\ADITI\port

# Start Next.js development server
npm run dev
```

**Frontend is now running at:**
- Application: http://localhost:3000

### Default Login Credentials

After seeding the database, you can login with:

**Admin Account:**
- Email: `admin@swagcommerce.com`
- Password: `admin123`
- **To access the Admin Portal**: Login with these credentials and navigate to the admin dashboard to view analytics, manage products, and use the AI-powered chat assistant.

**Test Customer Accounts:**
Create new accounts via the signup page with different tiers (Tier 1, 2, or 3).

---

## 📁 Project Structure

```
port/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.py       # Authentication endpoints
│   │   │   ├── products.py   # Product CRUD
│   │   │   ├── cart.py       # Cart calculations
│   │   │   ├── orders.py     # Order management
│   │   │   ├── coupons.py    # Coupon management
│   │   │   ├── analytics.py  # Analytics data
│   │   │   ├── ai.py         # Customer AI chat
│   │   │   └── admin_ai.py   # Admin AI analytics
│   │   ├── schemas/           # Pydantic request/response models
│   │   ├── ai/               # AI integration (Gemini)
│   │   ├── auth.py           # JWT authentication logic
│   │   ├── config.py         # Configuration settings
│   │   ├── database.py       # Database connection
│   │   ├── main.py           # FastAPI app initialization
│   │   └── seed.py           # Database seeding script
│   ├── test/                  # Backend tests
│   ├── venv/                 # Python virtual environment
│   ├── main.py               # Application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── setup.ps1             # Automated setup script
│   └── .env                  # Backend environment variables
│
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── page.tsx          # Landing/home page
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── signin/           # Sign in page
│   │   ├── signup/           # Sign up page
│   │   ├── cart/             # Shopping cart page
│   │   ├── orders/           # Order history page
│   │   ├── profile/          # User profile page
│   │   ├── bill/             # Order receipt page
│   │   └── admin/
│   │       └── ai/           # Admin AI dashboard
│   ├── components/            # React components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── Marketplace.tsx   # Product marketplace
│   │   ├── ProductsGrid.tsx  # Product grid display
│   │   ├── AdminDashboard.tsx # Admin analytics
│   │   └── AdminAIChat.tsx   # AI chat interface
│   ├── lib/
│   │   └── api.ts            # API client functions
│   └── types/
│       └── index.ts          # TypeScript type definitions
│
├── .env.local                 # Frontend environment variables
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── next.config.js            # Next.js configuration
```

---

## 📚 API Documentation

Once the backend is running, visit:

**Swagger UI**: http://localhost:8000/docs

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

#### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

#### Cart & Orders
- `POST /api/cart/calculate` - Calculate cart total with coupons
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

#### Coupons
- `GET /api/coupons` - List all coupons
- `POST /api/coupons` - Create coupon (admin)
- `POST /api/coupons/validate` - Validate coupon code

#### Analytics
- `GET /api/analytics/dashboard` - Get analytics data (admin)

#### AI Chat
- `POST /api/ai/chat` - Customer AI assistant
- `POST /api/admin/ai/chat` - Admin AI analytics

---

## 🔧 Configuration

### Frontend Environment Variables

File: `.env.local`

```env
# Required: Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional: Google Gemini API key for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Backend Environment Variables

File: `backend/.env`

```env
# Database URL (PostgreSQL with asyncpg driver)
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/swagcommerce

# API Configuration
API_V1_PREFIX=/api
PROJECT_NAME=Swag Commerce API

# CORS Origins (comma-separated allowed origins)
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret Key (use a strong random string in production)
SECRET_KEY=your-secret-key-change-in-production
```

### Production Configuration

For production deployment:

1. **Use Strong Secrets**:
   - Generate a secure `SECRET_KEY`: `openssl rand -hex 32`
   - Never commit API keys to version control

2. **Update CORS Origins**:
   ```env
   CORS_ORIGINS=["https://yourdomain.com"]
   ```

3. **Use Production Database**:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@production-host:5432/dbname
   ```

4. **Update Frontend API URL**:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error

**Error**: `could not connect to server: Connection refused`

**Solutions**:
- Verify PostgreSQL is running: `Get-Service -Name postgresql*`
- Start PostgreSQL if stopped
- Check database credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

#### 2. Module Not Found Error (Python)

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solutions**:
- Ensure virtual environment is activated: `.\venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.10+)

#### 3. Port Already in Use

**Error**: `Address already in use`

**Solutions**:

For Backend (Port 8000):
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

For Frontend (Port 3000):
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

#### 4. CORS Error in Browser

**Error**: `Access to fetch blocked by CORS policy`

**Solutions**:
- Verify `CORS_ORIGINS` in `backend/.env` includes `http://localhost:3000`
- Restart backend server after changing `.env` file
- Check browser console for actual error message

#### 5. API Connection Error

**Error**: `Failed to fetch` or `Network request failed`

**Solutions**:
- Verify backend is running: `http://localhost:8000/docs`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure URL doesn't have trailing slash
- Check browser console for actual error

#### 6. Virtual Environment Not Found

**Error**: `venv\Scripts\activate : The term is not recognized`

**Solutions**:
```powershell
# Recreate virtual environment
cd backend
python -m venv venv

# Activate it
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 7. Database Tables Not Created

**Error**: `relation "products" does not exist`

**Solutions**:
```powershell
cd backend
.\venv\Scripts\activate

# Reinitialize database
python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"

# Seed data
python -c "from app.seed import seed_database; import asyncio; asyncio.run(seed_database())"
```

#### 8. Gemini API Error

**Error**: `API key not valid`

**Solutions**:
- Get a valid API key from [Google AI Studio](https://ai.google.dev/)
- Update both `.env` (backend) and `.env.local` (frontend)
- Restart both servers after updating

---

## 🧪 Testing

### Run Backend Tests

```powershell
cd backend
.\venv2\Scripts\activate
pytest test/
```

### Manual Testing Checklist

- [ ] User can register and login
- [ ] Products display correctly
- [ ] Add products to cart
- [ ] Apply coupon codes
- [ ] Complete checkout
- [ ] View order history
- [ ] Admin can access dashboard
- [ ] AI chat responds correctly

---

## 📝 Development Scripts

### Backend Scripts

```powershell
# Activate virtual environment
.\venv\Scripts\activate

# Run development server with auto-reload
uvicorn main:app --reload --host 0.0.0.0

# Run on different port
uvicorn main:app --reload --port 8001

# Create database tables
python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"

# Seed database with sample data
python -c "from app.seed import seed_database; import asyncio; asyncio.run(seed_database())"

# Run tests
pytest test/
```

### Frontend Scripts

```powershell
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Create a `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. Update `DATABASE_URL` to production PostgreSQL

3. Set environment variables on hosting platform

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Support

For issues and questions:
- Check the [Troubleshooting](#-troubleshooting) section
- Review API documentation at http://localhost:8000/docs
- Check browser console for frontend errors
- Check terminal output for backend errors

---

## 🎉 Quick Command Reference

### First Time Setup
```powershell
# 1. Install dependencies
npm install

# 2. Setup backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy asyncpg psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart pydantic pydantic-settings python-dotenv google-generativeai

# 3. Create .env files (see configuration section)

# 4. Initialize database
python -c "from app.database import init_db; import asyncio; asyncio.run(init_db())"
python -c "from app.seed import seed_database; import asyncio; asyncio.run(seed_database())"
```

### Daily Development
```powershell
# Terminal 1 - Backend
cd backend
.\venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --reload

# Terminal 2 - Frontend
npm run dev
```

---

**Built with ❤️ using Next.js, FastAPI, and PostgreSQL**
