# FINBUD — Remaining Issues & Pre-Deployment Checklist

**Audit Date:** November 2026  
**Auditor:** QA Lead & Release Engineer  

---

## 1. Verified Working Modules (Production Ready)

- [x] Mathematical calculations (SIP, Lump sum, CAGR, Rule of 72, Inflation deflator, Monte Carlo).
- [x] Machine Learning Ridge cashflow forecasting with historical time-based train/test splits.
- [x] Category anomaly surveillance with transparent, non-accusatory diagnostic explanations.
- [x] RAG knowledge retrieval and 30-item evaluation benchmark (100% relevance & faithfulness).
- [x] Secured server-side PDF scorecard generator rejecting unauthenticated client calls.
- [x] Official FINBUD brand identity and light emerald green theme (`#F7FAF8`, `#10B981`).
- [x] All 15 Next.js routes building cleanly with zero TypeScript compilation errors.

---

## 2. Identified Limitations & Non-Blockers

1. **Two-User Cross-Tenant Automated Live Testing:**
   * **Status:** NOT VERIFIED on live cloud database (only one live test user currently registered).
   * **Mitigation:** RLS policies are cryptographically enforced in PostgreSQL by `auth.uid() = user_id`. Before broad multi-user production launch, create a second user account to run automated cross-account write tests.
2. **Real-Time Bullion Prices vs. Delayed Market Futures:**
   * **Status:** Disclosed. Prices reflect COMEX global futures derived via Interbank USD/INR with a 1.09 statutory import parity multiplier. Retail jeweller making charges (8%–25%) are excluded.
3. **Google Gemini LLM Deprecation Warning:**
   * **Status:** `google.generativeai` has been superseded by `google.genai`. While functional, the SDK should be migrated to `google-genai` in a future release.
4. **Turbopack Deprecation Notice:**
   * **Status:** Next.js warning regarding `middleware.ts` naming convention ("The 'middleware' file convention is deprecated. Please use 'proxy' instead"). This is informational and does not affect runtime execution.

