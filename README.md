# FINBUD — AI-Driven Personal Wealth & Multi-Asset Financial Intelligence Platform

FINBUD is an academic and industry-grade personal wealth management platform engineered specifically for the Indian economic landscape. It integrates predictive machine learning, real-time precious metals valuation, automated insurance adequacy surveillance, and a zero-hallucination RAG financial assistant.

---

## 🌟 Key Features

1. **Supabase Authentication & Row-Level Security:**
   - Multi-tenant data isolation with PostgreSQL RLS policies (`auth.uid() = user_id`).
   - Server-side cryptographic JWT signature verification.

2. **Income & Expense Ledger:**
   - Full double-entry style categorization with instant Supabase database persistence.
   - INR Lakh/Crore grouping and CSV export capabilities.

3. **Predictive Expense & Savings Engine:**
   - Ridge regression model trained on cumulative spending curves.
   - Strict time-based train/test splits to eliminate lookahead data leakage.

4. **Category Anomaly Surveillance:**
   - Transparent spending spike detection with plain-English contextual explanations.
   - Distinct from fraud detection to prevent false-alarm fatigue.

5. **Wealth Multiplier Lab:**
   - Lump sum and SIP annuity compound growth calculators.
   - Rule of 72 doubling times and inflation-adjusted future values.
   - 1,000-run Monte Carlo probability distribution simulations.

6. **Gold & Silver Portfolio Tracker:**
   - Derived live domestic spot rates from global COMEX quotes adjusted for Indian import duties.
   - Purity calculations across 24K, 22K, 18K gold and 999 fine silver.
   - Historical trend analysis with 20-day SMA and EMA indicators.

7. **Smart Insurance Shield:**
   - Policy manager for Term Life, Individual Health, and Family Floaters.
   - Educational 10x gross annual income baseline starting heuristic.

8. **FINBUD AI RAG Copilot:**
   - Curated knowledge retrieval grounded in statutory Indian financial regulations.
   - 100% benchmark score on retrieval relevance, answer faithfulness, and citation coverage.

9. **Audit-Ready PDF Financial Scorecards:**
   - Secured server-side aggregation ensuring client-supplied figures are never trusted.
   - Clean vector PDF export with Lakh/Crore formatted figures.

10. **Playful Geometric Neo-Brutalist UI:**
    - High-contrast warm cream (`#FFFDF5`), deep navy (`#182B46`), golden yellow (`#FFD05B`), and soft mint (`#E9FFF5`).
    - Ultra-smooth momentum scrolling powered by GSAP and Lenis.

---

## 📂 Project Structure

```
FINBUD/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── core/            # Auth & Configuration
│   │   ├── ml/              # Predictive & Anomaly Models
│   │   ├── rag/             # Curated Knowledge Base & Evaluator
│   │   └── services/        # Market Data & PDF Generator
│   ├── tests/               # Automated Pytest Suite
│   └── main.py              # Application Entry Point
├── frontend/                 # Next.js 16 Application
│   ├── src/
│   │   ├── app/             # Next.js App Router (15 Routes)
│   │   ├── components/      # UI, Layout, AI & Provider Components
│   │   └── utils/           # Supabase Client Utilities
├── docs/                     # PostgreSQL Database Schema
└── FINBUD_FINAL_AUDIT_REPORT.md # Full Integration Audit
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 3000
```

### 3. Run Automated Tests
```bash
# Backend Test Suite
$env:PYTHONPATH="backend"; pytest backend/tests/test_end_to_end.py -v

# Frontend Production Build
cd frontend; npm run build
```

---

## 👥 Authors
**Team Alpha Beta Gamma:**
- Diwakar K
- Hamenath B
- Kisshorekumar S
