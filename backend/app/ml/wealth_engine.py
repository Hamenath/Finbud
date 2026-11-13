import numpy as np
from typing import Dict, Any, List

class WealthMultiplierEngine:
    """
    Mathematical Financial Calculators & Monte Carlo Simulator for FINBUD.
    All formulas adhere strictly to standard compounding, annuity, and stochastic calculus:
    
    1. Lump Sum Compounding: FV_lump = P * (1 + r)^t
    2. SIP Future Value (Annuity with monthly compounding):
       FV_sip = PMT * [((1 + i)^n - 1) / i] * (1 + i)
       where i = r / 12, n = t * 12
    3. CAGR: (FV / PV)^(1 / t) - 1
    4. Rule of 72: Doubling Time ≈ 72 / r
    5. Real (Inflation-Adjusted) Future Value: FV_real = FV_nominal / (1 + inf)^t
    6. Monte Carlo Simulation: Log-normal asset returns with annual volatility sigma.
    """

    @staticmethod
    def calculate_compound_wealth(
        initial_investment: float,
        monthly_sip: float,
        annual_rate_pct: float,
        years: int,
        inflation_rate_pct: float = 6.0
    ) -> Dict[str, Any]:
        r = annual_rate_pct / 100.0
        inf = inflation_rate_pct / 100.0
        n_months = years * 12

        # 1. Edge Case: 0% return
        if r == 0:
            fv_lump = initial_investment
            fv_sip = monthly_sip * n_months
        else:
            # Lump sum compounding annually
            fv_lump = initial_investment * ((1.0 + r) ** years)
            
            # Monthly SIP annuity compounding monthly at rate i
            i = r / 12.0
            fv_sip = monthly_sip * (((1.0 + i) ** n_months - 1.0) / i) * (1.0 + i)

        nominal_future_value = fv_lump + fv_sip
        total_invested = initial_investment + (monthly_sip * n_months)
        total_wealth_gain = max(nominal_future_value - total_invested, 0.0)

        # Real (Inflation-adjusted) value
        real_future_value = nominal_future_value / ((1.0 + inf) ** years) if inf > 0 else nominal_future_value
        purchasing_power_loss = max(nominal_future_value - real_future_value, 0.0)

        # Rule of 72 Doubling Time
        doubling_years = round(72.0 / annual_rate_pct, 1) if annual_rate_pct > 0 else None

        # Year-by-year trajectory
        trajectory = []
        cur_lump = initial_investment
        cur_invested = initial_investment

        for y in range(0, years + 1):
            if y == 0:
                y_nominal = initial_investment
                y_real = initial_investment
                y_invested = initial_investment
            else:
                m_count = y * 12
                if r == 0:
                    y_lump = initial_investment
                    y_sip = monthly_sip * m_count
                else:
                    i = r / 12.0
                    y_lump = initial_investment * ((1.0 + r) ** y)
                    y_sip = monthly_sip * (((1.0 + i) ** m_count - 1.0) / i) * (1.0 + i)
                y_nominal = y_lump + y_sip
                y_invested = initial_investment + (monthly_sip * m_count)
                y_real = y_nominal / ((1.0 + inf) ** y) if inf > 0 else y_nominal

            trajectory.append({
                "year": f"Yr {y}",
                "invested_capital": round(y_invested, 2),
                "nominal_wealth": round(y_nominal, 2),
                "real_wealth_inflation_adjusted": round(y_real, 2),
            })

        return {
            "initial_investment": round(initial_investment, 2),
            "monthly_sip": round(monthly_sip, 2),
            "annual_rate_pct": annual_rate_pct,
            "years": years,
            "inflation_rate_pct": inflation_rate_pct,
            "total_invested_principal": round(total_invested, 2),
            "nominal_future_value": round(nominal_future_value, 2),
            "total_wealth_gain": round(total_wealth_gain, 2),
            "real_future_value_in_todays_rupees": round(real_future_value, 2),
            "purchasing_power_loss": round(purchasing_power_loss, 2),
            "rule_of_72_doubling_years": doubling_years,
            "annual_trajectory": trajectory
        }

    @staticmethod
    def calculate_cagr(present_value: float, future_value: float, years: float) -> Dict[str, Any]:
        """Calculates Compound Annual Growth Rate: CAGR = (FV / PV)^(1 / t) - 1"""
        if present_value <= 0 or future_value <= 0 or years <= 0:
            return {"cagr_percent": 0.0, "valid": False, "message": "PV, FV, and Years must be positive non-zero numbers."}
        
        cagr = ((future_value / present_value) ** (1.0 / years)) - 1.0
        return {
            "present_value": round(present_value, 2),
            "future_value": round(future_value, 2),
            "years": years,
            "cagr_percent": round(cagr * 100.0, 2),
            "valid": True
        }

    @staticmethod
    def run_monte_carlo(
        initial_investment: float,
        monthly_sip: float,
        mean_annual_return_pct: float,
        annual_volatility_pct: float = 15.0,
        years: int = 15,
        num_simulations: int = 1000,
        seed: int = 42
    ) -> Dict[str, Any]:
        """
        Runs a reproducible Monte Carlo geometric Brownian motion simulation
        for an Indian equity/multi-asset portfolio with monthly SIP injections.
        """
        np.random.seed(seed)
        mu = mean_annual_return_pct / 100.0
        sigma = annual_volatility_pct / 100.0
        n_months = years * 12
        dt = 1.0 / 12.0

        # Matrix of simulated portfolio values: shape = (num_simulations, n_months + 1)
        simulations = np.zeros((num_simulations, n_months + 1))
        simulations[:, 0] = initial_investment

        # Simulate monthly steps
        for m in range(1, n_months + 1):
            # Normal shock
            z = np.random.normal(0, 1, num_simulations)
            # Monthly return factor
            monthly_return = np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z)
            # Apply return to previous balance and add monthly SIP
            simulations[:, m] = (simulations[:, m - 1] * monthly_return) + monthly_sip

        # Extract percentile outcomes at year intervals
        trajectory = []
        for y in range(0, years + 1):
            month_idx = y * 12
            vals_at_y = simulations[:, month_idx]
            trajectory.append({
                "year": f"Yr {y}",
                "conservative_p10": round(float(np.percentile(vals_at_y, 10)), 2),
                "median_p50": round(float(np.percentile(vals_at_y, 50)), 2),
                "optimistic_p90": round(float(np.percentile(vals_at_y, 90)), 2),
                "capital_invested": round(initial_investment + (monthly_sip * month_idx), 2)
            })

        final_outcomes = simulations[:, -1]

        return {
            "num_simulations": num_simulations,
            "seed": seed,
            "mean_annual_return_pct": mean_annual_return_pct,
            "annual_volatility_pct": annual_volatility_pct,
            "years": years,
            "conservative_outcome_p10": round(float(np.percentile(final_outcomes, 10)), 2),
            "median_outcome_p50": round(float(np.percentile(final_outcomes, 50)), 2),
            "optimistic_outcome_p90": round(float(np.percentile(final_outcomes, 90)), 2),
            "probability_of_capital_preservation_pct": round(float(np.mean(final_outcomes >= (initial_investment + monthly_sip * n_months))) * 100.0, 1),
            "trajectory": trajectory,
            "disclaimer": "Hypothetical stochastic simulation for educational illustration. Past market volatility does not guarantee future results."
        }

wealth_engine = WealthMultiplierEngine()

