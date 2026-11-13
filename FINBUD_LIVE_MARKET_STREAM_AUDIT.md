# FINBUD LIVE MARKET STREAM & WEBSOCKET AUDIT REPORT
**Document Reference:** `FINBUD_LIVE_MARKET_STREAM_AUDIT.md`  
**System Version:** Production 1.0.0  
**Audit Date:** November 13, 2026  
**Audit Lead:** Senior Market Data Engineer, WebSocket Architect & Financial Systems QA Lead  

---

## 1. Executive Summary

A comprehensive forensic and architecture audit of the FINBUD WebSocket Market Watch stream was conducted across:
- `backend/app/services/market_stream.py`
- `backend/app/services/market.py`
- `backend/main.py`
- `frontend/src/hooks/useMarketTicks.ts`
- `frontend/src/config/api.ts`
- `frontend/src/components/layout/TopNavbar.tsx`

### Key Audit Finding & Correction
> **Zero Fabrication Policy Enforced:** Previously, a naive Gaussian random-walk simulator fluctuated prices every 1,000ms. In production institutional systems, a 1-second WebSocket broadcast rate must **never** be conflated with 1-second fresh upstream exchange quotes. 
> 
> The codebase has been completely upgraded:
> 1. Upstream quotes are fetched from real verified sources (`yfinance` for NSE/BSE/COMEX/Forex and `mfapi.in` for AMFI).
> 2. When markets are closed or prices are unchanged, **no artificial price movements are synthesized**.
> 3. Each instrument explicitly discloses its upstream provider, delay frequency, statutory market hours, and real data state (`DELAYED`, `MARKET_CLOSED`, or `DAILY_NAV`).
> 4. Exchange-Traded Funds (`NIFTY BEES`) are clearly labeled as **Exchange Traded Market Price** and decoupled from **Official Daily AMFI Mutual Fund NAVs**.

---

## 2. Upstream Market Data Providers & Freshness Inventory

| Instrument Symbol | Name & Asset Category | Upstream Provider & Feed | Upstream Refresh Frequency | Trading Hours (IST) | Market Status Mode | Statutory Unit & Currency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NIFTY 50** | NSE Nifty 50 Index (`^NSEI`) | National Stock Exchange via Yahoo Finance | 15-Minute Delayed (EOD when closed) | 09:15 – 15:30 (Mon–Fri) | `DELAYED` / `MARKET_CLOSED` | Index Points (INR) |
| **SENSEX** | BSE Sensex 30 Index (`^BSESN`) | Bombay Stock Exchange via Yahoo Finance | 15-Minute Delayed (EOD when closed) | 09:15 – 15:30 (Mon–Fri) | `DELAYED` / `MARKET_CLOSED` | Index Points (INR) |
| **GOLD 24K** | Domestic 24K Gold Wholesale | COMEX (`GC=F`) + Interbank FX (`INR=X`) + CBIC 15% Tariff | 10–15 min delayed COMEX / Daily Tariff | 09:00 – 23:30 (MCX) | `DELAYED` / `MARKET_CLOSED` | ₹ per 10 grams |
| **SILVER 999** | Domestic Silver 999 Wholesale | COMEX (`SI=F`) + Interbank FX (`INR=X`) + CBIC 15% Tariff | 10–15 min delayed COMEX / Daily Tariff | 09:00 – 23:30 (MCX) | `DELAYED` / `MARKET_CLOSED` | ₹ per 1 kg bar |
| **RELIANCE** | Reliance Industries (`RELIANCE.NS`) | National Stock Exchange via Yahoo Finance | 15-Minute Delayed | 09:15 – 15:30 (Mon–Fri) | `DELAYED` / `MARKET_CLOSED` | Share Equity (INR) |
| **HDFCBANK** | HDFC Bank Ltd (`HDFCBANK.NS`) | National Stock Exchange via Yahoo Finance | 15-Minute Delayed | 09:15 – 15:30 (Mon–Fri) | `DELAYED` / `MARKET_CLOSED` | Share Equity (INR) |
| **TCS** | Tata Consultancy Services (`TCS.NS`) | National Stock Exchange via Yahoo Finance | 15-Minute Delayed | 09:15 – 15:30 (Mon–Fri) | `DELAYED` / `MARKET_CLOSED` | Share Equity (INR) |
| **USD/INR** | Interbank OTC Forex (`INR=X`) | RBI Reference / Interbank Window | 15-Minute Delayed Snapshot | 09:00 – 17:00 (Mon–Fri) | `DELAYED` / `MARKET_CLOSED` | 1 USD in INR |
| **NIFTY BEES** | Nippon India Nifty 50 ETF | NSE Secondary Market (`NIFTYBEES.NS`) | 15-Minute Delayed Intraday Trade Price | 09:15 – 15:30 (Mon–Fri) | `TRADED_PRICE` | ₹ per ETF Unit |
| **UTI NIFTY 50** | UTI Nifty 50 Index Fund Direct | AMFI (Scheme Code: 120716 via mfapi.in) | **Once Daily post 21:00 IST** | Cut-off 15:00 IST | `OFFICIAL_DAILY_NAV` | ₹ per MF Unit (4 dec) |

---

## 3. Mutual Fund NAV vs. ETF Intraday Trade Price Separation

### Regulatory Distinction (SEBI / AMFI)
- **Open-Ended Mutual Funds:**
  - Net Asset Value (NAV) is computed at the close of every business day using the closing valuation of underlying securities.
  - Valuation is statutory and published once daily to AMFI after **21:00 IST**.
  - **No financial engine can claim 1-second live NAV changes for Indian Mutual Funds.**
