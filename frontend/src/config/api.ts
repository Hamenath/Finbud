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
    // Strict production gate: never silently fall back to localhost in production
    throw new Error(
      '[FINBUD Production Release Gate Error]: NEXT_PUBLIC_API_BASE_URL is not configured in production environment. Localhost fallback is strictly rejected.'
    );
  }

  // Explicit local development fallback only
  return 'http://127.0.0.1:8000/api/v1';
};

export const API_BASE_URL = (() => {
  try {
    return getApiBaseUrl();
  } catch (err: any) {
    if (typeof window !== 'undefined') {
      console.error(err.message);
    }
    // Return empty string to prevent localhost leaking in production client bundles
    return '';
  }
})();

/**
 * Derives the WebSocket URL dynamically from NEXT_PUBLIC_WS_URL or API_BASE_URL:
 * - In local development: http://127.0.0.1:8000/api/v1 -> ws://127.0.0.1:8000/ws/market-ticks
 * - In production: https://[domain]/api/v1 -> wss://[domain]/ws/market-ticks
 * - Production Release Gate: Strictly rejects localhost fallback in production mode.
 */
export const getMarketWebSocketUrl = (): string => {
  const envWs = process.env.NEXT_PUBLIC_WS_URL;
  if (envWs) return envWs.replace(/\/+$/, '');

  if (API_BASE_URL) {
    try {
      const url = new URL(API_BASE_URL);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${url.host}/ws/market-ticks`;
    } catch (e) {
      // Fall through to window check
    }
  }

  if (typeof window !== 'undefined' && window.location) {
    // In production without env configured, use relative host with wss/ws
    const isHttps = window.location.protocol === 'https:';
    const isLocalhostHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (process.env.NODE_ENV === 'production' && isLocalhostHost) {
      console.warn('[FINBUD WebSocket]: Detected localhost in production environment build.');
    }
    return `${isHttps ? 'wss:' : 'ws:'}//${window.location.host}/ws/market-ticks`;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('[FINBUD Production Release Gate]: Missing production WebSocket URL configuration.');
  }

  // Development-only fallback
  return 'ws://127.0.0.1:8000/ws/market-ticks';
};

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
