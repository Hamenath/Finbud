import re
from typing import List, Dict, Any, Optional
from app.rag.rag_pipeline import rag_pipeline
from app.services.market import market_service
from app.services.aggregator import financial_aggregator

class ConversationalRouter:
    """
    Intelligent Conversational Dispatcher for FINBUD Assistant.
    Routes messages BEFORE triggering the strict financial knowledge retrieval:
    - GREETING: Natural conversational welcome.
    - GENERAL CHAT / IDENTITY: Explanation of capabilities, system info.
    - LIVE MARKET: Gold, silver, Nifty quotes from market_service.
    - USER SPENDING / PERSONAL: Authenticated aggregation when available.
    - FOLLOW-UP: Re-contextualizes previous question using conversation history.
    - FINANCIAL QUESTION: Delegates to GroundedRAGPipeline.
    """

    GREETINGS = [
        "hi", "hello", "hey", "namaste", "good morning", "good evening", 
        "good afternoon", "hola", "greetings", "hi there", "hello there"
    ]

    CAPABILITY_QUERIES = [
        "what can you do", "help", "who are you", "what are you", "what is finbud",
        "tell me about finbud", "features", "how can you help", "how do you work"
    ]

    SMALL_TALK = [
        "how are you", "how are you doing", "what's up", "whats up", "how's it going",
        "hows it going", "thank you", "thanks", "ok", "okay"
    ]

    def handle_message(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        user: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        raw_text = query.strip()
        q_lower = raw_text.lower().strip("?!.,;:'\"")

        # -------------------------------------------------------------
        # 1. GREETING INTENT
        # -------------------------------------------------------------
        if q_lower in self.GREETINGS or any(q_lower == g or q_lower.startswith(g + " ") for g in self.GREETINGS):
            user_name = ""
            if user and user.get("user_metadata", {}).get("full_name"):
                user_name = f", {user['user_metadata']['full_name'].split()[0]}"
            
            return {
                "answer": f"Namaste{user_name}! How can I help you with your personal finances today? You can ask me about Indian tax provisions (80C, 80D, LTCG), SIP compounding, Sovereign Gold Bonds, insurance adequacy heuristics, or live bullion and market benchmark rates.",
                "is_out_of_scope": False,
                "citations": [],
                "retrieved_chunks_count": 0,
                "evidence_sufficient": True,
                "model": "conversational-intent-router"
            }

        # -------------------------------------------------------------
        # 2. GENERAL CHAT & SMALL TALK
        # -------------------------------------------------------------
        if any(st in q_lower for st in self.SMALL_TALK):
            if "thank" in q_lower:
                return {
                    "answer": "You're welcome! Feel free to ask if you have more questions about your wealth planning, investments, or taxes.",
                    "is_out_of_scope": False,
                    "citations": [],
                    "retrieved_chunks_count": 0,
                    "evidence_sufficient": True,
                    "model": "conversational-intent-router"
                }
            return {
                "answer": "I am doing well, thank you! As your FINBUD financial intelligence copilot, I am ready to assist you with investment math, tax planning, precious metals tracking, and cash-flow management.",
                "is_out_of_scope": False,
                "citations": [],
                "retrieved_chunks_count": 0,
                "evidence_sufficient": True,
                "model": "conversational-intent-router"
            }

        if any(cq in q_lower for cq in self.CAPABILITY_QUERIES):
            return {
                "answer": (
                    "I am FINBUD AI, an educational copilot designed for Indian personal wealth management. Here is what I can do for you:\n\n"
                    "• **Tax & Regulations**: Explain Section 80C, 80D, Section 112A/111A capital gains, and SGB tax exemptions.\n"
                    "• **Wealth Math**: Explain SIP compounding, Rupee Cost Averaging, Rule of 72, and CAGR.\n"
                    "• **Precious Metals**: Provide domestic bullion import parity rates (24K, 22K, silver) and BIS hallmarking guidelines.\n"
                    "• **Insurance Adequacy**: Explain the 10x gross annual income term insurance heuristic and family floater basics.\n"
                    "• **Cash-Flow Budgeting**: Guide you on the 50/30/20 framework and emergency reserve sizing."
                ),
                "is_out_of_scope": False,
                "citations": [
                    {
                        "title": "FINBUD Financial Curriculum",
                        "source": "AMFI, RBI, Income Tax Dept, IRDAI",
                        "section": "Core Personal Finance Framework"
                    }
                ],
                "retrieved_chunks_count": 1,
                "evidence_sufficient": True,
                "model": "conversational-intent-router"
            }

        # -------------------------------------------------------------
        # 3. LIVE MARKET / BULLION RATES INTENT
        # -------------------------------------------------------------
        if any(term in q_lower for term in ["gold price", "silver price", "gold rate", "silver rate", "today's gold", "today gold"]):
            rates = market_service.get_metal_spot_rates()
            is_gold = "gold" in q_lower
            is_silver = "silver" in q_lower and not is_gold

            if is_silver:
                ans = (
                    f"**Silver Reference Benchmark (India)**:\n\n"
                    f"• **Silver (999 Fine)**: ₹{rates['silver_per_gram']:,.2f} per gram (₹{rates['silver_per_gram'] * 1000:,.2f} per kg)\n"
                    f"• **Pricing Basis**: {rates['provider']} with statutory 15% customs duty and 3% IGST (1.1845 import parity multiplier).\n"
                    f"• **Timestamp**: {rates['timestamp']}\n\n"
                    f"*Note: Excludes local jeweller making charges (8%-25%) and retail store markups.*"
                )
            else:
                ans = (
                    f"**Gold Reference Benchmark (India)**:\n\n"
                    f"• **Gold 24K (99.9% fine)**: ₹{rates['gold_24k_per_gram']:,.2f} per gram (₹{rates['gold_24k_per_gram'] * 10:,.2f} per 10g)\n"
                    f"• **Gold 22K (Standard Jewellery)**: ₹{rates['gold_22k_per_gram']:,.2f} per gram\n"
                    f"• **Gold 18K (Studded Jewellery)**: ₹{rates['gold_18k_per_gram']:,.2f} per gram\n"
                    f"• **Pricing Basis**: {rates['provider']} (Derived from {rates['base_instrument']} via Interbank FX with 15% duty & 3% IGST).\n"
                    f"• **Timestamp**: {rates['timestamp']}\n\n"
                    f"*Note: Estimated wholesale import parity. Excludes local making charges and retail premiums.*"
                )

            return {
                "answer": ans,
                "is_out_of_scope": False,
                "citations": [
                    {
                        "title": "Domestic Bullion Reference Benchmark",
                        "source": rates["provider"],
                        "section": f"Import Parity Tariff Basis ({rates.get('customs_duty_rate', '15% Duty')})"
                    }
                ],
                "retrieved_chunks_count": 1,
                "evidence_sufficient": True,
                "model": "market-data-service"
            }

        # -------------------------------------------------------------
        # 4. PERSONAL FINANCIAL QUESTIONS (AUTHENTICATED DATA)
        # -------------------------------------------------------------
        if any(term in q_lower for term in ["how much did i spend", "my spend", "my expense", "my savings rate", "my net worth", "my balance"]):
            if not user or not user.get("id"):
                return {
                    "answer": "To view your personal spending, savings rate, and financial summaries, please sign in to your verified FINBUD account. Once authenticated, your metrics are securely calculated from your private Supabase ledger.",
                    "is_out_of_scope": False,
                    "citations": [],
                    "retrieved_chunks_count": 0,
                    "evidence_sufficient": True,
                    "model": "auth-prompt-guardrail"
                }

            user_finances = financial_aggregator.aggregate_user_finances(
                user_id=user["id"],
                user_email=user.get("email", "investor@finbud.ai")
            )

            ans = (
                f"**Your Personal Financial Summary (November 2026)**:\n\n"
                f"• **Total Recorded Inflows**: ₹{user_finances['total_income']:,.2f}\n"
                f"• **Total Monthly Expenses**: ₹{user_finances['total_expenses']:,.2f}\n"
                f"• **Net Savings Surplus**: ₹{user_finances['net_savings']:,.2f}\n"
                f"• **Current Savings Rate**: {user_finances['savings_rate']}%\n"
                f"• **Estimated Net Worth**: ₹{user_finances['net_worth']:,.2f}\n\n"
                f"*(Derived securely from your private Supabase ledger with Row-Level Security)*"
            )

            return {
                "answer": ans,
                "is_out_of_scope": False,
                "citations": [
                    {
                        "title": "Private Ledger Aggregation",
                        "source": "Supabase PostgreSQL Database",
                        "section": f"Authenticated User ID: {user['id'][:8]}..."
                    }
                ],
                "retrieved_chunks_count": 1,
                "evidence_sufficient": True,
                "model": "personal-financial-aggregator"
            }

        # -------------------------------------------------------------
        # 5. FOLLOW-UP QUESTIONS (CONTEXT RESOLUTION)
        # -------------------------------------------------------------
        effective_query = query
        follow_up_triggers = ["explain more", "give me an example", "why?", "tell me more", "what about its benefits", "what about benefits", "more details", "elaborate"]
        
        if any(q_lower == f or q_lower.startswith(f + " ") for f in follow_up_triggers):
            if conversation_history:
                # Find the most recent user question that wasn't a generic follow-up
                for turn in reversed(conversation_history):
                    prev_text = turn.get("content") or turn.get("text") or ""
                    prev_lower = prev_text.lower()
                    if turn.get("role") == "user" and not any(f in prev_lower for f in follow_up_triggers) and len(prev_text) > 5:
                        effective_query = f"{prev_text} - In-depth breakdown and practical illustrative example"
                        break

        # -------------------------------------------------------------
        # 6. FINANCIAL DOMAIN QUESTION (RAG RETRIEVAL)
        # -------------------------------------------------------------
        rag_res = rag_pipeline.answer_query(
            query=effective_query,
            conversation_history=conversation_history
        )

        return rag_res

conversational_router = ConversationalRouter()

