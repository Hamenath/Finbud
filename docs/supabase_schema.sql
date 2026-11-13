-- ==============================================================================
-- FINBUD PRODUCTION POSTGRESQL SCHEMA (Supabase SQL Editor Ready)
-- Full Multi-Asset Personal Wealth Management & Financial Decision Support
-- Author: Team Alpha Beta Gamma (Diwakar K, Hamenath B, Kisshorekumar S)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS (Safe creation)
DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type_enum AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE metal_type_enum AS ENUM ('GOLD', 'SILVER');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE metal_holding_type_enum AS ENUM ('PHYSICAL_JEWELRY', 'PHYSICAL_COIN_BAR', 'DIGITAL_GOLD', 'SGB');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE policy_type_enum AS ENUM ('TERM_LIFE', 'HEALTH_INDIVIDUAL', 'HEALTH_FAMILY_FLOATER', 'CRITICAL_ILLNESS');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE goal_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked directly to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    monthly_income_target NUMERIC(12, 2) DEFAULT 0.00,
    risk_profile risk_level_enum DEFAULT 'MODERATE',
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TRANSACTIONS & CASH FLOW TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type transaction_type_enum NOT NULL,
    category VARCHAR(64) NOT NULL,
    subcategory VARCHAR(64),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(32) DEFAULT 'UPI',
    is_anomaly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(user_id, category);

-- 5. PRECIOUS METALS VAULT (Gold & Silver)
CREATE TABLE IF NOT EXISTS public.metal_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metal_type metal_type_enum NOT NULL,
    holding_type metal_holding_type_enum NOT NULL,
    purity_karat NUMERIC(4, 1) NOT NULL,
    weight_grams NUMERIC(10, 3) NOT NULL CHECK (weight_grams > 0),
    purchase_price_per_gram NUMERIC(10, 2) NOT NULL CHECK (purchase_price_per_gram > 0),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    storage_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_metals_user ON public.metal_holdings(user_id);

-- 6. SMART INSURANCE SHIELD (Term Life & Health Policies)
CREATE TABLE IF NOT EXISTS public.insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    policy_type policy_type_enum NOT NULL,
    provider_name VARCHAR(128) NOT NULL,
    policy_number_masked VARCHAR(64) NOT NULL,
    sum_insured NUMERIC(12, 2) NOT NULL CHECK (sum_insured > 0),
    premium_annual NUMERIC(10, 2) NOT NULL CHECK (premium_annual >= 0),
    renewal_date DATE NOT NULL,
    covered_members TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_insurance_user ON public.insurance_policies(user_id);

-- 7. FINANCIAL GOALS (Milestones)
CREATE TABLE IF NOT EXISTS public.financial_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_name VARCHAR(128) NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(12, 2) DEFAULT 0.00 CHECK (current_amount >= 0),
    target_date DATE NOT NULL,
    priority goal_priority_enum DEFAULT 'MEDIUM',
    category VARCHAR(64) DEFAULT 'WEALTH_CREATION',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_goals_user ON public.financial_goals(user_id);

-- 8. MARKET DATA CACHE (Equities, Indices & Metals)
CREATE TABLE IF NOT EXISTS public.market_price_cache (
    symbol VARCHAR(32) PRIMARY KEY,
    asset_name VARCHAR(128) NOT NULL,
    price_inr NUMERIC(12, 2) NOT NULL,
    change_24h_percent NUMERIC(6, 2) DEFAULT 0.00,
    high_24h NUMERIC(12, 2),
    low_24h NUMERIC(12, 2),
    sma_20 NUMERIC(12, 2),
    ema_50 NUMERIC(12, 2),
    source_provider VARCHAR(64) NOT NULL,
    is_live BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enforce strict data isolation: Each user only accesses their own records.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metal_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_price_cache ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Transactions Policies
DROP POLICY IF EXISTS "Users can manage own transactions" ON public.transactions;
CREATE POLICY "Users can manage own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

-- Metal Holdings Policies
DROP POLICY IF EXISTS "Users can manage own metal holdings" ON public.metal_holdings;
CREATE POLICY "Users can manage own metal holdings" ON public.metal_holdings
    FOR ALL USING (auth.uid() = user_id);

-- Insurance Policies
DROP POLICY IF EXISTS "Users can manage own insurance policies" ON public.insurance_policies;
CREATE POLICY "Users can manage own insurance policies" ON public.insurance_policies
    FOR ALL USING (auth.uid() = user_id);

-- Financial Goals
DROP POLICY IF EXISTS "Users can manage own financial goals" ON public.financial_goals;
CREATE POLICY "Users can manage own financial goals" ON public.financial_goals
    FOR ALL USING (auth.uid() = user_id);

-- Market Price Cache (Public/Authenticated Read Only)
DROP POLICY IF EXISTS "Anyone can read market price cache" ON public.market_price_cache;
CREATE POLICY "Anyone can read market price cache" ON public.market_price_cache
    FOR SELECT USING (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, monthly_income_target)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Finbud Member'),
        COALESCE((new.raw_user_meta_data->>'monthly_income_target')::numeric, 50000.00)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
