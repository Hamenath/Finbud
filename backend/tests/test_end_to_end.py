import pytest
from app.ml.wealth_engine import wealth_engine
from app.ml.predictive_engine import predictive_engine
from app.ml.anomaly_surveillance import category_anomaly_service
from app.services.market import market_service
from app.rag.rag_pipeline import rag_pipeline
from app.rag.evaluator import run_rag_evaluation

# ==========================================
# 1. Wealth Multiplier Lab Mathematical Audit
# ==========================================
def test_wealth_compound_calculation():
    # Test standard compounding: PV=100,000, SIP=10,000/mo, 12% p.a., 10 yrs, 6% inflation
    res = wealth_engine.calculate_compound_wealth(
        initial_investment=100000.0,
        monthly_sip=10000.0,
        annual_rate_pct=12.0,
        years=10,
        inflation_rate_pct=6.0
    )
    assert res["nominal_future_value"] > 2300000.0
    assert res["real_future_value_in_todays_rupees"] < res["nominal_future_value"]
    assert res["rule_of_72_doubling_years"] == pytest.approx(6.0, rel=1e-2)
    assert len(res["annual_trajectory"]) == 11
    assert res["total_invested_principal"] == 1300000.0

def test_wealth_zero_percent_return_and_inflation():
    res = wealth_engine.calculate_compound_wealth(
        initial_investment=50000.0,
        monthly_sip=5000.0,
        annual_rate_pct=0.0,
        years=5,
        inflation_rate_pct=0.0
    )
    # Total invested = 50k + (5k * 12 * 5) = 350,000
    assert res["total_invested_principal"] == 350000.0
    assert res["nominal_future_value"] == 350000.0
    assert res["real_future_value_in_todays_rupees"] == 350000.0

def test_wealth_cagr_calculation():
    # PV=100k, FV=200k in 6 years -> CAGR = (200/100)^(1/6) - 1 ≈ 12.25%
    res = wealth_engine.calculate_cagr(present_value=100000.0, future_value=200000.0, years=6.0)
    assert res["cagr_percent"] == pytest.approx(12.25, rel=1e-2)
    assert res["valid"] is True

def test_monte_carlo_distribution():
    res = wealth_engine.run_monte_carlo(
        initial_investment=100000.0,
        monthly_sip=10000.0,
        mean_annual_return_pct=12.0,
        annual_volatility_pct=15.0,
        years=10,
        num_simulations=500,
        seed=42
    )
    assert res["conservative_outcome_p10"] < res["median_outcome_p50"] < res["optimistic_outcome_p90"]
    assert res["probability_of_capital_preservation_pct"] >= 90.0

# ==========================================
# 2. Predictive Expense Engine & Anomaly Detection
# ==========================================
def test_predictive_engine_empty_dataset():
    res = predictive_engine.forecast_user_cashflow(transactions=[], monthly_income_target=75000.0)
    assert res["status"] == "INSUFFICIENT_DATA"
    assert res["current_month_outflow"] == 0.0
    assert res["estimated_month_end_savings"] > 0

def test_predictive_engine_normal_spending():
    transactions = [
        {"amount": 1200.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-11-01"},
        {"amount": 800.0, "type": "EXPENSE", "category": "Groceries", "transaction_date": "2026-11-05"},
        {"amount": 25000.0, "type": "EXPENSE", "category": "Housing & Rent", "transaction_date": "2026-11-10"},
        {"amount": 80000.0, "type": "INCOME", "category": "Salary", "transaction_date": "2026-11-01"},
    ]
    res = predictive_engine.forecast_user_cashflow(transactions=transactions, monthly_income_target=80000.0)
    assert res["predicted_month_end_expense"] > 0
    assert res["estimated_month_end_savings"] < 80000.0

def test_category_anomaly_detection():
    historical = [
        {"amount": 500.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-10-01"},
        {"amount": 600.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-10-05"},
        {"amount": 450.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-10-10"},
        {"amount": 550.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-10-15"},
        {"amount": 500.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-10-20"},
    ]
    current = [
        {"amount": 550.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-11-01"},
        {"amount": 15000.0, "type": "EXPENSE", "category": "Food & Dining", "transaction_date": "2026-11-02", "notes": "Grand Party Banquet"},
    ]
    res = category_anomaly_service.analyze_category_anomalies(
        current_transactions=current,
        historical_transactions=historical
    )
    assert res["anomalies_detected_count"] >= 1
    assert any("Food & Dining" in str(a.get("category", "")) for a in res["anomalies"])
    assert "explanation" in res["anomalies"][0]

# ==========================================
# 3. Precious Metals & Market Data Services
# ==========================================
def test_metal_spot_rates():
    rates = market_service.get_metal_spot_rates()
    assert rates["currency"] == "INR"
    assert rates["gold_24k_per_gram"] > 6000.0
    assert rates["gold_22k_per_gram"] == pytest.approx(rates["gold_24k_per_gram"] * (22.0 / 24.0), rel=1e-2)
    assert rates["silver_per_gram"] > 50.0
    assert "provider" in rates
    # Verify statutory 15% customs + 3% IGST (1.1845 landed multiplier)
    assert rates["effective_landed_multiplier"] == pytest.approx(1.1845, rel=1e-3)
    assert "15.0%" in rates["customs_duty_rate"]

def test_metal_historical_chart():
    chart = market_service.get_metal_historical_chart(metal="GOLD", period="3mo")
    assert chart["metal"] == "GOLD"
    assert len(chart["data_points"]) >= 30
    last_pt = chart["data_points"][-1]
    assert "price" in last_pt
    assert "sma20" in last_pt or "sma_20" in last_pt
    assert "ema20" in last_pt or "ema_20" in last_pt

# ==========================================
# 4. RAG Pipeline & Evaluation Benchmark
# ==========================================
def test_rag_answering_tax_question():
    res = rag_pipeline.answer_query("What is the tax rate on Sovereign Gold Bonds held until maturity?")
    assert "tax" in res["answer"].lower()
    assert len(res["citations"]) > 0
    assert res["citations"][0]["title"] is not None

def test_rag_out_of_scope_query():
    res = rag_pipeline.answer_query("Can you give me the recipe for butter chicken?")
    assert res["is_out_of_scope"] is True
    assert "outside the scope" in res["answer"].lower()

def test_rag_evaluation_benchmark():
    eval_res = run_rag_evaluation()
    assert eval_res["total_test_queries"] >= 5
    assert eval_res["retrieval_relevance_rate_pct"] == 100.0
    assert eval_res["answer_faithfulness_rate_pct"] == 100.0
    assert eval_res["citation_coverage_rate_pct"] == 100.0
