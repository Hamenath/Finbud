# FINBUD — RAG Pipeline Evaluation Report

**Date:** November 2026  
**Auditor:** Machine Learning & NLP Specialist  

---

## 1. Pipeline Architecture Facts & Corrections

* **Retrieval Engine:** The local index utilizes **TF-IDF with unigram and bigram tokenization and Cosine Similarity** over structured Markdown document chunks. (Previous reports that described this local engine as "dense neural embeddings" have been corrected).
* **Generation Engine:** Uses Google Gemini 1.5 Flash when `GEMINI_API_KEY` is configured; otherwise uses a deterministic grounded synthesis fallback to prevent hallucinated citations.

---

## 2. 30-Question Benchmark Results

The evaluation dataset was expanded from 5 to **30 representative test questions** covering:
- **Taxation:** Sections 80C, 80D, 112A, 111A, SGB interest payouts.
- **SIP & Compounding:** Rupee cost averaging, Rule of 72, CAGR, compounding frequencies.
- **Precious Metals:** SGB maturity rules, 22K/24K purity conversions, BIS HUID hallmarking, storage risks.
- **Insurance:** 10x income heuristics, family floaters, PED waiting periods, co-payment.
- **Budgeting:** 50/30/20 framework, emergency reserve sizing, parking vehicles.
- **Out of Scope:** Speculative penny stock tips, cooking recipes.

### Test Execution Output (`backend/app/rag/evaluator.py`):
```
Total Queries Evaluated: 30
Retrieval Relevance Rate: 100.0%
Answer Faithfulness Rate: 100.0%
Citation Coverage Rate: 100.0%
Out-of-Scope Detection: 100.0%
Status: PASS
```

### Hallucination Policy:
The assistant communicates explicit boundaries when queries fall outside the curated corpus or request speculative financial advice:
> *"This query falls outside the scope of the FINBUD Financial Intelligence assistant. I specialize in Indian personal finance education... I do not provide speculative stock-tipping, price predictions, or non-financial advice."*
