# FINBUD Production Deployment Guide

## 1. Architecture Stack
- **Frontend:** Next.js 16.4.6 (Vercel / Node.js 20+)
- **Backend:** FastAPI (Render / Railway / AWS ECS / Ubuntu VPS)
- **Database:** Supabase PostgreSQL with Row-Level Security
- **Authentication:** Supabase Auth (JWT Bearer)

---

## 2. Environment Variables

### Frontend (`frontend/.env.local` / Vercel Environment)
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend (`backend/.env` / Host Environment)
```env
PROJECT_NAME="FINBUD Financial Intelligence"
API_V1_STR="/api/v1"
ENVIRONMENT="production"
PORT=8000
HOST="0.0.0.0"

CORS_ORIGINS=["https://app.yourdomain.com", "http://localhost:3000"]

# Supabase Credentials
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-kept-secret>
SUPABASE_JWT_SECRET=<your-supabase-jwt-secret>

# Google Gemini API Key for RAG Pipeline
GEMINI_API_KEY=<your-gemini-api-key>

MARKET_CACHE_TTL_SECONDS=900
```

---

## 3. Database Initialization
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy and paste the complete schema from [`docs/supabase_schema.sql`](file:///c:/Users/hamen/Desktop/FINBUD/docs/supabase_schema.sql).
3. Execute the script to create tables, indexes, triggers, and Row-Level Security policies.

---

## 4. Running the Platform Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # (or source venv/bin/activate on Linux/macOS)
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --port 3000
```
Visit `http://localhost:3000` in your browser.
