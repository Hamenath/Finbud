# FINBUD — Financial Calculation Accuracy Report

**Date:** November 2026  
**Auditor:** Quantitative Financial Engineer  

---

## 1. Verified Financial Formulas & Mathematical Proofs

### 1.1 SIP Compounding (Ordinary Annuity with Monthly Compounding)
$$\text{FV}_{\text{SIP}} = \text{PMT} \cdot \left[ \frac{(1 + i)^n - 1}{i} \right] \cdot (1 + i)$$
* **Test Case:** Monthly Contribution = ₹10,000, Annual Rate = 12% ($i = 0.01$), 10 Years ($n = 120$).
* **Expected Nominal FV:** ₹23,23,390.79.
* **Algorithm Result:** ₹23,23,390.79 (`test_wealth_compound_calculation`).
* **Status:** **PASS**.

### 1.2 Lump-Sum Compounding
$$\text{FV}_{\text{lump}} = P \cdot (1 + r)^t$$
* **Test Case:** $P = ₹1,00,000$, $r = 12\%$, $t = 10\text{ years}$.
* **Expected Nominal FV:** ₹3,10,584.82.
* **Status:** **PASS**.

### 1.3 Rule of 72 Doubling Time
$$\text{Years to Double} \approx \frac{72}{r}$$
* **Test Case:** $r = 12\% \implies 72 / 12 = 6.0\text{ years}$.
* **Algorithm Result:** `6.0` (`test_wealth_compound_calculation`).
* **Status:** **PASS**.

### 1.4 Compound Annual Growth Rate (CAGR)
$$\text{CAGR} = \left( \frac{\text{FV}}{\text{PV}} \right)^{1/t} - 1$$
* **Test Case:** $\text{PV} = ₹1,00,000$, $\text{FV} = ₹2,00,000$, $t = 6\text{ years}$.
* **Expected CAGR:** $12.25\%$.
* **Algorithm Result:** $12.25\%$ (`test_wealth_cagr_calculation`).
* **Status:** **PASS**.

### 1.5 Edge-Case Tests (0% Return & 0% Inflation)
* **Invested Principal:** ₹50,000 initial + (₹5,000 $\times$ 60 months) = ₹3,50,000.
* **Calculated Nominal FV:** ₹3,50,000.
* **Calculated Real FV:** ₹3,50,000.
* **Status:** **PASS**. Zero division-by-zero errors.

---

## 2. Precious Metals Valuation Model

### 2.1 Purity Formulas
* **24K Gold:** $100\%$ spot rate.
* **22K Gold:** $\text{Spot} \times \frac{22}{24} = 91.67\%$.
* **18K Gold:** $\text{Spot} \times \frac{18}{24} = 75.00\%$.

### 2.2 Landed Import Parity Model
$$\text{INR Price/g} = \left( \frac{\text{COMEX Futures (USD/oz)} \times \text{USD/INR}}{31.1034768} \right) \times 1.09$$
* **Assumption Disclosure:** $1.09$ factor accounts for the rationalized $6\%$ Basic Customs Duty + $3\%$ GST effective Union Budget 2024. Excludes retail making charges ($8\%$–$25\%$).
* **Status:** **PASS**.

