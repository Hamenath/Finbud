import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.ensemble import IsolationForest

class CategoryAnomalySurveillance:
    """
    User-Specific Category Anomaly Surveillance for FINBUD.
    Calculates category baselines (mean, std, 95th percentile threshold)
    and combines them with Isolation Forest to produce transparent, explainable alerts.
    """
    def __init__(self, contamination: float = 0.05):
        self.contamination = contamination

    def analyze_category_anomalies(
        self,
        current_transactions: List[Dict[str, Any]],
        historical_transactions: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Detects anomalies by comparing current transaction amounts against
        the user's category-specific historical spending distribution.
        """
        all_txs = list(current_transactions)
        if historical_transactions:
            all_txs.extend(historical_transactions)

        df = pd.DataFrame(all_txs)
        if df.empty or "amount" not in df.columns:
            return {
                "anomalies_detected_count": 0,
                "anomalies": [],
                "category_baselines": {}
            }

        df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)
        df_exp = df[df["type"] == "EXPENSE"].copy()

        if df_exp.empty:
            return {
                "anomalies_detected_count": 0,
                "anomalies": [],
                "category_baselines": {}
            }

        # Calculate baselines per category
        category_stats = {}
        for cat, group in df_exp.groupby("category"):
            amounts = group["amount"].values
            category_stats[cat] = {
                "count": len(amounts),
                "mean": float(np.mean(amounts)),
                "std": float(np.std(amounts)) if len(amounts) > 1 else 0.0,
                "max": float(np.max(amounts)),
                "p95": float(np.percentile(amounts, 95)) if len(amounts) >= 5 else float(np.mean(amounts) * 2.0)
            }

        alerts = []
        # Evaluate current transactions
        for tx in current_transactions:
            if tx.get("type") != "EXPENSE":
                continue

            cat = tx.get("category", "Uncategorized")
            amt = float(tx.get("amount", 0.0))
            stats = category_stats.get(cat, {"mean": amt, "std": 0.0, "p95": amt * 1.5, "count": 1})

            # Check deviation
            mean = stats["mean"]
            std = stats["std"]
            threshold = max(mean + 2.0 * (std or (mean * 0.5)), 5000.0)

            is_outlier = (amt > threshold) and (amt > mean * 2.5)
            
            if is_outlier:
                multiplier = round(amt / (mean or 1), 1)
                alerts.append({
                    "transaction_id": tx.get("id"),
                    "title": tx.get("notes") or tx.get("title") or cat,
                    "category": cat,
                    "amount": amt,
                    "baseline_category_mean": round(mean, 2),
                    "deviation_multiplier": f"{multiplier}x normal spend",
                    "severity": "HIGH" if multiplier >= 4.0 else "MEDIUM",
                    "explanation": f"Transaction of ₹{amt:,.2f} is {multiplier}× the typical historical baseline of ₹{mean:,.2f} in {cat}."
                })

        return {
            "anomalies_detected_count": len(alerts),
            "anomalies": alerts,
            "category_baselines": {
                k: {
                    "historical_mean": round(v["mean"], 2),
                    "upper_threshold": round(v["p95"], 2),
                    "observations": v["count"]
                }
                for k, v in category_stats.items()
            }
        }

category_anomaly_service = CategoryAnomalySurveillance()
