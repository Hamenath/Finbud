/**
 * FINBUD Centralized API Configuration
 * Supports NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_API_URL fallback).
 * Defaults to http://127.0.0.1:8000/api/v1 for local development,
 * but dynamically reads the production hosted backend URL from environment variables.
 */

const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    // Strip trailing slashes
    return envUrl.replace(/\/+$/, '');
  }
  
  if (process.env.NODE_ENV === 'production') {
    // In production without an environment variable, throw or log a clear warning
    console.warn('[FINBUD Configuration Warning]: NEXT_PUBLIC_API_BASE_URL is not configured in production environment.');
  }

  // Safe development fallback
  return 'http://127.0.0.1:8000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // RAG & Conversational Assistant
  ragAsk: `${API_BASE_URL}/rag/ask`,
  ragEvaluate: `${API_BASE_URL}/rag/evaluate`,

  // Market & Bullion
  marketSpot: `${API_BASE_URL}/market/metals/spot`,
  marketHistory: (metal: string, period: string) =>
    `${API_BASE_URL}/market/metals/history?metal=${encodeURIComponent(metal)}&period=${encodeURIComponent(period)}`,
  marketTickers: `${API_BASE_URL}/market/tickers`,

  // Wealth Lab
  wealthCompound: `${API_BASE_URL}/wealth/compound`,
  wealthCagr: `${API_BASE_URL}/wealth/cagr`,
  wealthMonteCarlo: `${API_BASE_URL}/wealth/monte-carlo`,

  // Predictive ML & Anomalies
  predictCashflow: `${API_BASE_URL}/ml/predict-cashflow`,
  categoryAnomalies: `${API_BASE_URL}/ml/category-anomalies`,
  evaluateModel: (months: number = 6) => `${API_BASE_URL}/ml/evaluate-model?months=${months}`,

  // Reports
  scorecardPdf: (period: string) =>
    `${API_BASE_URL}/reports/scorecard-pdf?period=${encodeURIComponent(period)}`,
};
