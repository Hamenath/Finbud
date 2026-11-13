# FINBUD API Documentation

Base URL: `http://127.0.0.1:8000/api/v1`

## Authentication
Protected endpoints require:
`Authorization: Bearer <SUPABASE_JWT_TOKEN>`

---

## Endpoints

### 1. Market Data
- `GET /market/tickers`: Live market overview (Nifty 50, Sensex, Gold, Silver, USD/INR).
- `GET /market/metals/spot`: 24K, 22K, 18K gold and 999 fine silver rates in INR per gram.
- `GET /market/metals/history?metal=GOLD&period=3mo`: Historical daily closing prices with 20-day SMA and EMA indicators.

### 2. Wealth Multiplier Lab
- `POST /wealth/compound`: Calculates Lump Sum + SIP growth trajectory, Rule of 72, and inflation-adjusted future values.
- `POST /wealth/cagr`: Computes Compound Annual Growth Rate.
- `POST /wealth/monte-carlo`: Executes 1,000-run Geometric Brownian Motion simulations.

### 3. Predictive Expense Engine
- `POST /ml/predict-cashflow`: Forecasts month-end expenses, surplus, and savings rate.
- `POST /ml/category-anomalies`: Detects category-level statistical spending outliers with explainable rationales.
- `GET /ml/evaluate-model`: Evaluates Ridge regression against historical-average baseline.

### 4. FINBUD AI RAG Assistant
- `POST /rag/ask`: Retrieves relevant passages from the curated knowledge base and answers user queries with source citations.
- `GET /rag/evaluate`: Runs automated benchmark evaluating retrieval relevance, answer faithfulness, and citation coverage.

### 5. PDF Scorecard Report
- `POST /reports/scorecard-pdf`: Generates an audit-ready downloadable financial health scorecard. Requires Supabase JWT token.
