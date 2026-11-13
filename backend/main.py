from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.core.config import settings
from app.ml.forecast import forecast_engine
from app.ml.anomaly import anomaly_engine
from app.services.market import market_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DailyExpenseItem(BaseModel):
    day: int
    amount: float

class ForecastRequest(BaseModel):
    daily_expenses: List[DailyExpenseItem]
    days_in_month: Optional[int] = 30

class TransactionAnomalyItem(BaseModel):
    id: Optional[str] = "tx-1"
    category: str
    amount: float
    type: Optional[str] = "EXPENSE"

class AnomalyDetectionRequest(BaseModel):
    transactions: List[TransactionAnomalyItem]

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
    """Fetch live & cached reference market tickers for equities, gold, silver, and forex."""
    return market_service.get_market_overview()

@app.post(f"{settings.API_V1_STR}/ml/forecast", tags=["Machine Learning"])
def run_forecast(req: ForecastRequest):
    """Predict month-end total expense and burn rate using Scikit-Learn Ridge Regression."""
    data = [item.dict() for item in req.daily_expenses]
    return forecast_engine.forecast_month_end(data, days_in_month=req.days_in_month or 30)

@app.post(f"{settings.API_V1_STR}/ml/anomaly-detection", tags=["Machine Learning"])
def run_anomaly_detection(req: AnomalyDetectionRequest):
    """Detect behavioral and category-level spending outliers using Isolation Forest."""
    data = [item.dict() for item in req.transactions]
    return anomaly_engine.detect_anomalies(data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
