# FINBUD — Production API Connectivity & Final Release Gate Audit

**Project**: FINBUD (AI-Driven Personal Wealth & Multi-Asset Financial Intelligence Platform)  
**Author / Lead Architect**: Diwakar K  
**Evaluation Standard**: Production Connectivity, Dynamic Environment Injection & Release Gate Verification  
**Date**: November 13, 2026  
**Status**: **DEPLOYMENT READY — PENDING CLOUD URL INJECTION (PASS)**

---

## 1. Old vs. New API Configuration

### The Issue Addressed
Previously, components hardcoded `http://127.0.0.1:8000/api/v1/...` in client-side fetch calls. When deployed to Vercel, requests from external devices would attempt to reach `127.0.0.1` on the visitor's local machine, causing instant network failures.

### The Centralized Architecture Solution
All frontend API endpoints have been extracted to a centralized configuration module:  
[frontend/src/config/api.ts](file:///C:/Users/hamen/Desktop/FINBUD/frontend/src/config/api.ts)

```typescript
export const API_BASE_URL = getApiBaseUrl(); // Reads NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL
```

- **Local Development**: When `NEXT_PUBLIC_API_BASE_URL` is omitted, defaults cleanly to `http://127.0.0.1:8000/api/v1`.
- **Production Deployment**: Dynamically reads `NEXT_PUBLIC_API_BASE_URL` provided in Vercel project environment variables (e.g. `https://api.finbud.yourdomain.com/api/v1`).
- **Safety Warning**: Logs an explicit warning if running under `NODE_ENV === 'production'` without `NEXT_PUBLIC_API_BASE_URL` configured.

---

## 2. Comprehensive Files & Endpoints Refactored

Every single hardcoded endpoint across the entire frontend application has been refactored to use `API_ENDPOINTS`:

| Frontend File | Endpoint Function | Refactored Centralized Call |
|---|---|---|
| `src/components/ai/FinbudAiFloatingWidget.tsx` | AI Chat Assistant | `API_ENDPOINTS.ragAsk` |
| `src/app/finbud-ai/page.tsx` | Standalone AI Page | `API_ENDPOINTS.ragAsk` |
| `src/app/finbud-ai/page.tsx` | AI Audit Modal | `API_ENDPOINTS.ragEvaluate` |
| `src/app/analytics/page.tsx` | Academic Holdout Validation | `API_ENDPOINTS.evaluateModel(6)` |
| `src/app/analytics/page.tsx` | User Cashflow Forecast | `API_ENDPOINTS.predictCashflow` |
| `src/app/analytics/page.tsx` | Category Anomaly Detection | `API_ENDPOINTS.categoryAnomalies` |
| `src/app/gold-silver/page.tsx` | Bullion Live Spot Rates | `API_ENDPOINTS.marketSpot` |
| `src/app/gold-silver/page.tsx` | Bullion Historical Chart | `API_ENDPOINTS.marketHistory(metal, period)` |
| `src/app/reports/page.tsx` | PDF Health Scorecard | `API_ENDPOINTS.scorecardPdf(reportingPeriod)` |
| `src/app/wealth-lab/page.tsx` | Wealth Compound Engine | `API_ENDPOINTS.wealthCompound` |
| `src/app/wealth-lab/page.tsx` | Monte Carlo Simulation | `API_ENDPOINTS.wealthMonteCarlo` |

---

## 3. Production Environment Variables Checklist

### Frontend (To configure in Vercel Dashboard -> Settings -> Environment Variables)
| Variable | Value for Production | Classification |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | `FINBUD` | Public |
| `NEXT_PUBLIC_API_BASE_URL` | `https://<YOUR-BACKEND-DOMAIN>/api/v1` | Public (Client Bundle) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<YOUR-PROJECT-ID>.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | Public (Protected by RLS) |

### Backend (To configure in Render / Railway / AWS Container Settings)
| Variable | Value for Production | Classification |
|---|---|---|
| `PROJECT_NAME` | `FINBUD Financial Intelligence` | Config |
| `ENVIRONMENT` | `production` | Runtime mode |
| `CORS_ORIGINS` | `https://<YOUR-VERCEL-DOMAIN>.vercel.app,http://localhost:3000` | Security |
| `SUPABASE_URL` | `https://<YOUR-PROJECT-ID>.supabase.co` | Supabase endpoint |
| `SUPABASE_KEY` | `your-anon-key` | Client verification |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | **Critical Backend Secret** |
| `SUPABASE_JWT_SECRET` | `your-jwt-secret-min-32-chars` | **Critical Backend Secret** |
| `GEMINI_API_KEY` | `your-actual-gemini-key` | **Critical Backend Secret** |
| `MARKET_CACHE_TTL_SECONDS` | `3600` | Rate limiting |

---

## 4. Market Data & AI Engine Disclosures (Transparency Audit)

### 1. Market Data Instruments (GC=F and SI=F)
- `backend/app/services/market.py` specifically uses COMEX Gold Futures (`GC=F`) and Silver Futures (`SI=F`) from Yahoo Finance.
- **Accurate Disclosure**: The system clearly discloses that these are **international futures reference contracts**, converted via USD/INR interbank exchange rates with the statutory Indian 15% customs duty and 3% IGST import-parity calculation applied.
- They are **not** live retail spot quotes from Indian physical jewellers, and explicitly exclude making charges, purity variances, and local regional dealer premiums.

### 2. Gemini vs. Grounded Fallback Disclosures
- When `GEMINI_API_KEY` is not provided (or set to demo mode), the assistant transparently reports model as:  
  `FINBUD Curated Vector RAG Engine (Deterministic Grounding)`
- When a valid key is active, it reports:  
  `gemini-1.5-flash (Grounded RAG)`
- We explicitly do not claim zero hallucinations for generative models, nor do we falsely claim Gemini is active when executing the deterministic fallback synthesizer.

---

## 5. Security & Two-User Isolation Verification

- **Token Validation**: Expired, missing, or forged JWT tokens are verified to receive `HTTP 401 Unauthorized` on protected routes.
- **Single-Tenant Guard**: User without session cannot access financial ledger metrics via AI assistant (`auth-prompt-guardrail`).
- **Two-User Multi-Tenant Isolation Status**: Because live secondary credentials are not provisioned in this local environment, cross-account multi-tenant isolation on a live database is marked **NOT VERIFIED (Requires live staging dual credentials)**.

---

## 6. Production Build & Regression Test Evidence

### Frontend Build
```bash
$ npm run build
▲ Next.js 16.4.6 (Turbopack)
✓ Compiled successfully in 1.75s
✓ Finished TypeScript in 4.7s
✓ Generating static pages using 15 workers (15/15) in 1.2s
Routes prerendered: 15/15 (All passed cleanly)
```

### Backend Automated Test Suite
```bash
$ pytest backend/tests -v
backend/tests/test_end_to_end.py::test_wealth_compound_calculation PASSED
backend/tests/test_end_to_end.py::test_wealth_zero_percent_return_and_inflation PASSED
backend/tests/test_end_to_end.py::test_wealth_cagr_calculation PASSED
backend/tests/test_end_to_end.py::test_monte_carlo_distribution PASSED
backend/tests/test_end_to_end.py::test_predictive_engine_empty_dataset PASSED
backend/tests/test_end_to_end.py::test_predictive_engine_normal_spending PASSED
backend/tests/test_end_to_end.py::test_category_anomaly_detection PASSED
backend/tests/test_end_to_end.py::test_metal_spot_rates PASSED
backend/tests/test_end_to_end.py::test_metal_historical_chart PASSED
backend/tests/test_end_to_end.py::test_rag_answering_tax_question PASSED
backend/tests/test_end_to_end.py::test_rag_out_of_scope_query PASSED
backend/tests/test_end_to_end.py::test_rag_evaluation_benchmark PASSED
======================= 12 passed, 3 warnings in 11.08s =======================
```

---

## 7. Remaining Manual Deployment Steps

1. **Deploy Backend**:
   - Push repository to your backend host (e.g., Render, Railway, AWS ECS).
   - Use provided [backend/Dockerfile](file:///C:/Users/hamen/Desktop/FINBUD/backend/Dockerfile).
   - Configure backend environment variables listed in Section 3.
   - Note the resulting public URL (e.g. `https://api.finbud.yourdomain.com`).
2. **Deploy Frontend**:
   - Link repository to Vercel.
   - Add `NEXT_PUBLIC_API_BASE_URL` set to `https://api.finbud.yourdomain.com/api/v1`.
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Deploy.
3. **Update Backend CORS**:
   - Add your newly assigned Vercel domain to `CORS_ORIGINS` in your backend environment settings.
