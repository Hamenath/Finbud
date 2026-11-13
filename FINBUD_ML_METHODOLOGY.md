# FINBUD ML Methodology

## 1. Predictive Cash-Flow Engine

### Problem Formulation
Predict end-of-month cumulative expenses $E_{\text{total}}$ from partial intra-month spending data $\{e_1, e_2, \dots, e_d\}$ for day $d \in [1, D]$, where $D = 30$.

### Algorithm
We formulate the problem as regularized linear regression (Ridge):
$$\min_w \sum_{i} \left( y_i - w x_i \right)^2 + \alpha \|w\|_2^2$$

### Prevention of Data Leakage
- **Time-Based Train/Test Split:** Historical completed months $1 \dots T-1$ form the training set. The latest complete month $T$ is kept strictly isolated as the holdout test set. Future daily information is never leaked into training features.

---

## 2. Category Anomaly Surveillance

### Algorithm
For each category $c$, calculate historical parameters:
- Mean: $\mu_c$
- Standard Deviation: $\sigma_c$
- 95th Percentile: $P_{95}(c)$

Threshold definition:
$$T_c = \max(\mu_c + 2\sigma_c, 5000)$$

A transaction with amount $x$ is flagged when:
$$x > T_c \quad \text{and} \quad x > 2.5 \mu_c$$

Flagged transactions produce human-readable diagnostic rationales:
> *"Transaction of ₹15,000.00 is 5.2× the typical historical baseline of ₹2,880.00 in Food & Dining."*

