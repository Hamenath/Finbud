import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Any, List

def generate_synthetic_transactions(seed: int = 42, months: int = 6) -> pd.DataFrame:
    """
    Generates a realistic, reproducible synthetic personal financial dataset
    for academic evaluation and model testing, modeling typical Indian salaried cash flow.
    Includes normal recurring transactions and intentional category spending spikes (anomalies).
    """
    np.random.seed(seed)
    records = []
    
    # Base date: 6 months ago up to today (Nov 2026)
    end_date = datetime(2026, 11, 13)
    start_date = end_date - timedelta(days=months * 30)
    
    current_date = start_date
    while current_date <= end_date:
        year = current_date.year
        month = current_date.month
        day = current_date.day
        
        # 1. Salary Inflow on the 1st of every month
        if day == 1:
            records.append({
                "transaction_date": current_date.strftime("%Y-%m-%d"),
                "month": f"{year}-{month:02d}",
                "day_of_month": day,
                "category": "Salary & Bonus",
                "notes": "Infosys Corporate Salary Credit",
                "amount": float(np.random.normal(75000, 1000)),
                "type": "INCOME",
                "is_synthetic": True,
                "is_ground_truth_anomaly": False
            })
            
            # Rent & Housing EMI on 3rd of month
            records.append({
                "transaction_date": (current_date + timedelta(days=2)).strftime("%Y-%m-%d"),
                "month": f"{year}-{month:02d}",
                "day_of_month": 3,
                "category": "Housing & Rent",
                "notes": "HDFC Home Loan EMI / House Rent",
                "amount": float(22000.0),
                "type": "EXPENSE",
                "is_synthetic": True,
                "is_ground_truth_anomaly": False
            })
            
            # Monthly SIP on 5th of month
            records.append({
                "transaction_date": (current_date + timedelta(days=4)).strftime("%Y-%m-%d"),
                "month": f"{year}-{month:02d}",
                "day_of_month": 5,
                "category": "Investment / SIP",
                "notes": "Nippon India / Parag Parikh Flexi Cap SIP",
                "amount": float(15000.0),
                "type": "EXPENSE",
                "is_synthetic": True,
                "is_ground_truth_anomaly": False
            })
            
            # Utilities on 8th of month
            records.append({
                "transaction_date": (current_date + timedelta(days=7)).strftime("%Y-%m-%d"),
                "month": f"{year}-{month:02d}",
                "day_of_month": 8,
                "category": "Utilities & Bills",
                "notes": "Electricity, Water, Wi-Fi",
                "amount": float(np.random.normal(4500, 300)),
                "type": "EXPENSE",
                "is_synthetic": True,
                "is_ground_truth_anomaly": False
            })
            
        # 2. Daily Living Expenses (Groceries, Dining, Commute)
        # Random daily transactions with 60% probability
        if np.random.rand() > 0.4:
            cat = np.random.choice(["Food & Dining", "Travel & Transport", "Shopping & Discretionary"], p=[0.6, 0.25, 0.15])
            if cat == "Food & Dining":
                base_amt = float(np.random.normal(450, 120))
            elif cat == "Travel & Transport":
                base_amt = float(np.random.normal(250, 60))
            else:
                base_amt = float(np.random.normal(1200, 300))
                
            records.append({
                "transaction_date": current_date.strftime("%Y-%m-%d"),
                "month": f"{year}-{month:02d}",
                "day_of_month": day,
                "category": cat,
                "notes": f"Regular {cat} purchase",
                "amount": max(round(base_amt, 2), 50.0),
                "type": "EXPENSE",
                "is_synthetic": True,
                "is_ground_truth_anomaly": False
            })

        current_date += timedelta(days=1)
        
    df = pd.DataFrame(records)
    
    # 3. Inject explicit, labeled ground-truth anomalies to test anomaly precision & recall
    # Inject 3 spikes in historical data
    indices_to_spike = [len(df) // 4, len(df) // 2, int(len(df) * 0.85)]
    for idx in indices_to_spike:
        if idx < len(df):
            df.loc[idx, "amount"] = 28500.0
            df.loc[idx, "category"] = "Food & Dining"
            df.loc[idx, "notes"] = "Unusual Luxury Feast & High-End Catering (Injected Anomaly)"
            df.loc[idx, "is_ground_truth_anomaly"] = True
            
    return df

