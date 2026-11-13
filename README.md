# FINBUD
**AI-Driven Personal Wealth Management, Predictive Market Analytics & Multi-Asset Advisory Platform**

*Final-Year Academic Project • Computer Science & Design (CSD) & Machine Learning Domain*  
*Team Alpha Beta Gamma*

---

## 🌟 Overview
FINBUD is an educational financial intelligence and decision-support platform designed for Indian personal finance scenarios. It integrates cash-flow tracking, predictive expense and burn-rate modeling, precious metal asset valuation (Gold & Silver / SGBs), insurance adequacy heuristics, and a grounded Retrieval-Augmented Generation (RAG) assistant.

## 🛠️ Architecture & Tech Stack
- **Frontend:** Next.js 16+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python 3.11, FastAPI, Pydantic v2, Uvicorn
- **Machine Learning & Analytics:** Pandas, NumPy, Scikit-learn (Linear Regression, Isolation Forest Anomaly Detection)
- **Database & Auth:** Supabase PostgreSQL with strict Row Level Security (RLS) policies
- **AI & RAG:** Grounded vector search over curated Indian financial and tax knowledge base (Gemini API)
- **Market Data:** Reference feeds with 15-minute delay disclosures

## 🚀 Running Locally

### Backend Setup
```bash
# 1. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Start FastAPI server
cd backend
uvicorn main:app --reload --port 8000
```
Interactive API docs will be live at `http://127.0.0.1:8000/docs`.

### Frontend Setup
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start Next.js dev server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## ⚖️ Disclaimer
*Educational Decision-Support Prototype Only. Not a SEBI-registered investment adviser. Forecasts are statistical estimates.*
