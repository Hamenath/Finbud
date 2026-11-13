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
  netWorth: '₹1,24,82,900',
  netWorthRaw: 12482900,
  netWorthGrowth: '+₹1,84,500 (+1.5%)',
  monthlyIncome: '₹2,45,000',
  monthlyExpense: '₹1,32,400',
  savingsRate: '46.0%',
  benchmarkComparison: '+14.2% vs Peer Median',
};

export const DEMO_CASH_FLOW: CashFlowDataPoint[] = [
  { month: 'Jun', actualIncome: 240000, actualExpense: 145000, forecastExpense: 142000, netSavings: 95000 },
  { month: 'Jul', actualIncome: 240000, actualExpense: 138000, forecastExpense: 140000, netSavings: 102000 },
  { month: 'Aug', actualIncome: 245000, actualExpense: 152000, forecastExpense: 146000, netSavings: 93000 },
  { month: 'Sep', actualIncome: 245000, actualExpense: 128000, forecastExpense: 135000, netSavings: 117000 },
  { month: 'Oct', actualIncome: 245000, actualExpense: 139000, forecastExpense: 134000, netSavings: 106000 },
  { month: 'Nov (Est)', actualIncome: 245000, actualExpense: 132400, forecastExpense: 133500, netSavings: 112600 },
];

export const DEMO_ASSET_ALLOCATION: AssetAllocationItem[] = [
  { category: 'Equities & Mutual Funds', amount: 6740766, percentage: 54, color: '#F59E0B' }, // Amber
  { category: 'Precious Metals (Gold/Silver)', amount: 2746238, percentage: 22, color: '#10B981' }, // Emerald
  { category: 'Fixed Income & EPF/PPF', amount: 1747606, percentage: 14, color: '#3B82F6' }, // Blue
  { category: 'Liquid Cash & Savings', amount: 1248290, percentage: 10, color: '#94A3B8' }, // Slate
];

export const DEMO_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    title: 'Infosys Ltd. Monthly Salary',
    account: 'HDFC Corporate Salary A/c',
    category: 'Income',
    date: 'Today, 10:15 AM',
    amount: 245000,
    type: 'INCOME',
  },
  {
    id: 'tx-2',
    title: 'HDFC Home Loan EMI',
    account: 'HDFC Bank - NetBanking',
    category: 'EMI & Housing',
    date: 'Yesterday, 06:00 AM',
    amount: 48500,
    type: 'EXPENSE',
  },
  {
    id: 'tx-3',
    title: 'Tanishq 24K Sovereign Coin (5g)',
    account: 'UPI / ICICI Bank',
    category: 'Gold & Assets',
    date: '10 Nov 2026',
    amount: 38710,
    type: 'EXPENSE',
  },
  {
    id: 'tx-4',
    title: 'Nature Basket Gourmet Grocery',
    account: 'Axis Magnus Card',
    category: 'Food & Dining',
    date: '08 Nov 2026',
    amount: 14200,
    type: 'EXPENSE',
    isAnomaly: true, // Flagged by Anomaly Engine
  },
  {
    id: 'tx-5',
    title: 'Nippon India Small Cap SIP',
    account: 'Zerodha Coin Auto-Debit',
    category: 'Investment',
    date: '05 Nov 2026',
    amount: 25000,
    type: 'EXPENSE',
  },
  {
    id: 'tx-6',
    title: 'Bescom Electricity Bill',
    account: 'UPI Auto-Pay',
    category: 'Utilities',
    date: '03 Nov 2026',
    amount: 3420,
    type: 'EXPENSE',
  },
];

export const DEMO_FINANCIAL_GOALS: FinancialGoalItem[] = [
  {
    id: 'goal-1',
    name: 'Home Purchase Down Payment (Bangalore)',
    targetAmount: 5000000,
    savedAmount: 3900000,
    percentage: 78,
    targetDate: 'Dec 2027',
    color: '#10B981',
  },
  {
    id: 'goal-2',
    name: 'Emergency Buffer (12 Months Expenses)',
    targetAmount: 1800000,
    savedAmount: 1620000,
    percentage: 90,
    targetDate: 'Ongoing',
    color: '#F59E0B',
  },
  {
    id: 'goal-3',
    name: 'Retirement Independence Corpus (FIRE)',
    targetAmount: 50000000,
    savedAmount: 12500000,
    percentage: 25,
    targetDate: '2042',
    color: '#3B82F6',
  },
];

export const DEMO_METALS: MetalHoldingItem[] = [
  {
    id: 'm-1',
    metal: 'GOLD',
    type: 'RBI Sovereign Gold Bond (2020-21 S-VI)',
    purity: '24K (99.9%)',
    weightGrams: 35.0,
    purchaseRate: 5051,
    currentRate: 7742,
    currentValue: 270970,
    pnlPercent: 53.28,
    isPositive: true,
  },
  {
    id: 'm-2',
    metal: 'GOLD',
    type: 'Physical Hallmarked Coins (Tanishq)',
    purity: '24K (99.9%)',
    weightGrams: 20.0,
    purchaseRate: 6200,
    currentRate: 7742,
    currentValue: 154840,
    pnlPercent: 24.87,
    isPositive: true,
  },
  {
    id: 'm-3',
    metal: 'SILVER',
    type: 'Fine Silver Cast Bar (999)',
    purity: '999 Fine',
    weightGrams: 1000.0,
    purchaseRate: 74500,
    currentRate: 91200,
    currentValue: 91200,
    pnlPercent: 22.42,
    isPositive: true,
  },
];

export const DEMO_INSURANCE_POLICIES: InsurancePolicyItem[] = [
  {
    id: 'ins-1',
    type: 'TERM_LIFE',
    provider: 'HDFC Life Click 2 Protect 3D Plus',
    policyNo: 'HD-****-8821',
    sumInsured: 25000000, // 2.5 Crore (10x income standard)
    annualPremium: 22400,
    renewalDate: '18 Apr 2027',
    members: 'Self (Primary Earner)',
    status: 'ACTIVE',
  },
  {
    id: 'ins-2',
    type: 'HEALTH_FAMILY',
    provider: 'Care Supreme Comprehensive Health Floater',
    policyNo: 'CR-****-4092',
    sumInsured: 2500000, // 25 Lakh
    annualPremium: 28600,
    renewalDate: '24 Nov 2026',
    members: 'Self, Spouse, Dependent Child',
    status: 'UPCOMING_RENEWAL',
  },
];

