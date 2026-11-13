# FINBUD FULL-STACK VERCEL DEPLOYMENT FEASIBILITY & PREPARATION GUIDE
**Document Reference:** `FINBUD_VERCEL_FULL_STACK_DEPLOYMENT_GUIDE.md`  
**System Version:** Production 1.0.0  
**Audit Standard:** Senior DevOps Engineer & Full-Stack Cloud Architect  
**Audit Date:** November 14, 2026 (00:30 IST)  
**Overall Feasibility Assessment:** `CONDITIONAL FEASIBILITY — REQUIRES SPECIFIC ARCHITECTURAL ADAPTATION`

---

## Executive Summary & Architectural Reality Check

Deploying the complete FINBUD application across two separate Vercel projects (Frontend and FastAPI Backend) is technically feasible for standard HTTP REST routes, but requires fundamental adaptations for real-time WebSocket streaming.

Vercel is primarily a **Serverless Function & Edge Compute** platform. While Vercel announced **Fluid Compute** with enhanced concurrent request handling and WebSocket pass-through support on Edge/Node runtimes, serverless execution imposes strict boundaries:
1. **Stateless Ephemerality:** Serverless function instances spin down to zero when idle and cannot maintain a permanent background loop (`broadcast_loop`) in memory.
2. **In-Memory State Disconnection:** Memory is not shared across function instances. A WebSocket client connected to Serverless Instance A will not receive ticks broadcast by Serverless Instance B.
3. **Python Runtime Lifecycle:** The official `@vercel/python` builder wraps FastAPI via an ASGI handler. In an on-demand serverless model, lifespan background tasks (`asyncio.create_task`) terminate whenever the invocation completes.

### Feature Compatibility Classification Matrix

| Subsystem / Feature | Current Implementation | Vercel Compatibility | Required Adaptation |
| :--- | :--- | :---: | :--- |
| **Next.js 16 Frontend** | Turbopack SSR, GSAP, Tailwind v4 | `VERCEL_COMPATIBLE` | None. Native first-class Vercel support. Root: `frontend`. |
| **FastAPI REST Endpoints** | `/health`, `/ml/*`, `/wealth/*`, `/metals/*` | `VERCEL_COMPATIBLE` | Add `backend/vercel.json` routing all requests to `main.py`. |
| **Supabase PostgreSQL & Auth** | External cloud service with RLS | `VERCEL_COMPATIBLE` | Direct HTTPS communication. Zero changes needed. |
| **Google Gemini 3.1 RAG Assistant** | REST POST to `/api/v1/rag/ask` | `VERCEL_COMPATIBLE` | Ensure Vercel Function max duration is set to 30s–60s. |
| **PDF Scorecard Report Generation** | ReportLab binary streaming via REST | `VERCEL_COMPATIBLE` | Include `reportlab` in requirements; max duration 30s. |
| **Predictive ML & Monte Carlo** | Scikit-learn & NumPy vectorized math | `VERCEL_COMPATIBLE` | Memory limit configured to 1024MB on Vercel Function. |
| **WebSocket Stream (`/ws/market-ticks`)** | In-memory `active_connections` registry | `NOT_SUPPORTED` (in serverless) | **Requires Adaptation:** Replace in-memory socket loop with HTTP polling or external WebSocket broker. |
| **1-Second Broadcast Background Task** | `asyncio.create_task(broadcast_loop)` | `NOT_SUPPORTED` (in serverless) | **Requires Adaptation:** Convert to on-demand quote generation or scheduled Cron. |

---

## Section 1: Two-Project Architecture on Vercel

