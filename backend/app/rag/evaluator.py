from typing import List, Dict, Any
from app.rag.rag_pipeline import rag_pipeline

# 30 Comprehensive Test Questions across All Core Curriculum Topics
EVALUATION_DATASET_30 = [
    # Topic 1: Taxation & Exemptions (Income Tax Act)
    {
        "query": "What are the tax benefits of Sovereign Gold Bonds (SGB) compared to physical gold?",
        "expected_topics": ["sgb", "capital gains", "8 years"],
        "category": "Taxation"
    },
    {
        "query": "What is the maximum investment deduction limit under Section 80C?",
        "expected_topics": ["80c", "1,50,000"],
        "category": "Taxation"
    },
    {
        "query": "What is the deduction limit for health insurance premiums under Section 80D for senior citizens?",
        "expected_topics": ["80d", "50,000", "parents"],
        "category": "Taxation"
    },
    {
        "query": "What is the Long-Term Capital Gains (LTCG) tax exemption limit on listed equity shares under Section 112A?",
        "expected_topics": ["112a", "1,25,000", "12.5%"],
        "category": "Taxation"
    },
    {
        "query": "What is the Short-Term Capital Gains (STCG) tax rate on listed equity shares under Section 111A?",
        "expected_topics": ["111a", "20%"],
        "category": "Taxation"
    },
    {
        "query": "Are interest payouts from Sovereign Gold Bonds taxable in India?",
        "expected_topics": ["2.5%", "slab", "taxable"],
        "category": "Taxation"
    },

    # Topic 2: Systematic Investment Plans (SIP) & Compounding Math
    {
        "query": "How does the Rule of 72 calculate investment doubling time?",
        "expected_topics": ["72", "rate", "doubling"],
        "category": "SIP & Compounding"
    },
    {
        "query": "How does Rupee Cost Averaging work during stock market downturns?",
        "expected_topics": ["rupee cost", "units", "nav"],
        "category": "SIP & Compounding"
    },
    {
        "query": "What is the difference between nominal returns and real inflation-adjusted returns?",
        "expected_topics": ["nominal", "inflation", "purchasing power"],
        "category": "SIP & Compounding"
    },
    {
        "query": "How is Compound Annual Growth Rate (CAGR) calculated?",
        "expected_topics": ["cagr", "beginning", "ending"],
        "category": "SIP & Compounding"
    },
    {
        "query": "Why does compounding frequency matter in annual versus monthly returns?",
        "expected_topics": ["compounding", "frequency", "exponential"],
        "category": "SIP & Compounding"
    },
    {
        "query": "What is an index fund and how does it relate to long-term passive investing?",
        "expected_topics": ["index", "nifty", "passive"],
        "category": "SIP & Compounding"
    },

    # Topic 3: Precious Metals (Gold, Silver, SGB)
    {
        "query": "What is the purity percentage of 22 Karat gold compared to 24 Karat gold?",
        "expected_topics": ["91.6%", "22/24", "99.9%"],
        "category": "Precious Metals"
    },
    {
        "query": "What is Bureau of Indian Standards (BIS) Hallmarking for gold jewellery?",
        "expected_topics": ["bis", "hallmarking", "huid"],
        "category": "Precious Metals"
    },
    {
        "query": "How does digital gold differ from Sovereign Gold Bonds in terms of credit risk?",
        "expected_topics": ["digital gold", "sovereign", "rbi", "fintech"],
        "category": "Precious Metals"
    },
    {
        "query": "What are the storage risks associated with physical bullion coins and jewellery?",
        "expected_topics": ["locker", "theft", "making charges"],
        "category": "Precious Metals"
    },
    {
        "query": "What is the statutory tenure and lock-in period of Sovereign Gold Bonds?",
        "expected_topics": ["8 years", "5th year", "premature"],
        "category": "Precious Metals"
    },
    {
        "query": "What is the typical weight measurement unit for retail gold transactions in India?",
        "expected_topics": ["grams", "10 grams", "tola"],
        "category": "Precious Metals"
    },

    # Topic 4: Insurance Fundamentals & Coverage Heuristics
    {
        "query": "Explain the 10x annual income heuristic for term insurance coverage",
        "expected_topics": ["10x", "term", "income", "liabilities"],
        "category": "Insurance"
    },
    {
        "query": "Why is pure term life insurance preferred over endowment or ULIP policies for risk coverage?",
        "expected_topics": ["term", "endowment", "pure risk", "returns"],
        "category": "Insurance"
    },
    {
        "query": "What is the difference between an individual health insurance policy and a family floater?",
        "expected_topics": ["family floater", "individual", "sum insured"],
        "category": "Insurance"
    },
    {
        "query": "What does a pre-existing disease (PED) waiting period mean in Indian health insurance?",
        "expected_topics": ["waiting period", "ped", "36 months"],
        "category": "Insurance"
    },
    {
        "query": "What is co-payment in health insurance policies?",
        "expected_topics": ["co-pay", "percentage", "claim"],
        "category": "Insurance"
    },
    {
        "query": "How do outstanding home loans influence term insurance coverage requirements?",
        "expected_topics": ["liabilities", "loans", "survivors"],
        "category": "Insurance"
    },

    # Topic 5: Budgeting, Cash-Flow & Emergency Reserve Rules
    {
        "query": "How is the 50/30/20 budgeting rule divided?",
        "expected_topics": ["50%", "needs", "30%", "wants", "20%"],
        "category": "Budgeting"
    },
    {
        "query": "How many months of mandatory living expenses should be kept in an emergency fund?",
        "expected_topics": ["3 to 6 months", "emergency fund", "liquid"],
        "category": "Budgeting"
    },
    {
        "query": "Where should an emergency reserve fund be safely parked in India?",
        "expected_topics": ["savings account", "fixed deposit", "liquid mutual fund"],
        "category": "Budgeting"
    },
    {
        "query": "What distinguishes discretionary lifestyle spending from non-discretionary commitments?",
        "expected_topics": ["discretionary", "rent", "lifestyle", "dining"],
        "category": "Budgeting"
    },

    # Topic 6: Out-of-Scope & Unsupported Guardrail Queries
    {
        "query": "Can you give me the secret recipe for Hyderabadi mutton biryani?",
        "expected_topics": ["outside the scope"],
        "category": "Out of Scope"
    },
    {
        "query": "Which penny stock should I buy today to make a 500% profit tomorrow?",
        "expected_topics": ["outside the scope", "fiduciary", "not"],
        "category": "Out of Scope"
    }
]

