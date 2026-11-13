# FINBUD Database Documentation

## 1. Schema Overview

The database is deployed on **Supabase PostgreSQL** with full **Row-Level Security (RLS)**.

```mermaid
erDiagram
    PROFILES ||--o{ TRANSACTIONS : owns
    PROFILES ||--o{ METAL_HOLDINGS : owns
    PROFILES ||--o{ INSURANCE_POLICIES : owns
    PROFILES ||--o{ FINANCIAL_GOALS : owns

    PROFILES {
        uuid id PK
        text email UK
        text full_name
        numeric monthly_income_target
        text risk_profile
        timestamp created_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        numeric amount
        text type
        varchar category
        date transaction_date
        text notes
        varchar payment_method
        boolean is_anomaly
    }

    METAL_HOLDINGS {
        uuid id PK
        uuid user_id FK
        text metal_type
        text holding_type
        numeric purity_karat
        numeric weight_grams
        numeric purchase_price_per_gram
        date purchase_date
    }

    INSURANCE_POLICIES {
        uuid id PK
        uuid user_id FK
        text policy_type
        varchar provider_name
        varchar policy_number_masked
        numeric sum_insured
        numeric premium_annual
        date renewal_date
        text covered_members
    }
```

## 2. Row-Level Security Rules

Every table containing user data implements:
```sql
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);
```

This guarantees multi-tenant data isolation at the PostgreSQL storage engine level.

