# FINBUD System Architecture

## 1. System Overview

FINBUD is a full-stack, AI-augmented personal wealth management platform designed for the Indian economic and regulatory landscape.

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 16 + React 19)"]
        UI["Playful Neo-Brutalist UI"]
        Scroll["GSAP + Lenis Smooth Scroll"]
        FloatingAI["FINBUD AI Floating Copilot"]
        State["Supabase Client & Auth State"]
    end

    subgraph Backend ["Application Backend (FastAPI Microservices)"]
        Auth["JWT Token Authenticator"]
        ML["Predictive Expense Engine (Ridge)"]
        Anomaly["Isolation Forest Surveillance"]
        Wealth["Wealth Multiplier & Monte Carlo"]
        RAG["Curated Knowledge Base Vector Pipeline"]
        Market["Market Spot & Historical Data Cache"]
        Report["Scorecard PDF Generator"]
    end

    subgraph Storage ["Cloud Infrastructure & Persistence"]
        DB[("Supabase PostgreSQL")]
        RLS["Row-Level Security Policies"]
        AuthService["Supabase Auth Engine"]
        GeminiAPI["Google Gemini LLM API"]
    end

    UI --> Auth
    FloatingAI --> RAG
    UI --> State
    State --> AuthService
    Auth --> DB
    RLS -. Protects .-> DB
    RAG --> GeminiAPI
    Report --> DB
    Market --> Backend
```

## 2. Component Architecture

### Frontend (Next.js Turbopack)
- **Framework:** Next.js 16.4.6 with React 19.
- **Styling:** Neo-Brutalism using Tailwind CSS v4, custom utility classes (`.neo-card`, `.neo-btn-primary`, `.neo-btn-yellow`), and Google `Plus Jakarta Sans`.
- **Smooth Animation:** Lenis momentum scrolling synchronized with GSAP tickers.
- **Charts:** Recharts with custom SVG gradients and neo-brutalist tooltip cards.

### Backend (FastAPI)
- **Framework:** FastAPI with Python 3.11.
- **Authentication:** `get_current_user` extracts and cryptographically validates Supabase Bearer tokens.
- **ML Services:** Scikit-learn Ridge regression and Isolation Forest.
- **Reporting:** ReportLab PDF generator rendering audit scorecards with INR currency formatting.

### Security
- **Row-Level Security (RLS):** Every user can only access rows where `user_id == auth.uid()`.
- **Server-Side Aggregation:** PDF endpoint computes all financial totals on the server from Supabase records.