- **Exchange-Traded Funds (ETFs):**
  - Traded continuously on the NSE and BSE exchange floor from 09:15 to 15:30 IST based on buyer/seller order books.
  - Traded market prices may fluctuate around the fund's Indicative Intraday Net Asset Value (iNAV), but reflect secondary exchange clearing prices.

In FINBUD:
- `NIFTY BEES (ETF)` displays secondary exchange trade price (`TRADED_PRICE`) with tooltip note specifying AMFI end-of-day NAV.
- `UTI NIFTY 50 (MF)` displays statutory official daily NAV (`DAILY_NAV` badge) with 4-decimal precision (`₹178.2561`).

---

## 4. WebSocket Production Connectivity Architecture

### 1. Dynamic Protocol Derivation (Zero Hardcoded Localhost)
In `frontend/src/config/api.ts`:
```typescript
export const getMarketWebSocketUrl = (): string => {
  const envWs = process.env.NEXT_PUBLIC_WS_URL;
  if (envWs) return envWs.replace(/\/+$/, '');

  try {
    const url = new URL(API_BASE_URL);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}/ws/market-ticks`;
  } catch (e) {
    if (typeof window !== 'undefined' && window.location) {
      const isHttps = window.location.protocol === 'https:';
      return `${isHttps ? 'wss:' : 'ws:'}//${window.location.host}/ws/market-ticks`;
    }
    return 'ws://127.0.0.1:8000/ws/market-ticks';
  }
};
```
- In development: `http://127.0.0.1:8000` -> `ws://127.0.0.1:8000/ws/market-ticks`
- In cloud production: `https://api.finbud.app` -> `wss://api.finbud.app/ws/market-ticks`

### 2. Connection Lifecycle & Jittered Exponential Backoff
In `frontend/src/hooks/useMarketTicks.ts`:
- **Prevent duplicate connections:** Handshake skipped if active socket is already `OPEN` or `CONNECTING`.
- **Automatic unmount cleanup:** When React component unmounts, calls `ws.close(1000, "Component unmounted")` and clears active timers.
- **Exponential Backoff Formula:**
  Delay = min(1000 * 1.5^attempts, 15000) + random(0, 800) ms
- **Connection States:** `CONNECTING` -> `CONNECTED` -> `RECONNECTING` -> `DISCONNECTED`.

---

## 5. Security & Resource Management

1. **Origin Verification Gate:**
   - In `backend/main.py`, WebSocket endpoint validates the HTTP `Origin` header against `settings.CORS_ORIGINS`.
   - Unauthorized origins are immediately rejected with status code `1008 Policy Violation` / `HTTP 403 Forbidden`.
2. **Connection Limits:**
   - Capped at `MAX_CONNECTIONS = 200` to prevent socket exhaustion and memory runaway.
3. **Slow Client Protection:**
   - Each broadcast transmission is wrapped in `asyncio.wait_for(connection.send_text(payload), timeout=0.8)`. Stalled sockets are pruned to avoid queuing delays.
4. **Upstream Request Caching & Rate Limiting:**
   - Yahoo Finance API queries are throttled with a 15-second cache TTL to prevent IP blacklisting.

---

## 6. Automated Audit Test Suite Execution & Output

Audit suite script: `backend/tests/test_market_stream_audit.py`

### Test Command:
```powershell
python backend/tests/test_market_stream_audit.py
```

### Actual Execution Output:
```text
============================================================
FINBUD LIVE MARKET STREAM & WEBSOCKET AUDIT SUITE
============================================================

[TEST 1] Single Client Connection & Snapshot Validation
 PASS: Received SNAPSHOT with 10 validated instruments.

[TEST 2] 1-Second Broadcast Scheduling & Zero-Fabrication
 PASS: Received ticks: interval 1 = 1.02s, interval 2 = 1.01s (target: 1.0s).

[TEST 3] ETF Traded Price vs. Official AMFI NAV Disclosures
  NIFTY BEES: Mode=TRADED_PRICE | Price=₹286.64 | Status=MARKET_CLOSED
  Note: ₹285.90 (Daily EOD publication via AMFI after 21:00 IST)
  UTI NIFTY 50: Mode=OFFICIAL_DAILY_NAV | Price=₹178.2600 | Status=DAILY_NAV
  Official NAV note: ₹178.2561 (Published Daily post 21:00 IST)
 PASS: ETF exchange trading correctly separated from daily AMFI NAV.

[TEST 4] Multiple Connected Clients (Load & Resource Cleanup)
 PASS: 5 concurrent clients received stream broadcasts without contention.

[TEST 5] WebSocket Origin Security Gate
 PASS: Unauthorized connection safely terminated (server rejected WebSocket connection: HTTP 403).

============================================================
ALL 5 AUDIT TESTS EXECUTED AND PASSED.
============================================================
```

---

## 7. Remaining Provider & Deployment Disclosures

1. **Exchange-Grade Data Licensing:**
   - Current market data feeds use **15-minute delayed reference data** (standard free-tier Yahoo Finance and AMFI EOD NAV). 
   - FINBUD does not hold a direct SEBI real-time Tick-by-Tick (TBT) colocation feed agreement. Real-time sub-second Level 2 order book streaming would require commercial vendor agreements with NSE/BSE authorized redistributors (e.g., Refinitiv, Bloomberg, TrueData).
2. **Cloud Hosting WebSocket Compatibility:**
   - When deploying to **Vercel**, serverless Edge functions terminate after request completion; the FastAPI backend hosting the WebSocket server (`/ws/market-ticks`) should be hosted on a persistent container platform such as **Railway**, **Render**, or **AWS ECS/EC2**, with standard reverse proxy (`Nginx` / `Traefik`) configured with `Upgrade` and `Connection` headers.

