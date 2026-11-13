# FINBUD — Security & Two-User Isolation Test Results

**Date:** November 2026  
**Auditor:** Senior Security Engineer & System Architect  

---

## 1. Authentication Security Verification

### Test 1.1: Unauthenticated Endpoint Request
* **Target:** `POST /api/v1/reports/scorecard-pdf`
* **Command:**
  ```python
  import urllib.request
  url = 'http://127.0.0.1:8000/api/v1/reports/scorecard-pdf'
  req = urllib.request.Request(url, method='POST')
  # Sent with no Authorization header
  ```
* **Executed Result:**
  ```
  HTTP Error 401: Unauthorized
  Body: {"detail":"Authentication required. Missing or malformed Bearer token in Authorization header."}
  ```
* **Status:** **PASS**

### Test 1.2: Forged / Malformed JWT Bearer Token
* **Target:** `POST /api/v1/reports/scorecard-pdf`
* **Header:** `Authorization: Bearer forged.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature`
* **Executed Result:**
  ```
  HTTP Error 401: Unauthorized
  Body: {"detail":"Authentication token verification failed: ..."}
  ```
* **Status:** **PASS**

---

## 2. Row-Level Security (RLS) Policy Audit

Source inspected: `docs/supabase_schema.sql`

```sql
-- Enforce RLS on all sensitive user tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metal_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Transactions Policy
CREATE POLICY "Users can manage own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

-- Metal Holdings Policy
CREATE POLICY "Users can manage own metal holdings" ON public.metal_holdings
    FOR ALL USING (auth.uid() = user_id);

-- Insurance Policies Policy
CREATE POLICY "Users can manage own insurance policies" ON public.insurance_policies
    FOR ALL USING (auth.uid() = user_id);
```

### Two-User Isolation Status:
* **Code & Schema Inspection:** **PASS**. PostgreSQL RLS rules strictly filter every query by the verified JWT session user id (`auth.uid()`).
* **Live Automated Two-User Browser/REST Test:** **NOT VERIFIED**. The local test environment currently has only one registered test account (`hamestudy@gmail.com`). To prevent fabricating test logs, concurrent cross-tenant tampering remains designated as NOT VERIFIED until a second test account is registered on the live Supabase instance.
