from typing import Dict, Any, List
from supabase import create_client
from app.core.config import settings
from app.services.market import market_service
from app.ml.predictive_engine import predictive_engine
from app.ml.anomaly_surveillance import category_anomaly_service

class FinancialAggregationService:
    """
    Independent Server-Side Financial Aggregator.
    Never trusts client-supplied totals.
    Queries Supabase using the authenticated user's ID only.
    """

    @staticmethod
    def aggregate_user_finances(user_id: str, user_email: str) -> Dict[str, Any]:
        # Connect with backend credentials
        sb = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

        # 1. Transactions Aggregation
        tx_res = sb.table("transactions").select("*").eq("user_id", user_id).execute()
        transactions = tx_res.data or []

        total_income = 0.0
        total_expenses = 0.0
        cat_map: Dict[str, Dict[str, Any]] = {}

        for t in transactions:
            amt = float(t.get("amount", 0.0) or 0.0)
            tx_type = t.get("type", "EXPENSE")
            if tx_type == "INCOME":
                total_income += amt
            else:
                total_expenses += amt
                cat = t.get("category", "General") or "General"
                if cat not in cat_map:
                    cat_map[cat] = {"amount": 0.0, "count": 0}
                cat_map[cat]["amount"] += amt
                cat_map[cat]["count"] += 1

        net_savings = total_income - total_expenses
        savings_rate = round((net_savings / total_income * 100.0), 1) if total_income > 0 else 0.0

        category_spending = []
        for cat, val in cat_map.items():
            pct = round((val["amount"] / total_expenses * 100.0), 1) if total_expenses > 0 else 0.0
            category_spending.append({
                "category": cat,
                "amount": round(val["amount"], 2),
                "count": val["count"],
                "percentage": pct
            })
        # Sort category spending descending
        category_spending.sort(key=lambda x: x["amount"], reverse=True)

        # 2. Precious Metals Holdings Aggregation
        metals_res = sb.table("metal_holdings").select("*").eq("user_id", user_id).execute()
        metals = metals_res.data or []

        spot_rates = market_service.get_metal_spot_rates()
        gold_24k_rate = spot_rates.get("gold_24k_per_gram", 7742.0)
        silver_rate = spot_rates.get("silver_per_gram", 91.20)

        gold_grams = 0.0
        silver_grams = 0.0
        metals_valuation = 0.0

        for m in metals:
            w = float(m.get("weight_grams", 0.0) or 0.0)
            purity = float(m.get("purity_karat", 24.0) or 24.0)
            m_type = m.get("metal_type", "GOLD")

            if m_type == "GOLD":
                gold_grams += w
                ref = gold_24k_rate if purity >= 24 else (gold_24k_rate * (purity / 24.0))
                metals_valuation += w * ref
            else:
                silver_grams += w
                metals_valuation += w * silver_rate

        # 3. Insurance Policies Aggregation
        ins_res = sb.table("insurance_policies").select("*").eq("user_id", user_id).execute()
        policies = ins_res.data or []

        term_coverage = 0.0
        annual_insurance_premium = 0.0

        for p in policies:
            sum_ins = float(p.get("sum_insured", 0.0) or 0.0)
            prem = float(p.get("premium_annual", 0.0) or 0.0)
            annual_insurance_premium += prem
            if p.get("policy_type") == "TERM_LIFE":
                term_coverage += sum_ins

        # 4. ML Cashflow Forecast Projection
        ml_burn = None
        ml_savings = None
        if transactions:
            try:
                forecast_res = predictive_engine.forecast_user_cashflow(
                    transactions=transactions,
                    monthly_income_target=total_income if total_income > 0 else 75000.0,
                    days_in_month=30
                )
                ml_burn = forecast_res.get("month_end_estimated_expense")
                ml_savings = forecast_res.get("estimated_month_end_savings")
            except Exception:
                pass

        # 5. Category Anomalies Surveillance
        anomaly_count = 0
        if transactions:
            try:
                anomaly_res = category_anomaly_service.analyze_category_anomalies(
                    current_transactions=transactions
                )
                anomaly_count = anomaly_res.get("anomalies_detected_count", 0)
            except Exception:
                pass

        health_score = min(96, max(40, round(50 + savings_rate * 0.8)))

        return {
            "user_id": user_id,
            "user_email": user_email,
            "period": "November 2026",
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": savings_rate,
            "category_spending": category_spending,
            "gold_grams": round(gold_grams, 2),
            "silver_grams": round(silver_grams, 2),
            "metals_valuation": round(metals_valuation, 2),
            "term_insurance_cover": round(term_coverage, 2),
            "annual_insurance_premium": round(annual_insurance_premium, 2),
            "ml_projected_month_end_burn": round(ml_burn, 2) if ml_burn else None,
            "ml_projected_month_end_savings": round(ml_savings, 2) if ml_savings else None,
            "detected_anomalies_count": anomaly_count,
            "health_score": health_score,
            "is_demo": len(transactions) == 0 and len(metals) == 0 and len(policies) == 0
        }

financial_aggregator = FinancialAggregationService()