Rather than a fragile monorepo deployment, the optimal Vercel deployment model separates the repository into two linked Vercel projects:

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    GITHUB REPOSITORY                   │
                               │                https://github.com/Hamenath/Finbud      │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
                                ┌──────────────────────────┴──────────────────────────┐
                                │                                                     │
                                ▼                                                     ▼
                 ┌─────────────────────────────┐                       ┌─────────────────────────────┐
                 │       PROJECT 1 (UI)        │                       │       PROJECT 2 (API)       │
                 │   Next.js 16 Web Client     │                       │    FastAPI Python Service   │
                 │   Root Directory: frontend  │                       │   Root Directory: backend   │
                 │   Domain: finbud.vercel.app │                       │   Domain: api-finbud...app  │
                 └──────────────┬──────────────┘                       └──────────────┬──────────────┘
                                │                                                     │
                                └────────────────────── HTTPS REST ───────────────────┘
```

---

## Section 2: Backend Vercel Configuration (`backend/vercel.json`)

To enable Vercel to route incoming HTTP traffic directly to FastAPI using the official `@vercel/python` builder, create `backend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

### Python Dependency Constraints on Vercel Serverless
- Vercel functions have an unzipped package size limit of 250MB.
- `requirements.txt` includes `scikit-learn`, `numpy`, `pandas`, `yfinance`, and `reportlab`.
- These packages compile successfully on Vercel's Amazon Linux 2023 environment, provided binary wheels (`manylinux`) are downloaded.
- **Function Timeout:** Set `maxDuration: 30` in `vercel.json` to avoid 504 gateway timeouts during heavy Monte Carlo simulations or ReportLab PDF rendering.

---

## Section 3: The WebSocket & Background Task Problem Explained

### 3.1 Why the Current WebSocket Engine Cannot Run on Vercel Serverless
The existing implementation in `backend/app/services/market_stream.py` relies on three architectural assumptions:
1. **Long-Lived Process:** `uvicorn` runs continuously on a virtual machine or container.
2. **Persistent In-Memory Set:** `self.active_connections: Set[WebSocket]` stores open WebSocket instances in the process heap.
3. **Infinite Event Loop:** `asyncio.create_task(market_data_engine.broadcast_loop())` runs a continuous `while True: await asyncio.sleep(1.0)` tick loop.

**On Vercel Functions:**
- When an incoming HTTP or WebSocket request arrives, Vercel invokes a serverless worker.
- If no traffic arrives for a few seconds, **Vercel freezes or terminates the container**.
- Any `broadcast_loop()` running in the background is instantly killed.
- Furthermore, if 50 users connect, Vercel routes them across multiple distinct serverless execution instances. Instance A has no access to the WebSocket descriptors stored in Instance B's memory.

### 3.2 Safe Adaptations for Full Vercel Deployment

If the user strictly mandates Vercel deployment without Render/Railway, FINBUD must adopt one of two architectural patterns:

#### Pattern A: HTTP SWR Polling (Recommended Minimum Safe Change)
- The frontend ticker already has an automatic fallback to `GET /api/v1/market/tickers`.
- In `frontend/src/config/api.ts` and `useMarketTicks.ts`, configure HTTP polling at 5-second intervals when WebSockets are unavailable or serverless is detected.
- Each HTTP request invokes FastAPI on-demand, fetches quotes with cache TTL from `market_price_cache`, and terminates cleanly without lingering processes.

#### Pattern B: External Realtime Pub/Sub (Supabase Realtime / Pusher)
- Instead of FastAPI maintaining active sockets, use **Supabase Realtime Broadcast**.
- A scheduled Vercel Cron (`/api/cron/refresh-markets` every minute) writes quotes to Supabase.
- Supabase Realtime pushes ticks to the Next.js frontend over managed WebSockets, completely offloading persistent connection management from Vercel.

---

## Section 4: Exact Vercel Project Settings & Environment Variables

### 4.1 Project 1: Frontend (`frontend`)

#### Project Configuration:
- **Project Name:** `finbud-web`
- **Root Directory:** `frontend`
- **Framework Preset:** `Next.js`
- **Build Command:** `next build`
- **Output Directory:** `.next`

