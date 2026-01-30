#  Swag Commerce Backend

**Clean async FastAPI with PostgreSQL - Production Ready**

##  Structure

```
app/
 main.py          # FastAPI entry point
 config.py        # Environment settings
 database.py      # Async DB connection
 seed.py          # Database seeding
 models/          # SQLAlchemy models
 routes/          # API endpoints
 schemas/         # Pydantic schemas
```

##  Quick Start

1. **Setup PostgreSQL** (see DATABASE_SETUP.md)
2. **Create .env** from .env.example
3. **Install:** `pip install -r requirements.txt`
4. **Seed:** `python -m app.seed`
5. **Run:** `uvicorn app.main:app --reload`
6. **Visit:** http://localhost:8000/docs

##  API Endpoints

- GET `/api/products` - List products
- POST `/api/coupons/validate` - Validate coupon
- POST `/api/orders` - Create order
- GET `/api/analytics/dashboard` - Analytics
- POST `/api/ai/chat` - AI assistant

##  Environment

```bash
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
```

See .env.example for all options.

##  Documentation

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - PostgreSQL setup guide
- http://localhost:8000/docs - Interactive API docs

Built with FastAPI + PostgreSQL + SQLAlchemy Async