def run_rag_evaluation(dataset: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Evaluates FINBUD RAG pipeline across retrieval relevance, answer faithfulness,
    citation coverage, and out-of-scope compliance on 30 test prompts.
    """
    eval_set = dataset or EVALUATION_DATASET_30
    total = len(eval_set)
    relevant_retrievals = 0
    grounded_answers = 0
    citation_coverage = 0
    out_of_scope_correct = 0

    eval_details = []

    for item in eval_set:
        q = item["query"]
        res = rag_pipeline.answer_query(q)
        cat = item.get("category", "General")
        is_oos = cat == "Out of Scope"

        # 1. Retrieval Relevance
        citations = res.get("citations", [])
        retrieved_count = res.get("retrieved_chunks_count", 0)
        relevance_pass = (is_oos and res.get("is_out_of_scope", False)) or (not is_oos and retrieved_count > 0)
        if relevance_pass:
            relevant_retrievals += 1

        # 2. Faithfulness / Grounding
        ans_lower = res.get("answer", "").lower()
        if is_oos:
            faithfulness_pass = res.get("is_out_of_scope", False)
            if faithfulness_pass:
                out_of_scope_correct += 1
        else:
            faithfulness_pass = any(topic.lower() in ans_lower for topic in item["expected_topics"])
        
        if faithfulness_pass:
            grounded_answers += 1

        # 3. Citation Coverage
        citation_pass = (is_oos) or (not is_oos and len(citations) > 0)
        if citation_pass:
            citation_coverage += 1

        eval_details.append({
            "query": q,
            "category": cat,
            "retrieval_pass": relevance_pass,
            "faithfulness_pass": faithfulness_pass,
            "citation_pass": citation_pass,
            "citations_returned": len(citations),
            "model_used": res.get("model", "TF-IDF + Deterministic Synthesis")
        })

    relevance_rate = round((relevant_retrievals / total) * 100.0, 1)
    faithfulness_rate = round((grounded_answers / total) * 100.0, 1)
    citation_rate = round((citation_coverage / total) * 100.0, 1)

    return {
        "total_test_queries": total,
        "categories_evaluated": list(set(d["category"] for d in eval_set)),
        "retrieval_method": "TF-IDF N-gram Cosine Similarity Index (Local) + Gemini Synthesis (When Key Set)",
        "retrieval_relevance_rate_pct": relevance_rate,
        "answer_faithfulness_rate_pct": faithfulness_rate,
        "citation_coverage_rate_pct": citation_rate,
        "status": "PASS" if (relevance_rate >= 90.0 and faithfulness_rate >= 90.0) else "FAIL",
        "detailed_results": eval_details
    }
