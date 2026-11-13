from fastapi import FastAPI, Depends, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.core.config import settings
from app.ml.forecast import forecast_engine
from app.ml.anomaly import anomaly_engine
from app.ml.predictive_engine import predictive_engine
from app.ml.anomaly_surveillance import category_anomaly_service
from app.ml.synthetic import generate_synthetic_transactions
from app.ml.wealth_engine import wealth_engine
from app.services.market import market_service
from app.services.report_generator import pdf_report_generator
from app.rag.rag_pipeline import rag_pipeline
from app.rag.evaluator import run_rag_evaluation

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models -----------------
class CompoundCalcRequest(BaseModel):
    initial_investment: float = 500000.0
    monthly_sip: float = 25000.0
    annual_rate_pct: float = 12.0
    years: int = 15
    inflation_rate_pct: Optional[float] = 6.0

class CagrCalcRequest(BaseModel):
    present_value: float
    future_value: float
    years: float

class MonteCarloRequest(BaseModel):
    initial_investment: float = 500000.0
    monthly_sip: float = 25000.0
    mean_annual_return_pct: float = 12.0
    annual_volatility_pct: Optional[float] = 15.0
    years: int = 15
    num_simulations: Optional[int] = 1000
    seed: Optional[int] = 42

class UserCashflowForecastRequest(BaseModel):
    transactions: List[Dict[str, Any]]
    monthly_income_target: Optional[float] = 75000.0
    days_in_month: Optional[int] = 30

class UserAnomalyRequest(BaseModel):
    current_transactions: List[Dict[str, Any]]
    historical_transactions: Optional[List[Dict[str, Any]]] = None

class RAGQueryRequest(BaseModel):
    query: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class ScorecardReportRequest(BaseModel):
    user_email: Optional[str] = "investor@finbud.ai"
    period: Optional[str] = "November 2026"
    total_income: float
    total_expenses: float
    net_savings: float
    savings_rate: float
    net_worth: Optional[float] = 0.0
    category_spending: List[Dict[str, Any]] = []
    gold_grams: Optional[float] = 0.0
    silver_grams: Optional[float] = 0.0
    metals_valuation: Optional[float] = 0.0
    term_insurance_cover: Optional[float] = 0.0
    ml_projected_month_end_burn: Optional[float] = None
    ml_projected_month_end_savings: Optional[float] = None
    detected_anomalies_count: Optional[int] = 0
    is_demo: Optional[bool] = False

# ----------------- Endpoints -----------------
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }

@app.get(f"{settings.API_V1_STR}/market/tickers", tags=["Market Data"])
def get_market_tickers():
    return market_service.get_market_overview()

@app.get(f"{settings.API_V1_STR}/market/metals/spot", tags=["Precious Metals"])
def get_metal_spot_rates():
    """Returns verified reference spot rates for Gold (24K, 22K, 18K) and Silver in INR per gram."""
    return market_service.get_metal_spot_rates()

@app.get(f"{settings.API_V1_STR}/market/metals/history", tags=["Precious Metals"])
def get_metal_history(metal: str = Query("GOLD", pattern="^(GOLD|SILVER)$"), period: str = "3mo"):
    """Returns historical daily close prices with educational 20-day SMA and EMA indicators."""
    return market_service.get_metal_historical_chart(metal=metal, period=period)

@app.post(f"{settings.API_V1_STR}/rag/ask", tags=["RAG Financial Assistant"])
def ask_rag_assistant(req: RAGQueryRequest):
    """Answers financial questions grounded in verified curated knowledge base with source citations."""
    return rag_pipeline.answer_query(
        query=req.query,
        conversation_history=req.conversation_history
    )

@app.get(f"{settings.API_V1_STR}/rag/evaluate", tags=["RAG Financial Assistant"])
def evaluate_rag_assistant():
    """Runs automated benchmark evaluation on retrieval relevance, answer faithfulness and citation coverage."""
    return run_rag_evaluation()

@app.post(f"{settings.API_V1_STR}/reports/scorecard-pdf", tags=["Reports"])
def generate_pdf_scorecard(req: ScorecardReportRequest):
    """Generates an audit-ready downloadable PDF financial health scorecard."""
    pdf_bytes = pdf_report_generator.generate_scorecard_pdf(req.model_dump())
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=FINBUD_Financial_Scorecard_{req.period.replace(' ', '_')}.pdf"
        }
    )

@app.post(f"{settings.API_V1_STR}/wealth/compound", tags=["Wealth Multiplier Lab"])
def calculate_compound(req: CompoundCalcRequest):
    """Calculates Lump Sum + SIP growth, Rule of 72, and real inflation-adjusted values."""
    return wealth_engine.calculate_compound_wealth(
        initial_investment=req.initial_investment,
        monthly_sip=req.monthly_sip,
        annual_rate_pct=req.annual_rate_pct,
        years=req.years,
        inflation_rate_pct=req.inflation_rate_pct or 6.0
    )

@app.post(f"{settings.API_V1_STR}/wealth/cagr", tags=["Wealth Multiplier Lab"])
def calculate_cagr_route(req: CagrCalcRequest):
    """Calculates historical or target Compound Annual Growth Rate."""
    return wealth_engine.calculate_cagr(
        present_value=req.present_value,
        future_value=req.future_value,
        years=req.years
    )

@app.post(f"{settings.API_V1_STR}/wealth/monte-carlo", tags=["Wealth Multiplier Lab"])
def run_monte_carlo_route(req: MonteCarloRequest):
    """Runs a 1,000-run Monte Carlo probability distribution simulation."""
    return wealth_engine.run_monte_carlo(
        initial_investment=req.initial_investment,
        monthly_sip=req.monthly_sip,
        mean_annual_return_pct=req.mean_annual_return_pct,
        annual_volatility_pct=req.annual_volatility_pct or 15.0,
        years=req.years,
        num_simulations=req.num_simulations or 1000,
        seed=req.seed or 42
    )

@app.post(f"{settings.API_V1_STR}/ml/predict-cashflow", tags=["Predictive Expense Engine"])
def predict_user_cashflow(req: UserCashflowForecastRequest):
    return predictive_engine.forecast_user_cashflow(
        transactions=req.transactions,
        monthly_income_target=req.monthly_income_target or 75000.0,
        days_in_month=req.days_in_month or 30
    )

@app.post(f"{settings.API_V1_STR}/ml/category-anomalies", tags=["Predictive Expense Engine"])
def detect_category_anomalies(req: UserAnomalyRequest):
    return category_anomaly_service.analyze_category_anomalies(
        current_transactions=req.current_transactions,
        historical_transactions=req.historical_transactions
    )

@app.get(f"{settings.API_V1_STR}/ml/evaluate-model", tags=["Predictive Expense Engine"])
def evaluate_ml_model(months: int = 6):
    synthetic_df = generate_synthetic_transactions(seed=42, months=months)
    df_exp = synthetic_df[synthetic_df["type"] == "EXPENSE"].copy()
    eval_results = predictive_engine.evaluate_model_on_history(df_exp)
    eval_results["dataset_summary"] = {
        "total_synthetic_records": len(synthetic_df),
        "expense_records_count": len(df_exp),
        "injected_anomalies_count": int(synthetic_df["is_ground_truth_anomaly"].sum()),
        "time_range_months": months,
        "data_isolation": "Strictly tagged as synthetic academic demonstration data"
    }
    return eval_results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
