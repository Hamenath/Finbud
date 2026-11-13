# FINBUD Test Cases & Quality Assurance

All test cases are implemented and automated in `backend/tests/test_end_to_end.py`.

## Test Execution Summary

| Test ID | Module | Scenario | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Wealth Lab | Standard Compounding (10 yrs, 12% return) | Nominal FV > ₹23 Lakhs, Rule of 72 = 6.0 yrs | **PASS** |
| TC-02 | Wealth Lab | 0% return & 0% inflation edge cases | Nominal FV == Total Invested Principal | **PASS** |
| TC-03 | Wealth Lab | CAGR calculation (PV: 100k, FV: 200k, 6 yrs) | CAGR = 12.25% | **PASS** |
| TC-04 | Wealth Lab | Monte Carlo simulation (500 runs) | P10 < P50 < P90, Capital preservation ≥ 90% | **PASS** |
| TC-05 | Predictive ML | Empty ledger handling | Returns cold-start baseline without crashing | **PASS** |
| TC-06 | Predictive ML | Normal spending cashflow | Computes projected month-end burn & savings | **PASS** |
| TC-07 | Anomaly ML | High spending spike in Food & Dining | Flags anomaly with explanatory rationale | **PASS** |
| TC-08 | Market Data | Precious metals spot rates | Validates 24K, 22K, 18K and silver per gram in INR | **PASS** |
| TC-09 | Market Data | Historical 3mo price chart | Computes valid SMA-20 and EMA-20 indicators | **PASS** |
| TC-10 | RAG AI | Sovereign Gold Bond tax question | Grounded answer with source citations | **PASS** |
| TC-11 | RAG AI | Out-of-scope query (e.g. cooking recipe) | Declines with scope limitation notice | **PASS** |
| TC-12 | RAG AI | Automated evaluation benchmark | 100% Relevance, Faithfulness & Coverage | **PASS** |
| TC-13 | Security | Unauthenticated PDF generation request | Rejected with HTTP 401 Unauthorized | **PASS** |
| TC-14 | Frontend | Next.js Turbopack production compilation | All 15 routes compiled with 0 errors | **PASS** |
