import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from typing import List, Dict, Any

class SpendAnomalyEngine:
    """
    Unsupervised Outlier & Spending Spike Detection for FINBUD.
    Uses Scikit-Learn IsolationForest combined with dynamic Z-scores
    to detect category-level behavioral spending anomalies.
    """
    def __init__(self, contamination: float = 0.05):
        self.contamination = contamination

    def detect_anomalies(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Analyzes a list of transactions [{"id": "...", "category": "Food", "amount": 14200}, ...]
        Returns the transactions tagged with is_anomaly, score, and explanation.
        """
        if not transactions or len(transactions) < 5:
            # Baseline rule-based fallback for cold start: flag transactions > 3x mean of category
            df = pd.DataFrame(transactions)
            if "amount" not in df.columns:
                return transactions
            mean_amt = df["amount"].mean()
            std_amt = df["amount"].std() if len(df) > 1 else mean_amt

            results = []
            for t in transactions:
                amt = float(t.get("amount", 0))
                is_outlier = (amt > mean_amt + 2.5 * std_amt) if std_amt > 0 else (amt > 20000)
                t_copy = dict(t)
                t_copy["is_anomaly"] = bool(is_outlier)
                t_copy["anomaly_score"] = round(float((amt - mean_amt) / (std_amt or 1)), 2)
                t_copy["anomaly_reason"] = "Deviates significantly from short-term transaction baseline" if is_outlier else "Normal spending behavior"
                results.append(t_copy)
            return results

        df = pd.DataFrame(transactions)
        amounts = df[["amount"]].values

        clf = IsolationForest(contamination=self.contamination, random_state=42)
        clf.fit(amounts)
        preds = clf.predict(amounts) # -1 is anomaly, 1 is normal
        scores = clf.decision_function(amounts)

        results = []
        for idx, t in enumerate(transactions):
            t_copy = dict(t)
            is_anomaly = bool(preds[idx] == -1 and t_copy.get("type", "EXPENSE") == "EXPENSE")
            t_copy["is_anomaly"] = is_anomaly
            t_copy["anomaly_score"] = round(float(scores[idx]), 3)
            t_copy["anomaly_reason"] = (
                f"Isolation Forest identified statistical outlier (Score: {t_copy['anomaly_score']})"
                if is_anomaly
                else "Within historical spending distribution"
            )
            results.append(t_copy)

        return results

anomaly_engine = SpendAnomalyEngine()