#### Environment Variables (Configured in Vercel Dashboard):
```env
# Application Identity
NEXT_PUBLIC_APP_NAME="FINBUD"

# Production API Endpoint (Pointed to Project 2)
NEXT_PUBLIC_API_BASE_URL="https://finbud-api.vercel.app/api/v1"
NEXT_PUBLIC_API_URL="https://finbud-api.vercel.app/api/v1"

# Supabase Public Keys (Safe for browser bundle)
NEXT_PUBLIC_SUPABASE_URL="https://tavndufcbqtvadkeypbl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
```

---

### 4.2 Project 2: Backend API (`backend`)

#### Project Configuration:
- **Project Name:** `finbud-api`
- **Root Directory:** `backend`
- **Framework Preset:** `Other`
- **Build Command:** *(Leave Empty - handled by `@vercel/python`)*
- **Output Directory:** *(Leave Empty)*

#### Environment Variables (Configured in Vercel Dashboard):
```env
# Serverless Environment Flag
ENVIRONMENT="production"
PROJECT_NAME="FINBUD Financial Intelligence"
API_V1_STR="/api/v1"

# CORS Whitelist (Allow ONLY Project 1)
CORS_ORIGINS="https://finbud-web.vercel.app,https://finbud.vercel.app"

# Supabase Server-Side Credentials (NEVER expose to frontend)
SUPABASE_URL="https://tavndufcbqtvadkeypbl.supabase.co"
SUPABASE_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
SUPABASE_JWT_SECRET="your-supabase-jwt-secret"

# LLM Conversational Engine
GEMINI_API_KEY="AIzaSy..."

# Cache TTL (Seconds)
MARKET_CACHE_TTL_SECONDS="3600"
```

---

## Section 5: Step-by-Step Vercel Deployment Runbook

### Step 1: Deploy Backend API First
1. Log in to [Vercel](https://vercel.com) → Click **Add New...** → **Project**.
2. Select repository `Hamenath/Finbud`.
3. Set **Root Directory** to `backend`.
4. Add all Section 4.2 Backend Environment Variables.
5. Click **Deploy**.
6. When deployment finishes, copy the assigned domain: `https://<your-backend>.vercel.app`.
7. Test the health endpoint: `curl https://<your-backend>.vercel.app/health`.

### Step 2: Deploy Frontend UI
1. In Vercel, click **Add New...** → **Project**.
2. Select the same repository `Hamenath/Finbud`.
3. Set **Root Directory** to `frontend`.
4. Add all Section 4.1 Frontend Environment Variables, setting `NEXT_PUBLIC_API_BASE_URL` to the backend URL from Step 1.
5. Click **Deploy**.
6. When deployment finishes, copy the assigned frontend domain: `https://<your-frontend>.vercel.app`.

### Step 3: Close the Security Loop
1. Open Project 2 (`finbud-api`) Settings → **Environment Variables**.
2. Update `CORS_ORIGINS` to the exact frontend domain from Step 2.
3. Redeploy `finbud-api` to apply the updated CORS origin policy.
4. Open [Supabase Dashboard](https://supabase.com/dashboard/project/tavndufcbqtvadkeypbl/auth/url-configuration) and add `https://<your-frontend>.vercel.app/**` to **Redirect URLs**.

---

## Section 6: Summary Comparison: Vercel vs Render/Railway

| Evaluation Metric | Full-Stack Vercel Architecture | Hybrid Vercel + Render/Railway |
| :--- | :--- | :--- |
| **Frontend Performance** | Excellent (Edge CDN, Turbopack SSR) | Excellent (Edge CDN, Turbopack SSR) |
| **REST API Latency** | Low to Moderate (Cold start ~1-2s) | Fast (<50ms, warm persistent process) |
| **Real-time 1s Market Ticker** | **Degraded** (Requires HTTP Polling) | **Native** (Persistent WebSocket stream) |
| **Cost Profile** | Free tier friendly (within quotas) | Free tier available on Render/Railway |
| **Operational Complexity** | Single cloud provider dashboard | Two cloud provider dashboards |
| **Recommendation** | Ideal for simple portfolio & ML tasks | **Strongly recommended** for real-time tickers |

