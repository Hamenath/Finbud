export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  provider: string;
  timestamp: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  changePercent: string;
  isPositive: boolean;
  periodLabel: string;
  subtitle?: string;
}

export interface CashFlowDataPoint {
  month: string;
  actualIncome: number;
  actualExpense: number;
  forecastExpense: number;
  netSavings: number;
}

export interface AssetAllocationItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TransactionItem {
  id: string;
  title: string;
  account: string;
  category: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  isAnomaly?: boolean;
}

export interface FinancialGoalItem {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  percentage: number;
  targetDate: string;
  color: string;
}

export interface MetalHoldingItem {
  id: string;
  metal: 'GOLD' | 'SILVER';
  type: string; // e.g. "Physical 24K", "SGB Series IV", "Silver Bar 999"
  purity: string;
  weightGrams: number;
  purchaseRate: number;
  currentRate: number;
  currentValue: number;
  pnlPercent: number;
  isPositive: boolean;
}

export interface InsurancePolicyItem {
  id: string;
  type: 'TERM_LIFE' | 'HEALTH_INDIVIDUAL' | 'HEALTH_FAMILY';
  provider: string;
  policyNo: string;
  sumInsured: number;
  annualPremium: number;
  renewalDate: string;
  members: string;
  status: 'ACTIVE' | 'UPCOMING_RENEWAL';
}

// -------------------------------------------------------------
// DEMO DATASETS (Clearly marked as DEMO DATA per requirements)
// -------------------------------------------------------------

export const DEMO_MARKET_TICKERS: MarketTickerItem[] = [
  { symbol: 'NIFTY 50', name: 'Nifty 50', price: '₹24,148.20', change: '+0.48%', isPositive: true, provider: 'NSE / yfinance', timestamp: '16:00 IST' },
  { symbol: 'SENSEX', name: 'BSE Sensex', price: '₹79,486.32', change: '+0.42%', isPositive: true, provider: 'BSE / yfinance', timestamp: '16:00 IST' },
  { symbol: 'GOLD 24K', name: 'Gold (10g)', price: '₹77,420.00', change: '+0.65%', isPositive: true, provider: 'IBJA Ref Rate', timestamp: '16:30 IST' },
  { symbol: 'SILVER 999', name: 'Silver (1kg)', price: '₹91,200.00', change: '-0.30%', isPositive: false, provider: 'IBJA Ref Rate', timestamp: '16:30 IST' },
  { symbol: 'USD/INR', name: 'USD/INR', price: '₹84.38', change: '+0.05%', isPositive: true, provider: 'RBI Ref', timestamp: '16:00 IST' },
];

export const DEMO_OVERVIEW_METRICS = {
  netWorth: '₹0',
  netWorthRaw: 0,
  netWorthGrowth: '₹0 (0.0%)',
  monthlyIncome: '₹0',
  monthlyExpense: '₹0',
  savingsRate: '0.0%',
  benchmarkComparison: 'Ready for initial transactions',
};

export const DEMO_CASH_FLOW: CashFlowDataPoint[] = [];

export const DEMO_ASSET_ALLOCATION: AssetAllocationItem[] = [
  { category: 'Equities & Mutual Funds', amount: 0, percentage: 0, color: '#F59E0B' },
  { category: 'Precious Metals (Gold/Silver)', amount: 0, percentage: 0, color: '#10B981' },
  { category: 'Fixed Income & EPF/PPF', amount: 0, percentage: 0, color: '#3B82F6' },
  { category: 'Liquid Cash & Savings', amount: 0, percentage: 0, color: '#94A3B8' },
];

export const DEMO_TRANSACTIONS: TransactionItem[] = [];

export const DEMO_FINANCIAL_GOALS: FinancialGoalItem[] = [];

export const DEMO_METALS: MetalHoldingItem[] = [];

export const DEMO_INSURANCE_POLICIES: InsurancePolicyItem[] = [];

