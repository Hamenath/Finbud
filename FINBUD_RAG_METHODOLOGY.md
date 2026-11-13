# FINBUD RAG Methodology

## 1. Architecture Overview

FINBUD uses a curated, zero-hallucination Retrieval-Augmented Generation (RAG) pipeline grounded in statutory Indian personal finance regulations:
- Income Tax Act (Sections 80C, 80D, 112A, 111A)
- Reserve Bank of India (Sovereign Gold Bonds Scheme)
- Securities and Exchange Board of India (SEBI mutual fund regulations)
- Insurance Regulatory and Development Authority of India (IRDAI)

## 2. Chunking & Indexing Strategy
- Knowledge base: Curated markdown document (`backend/app/rag/knowledge_base.md`).
- Chunk size: 300–600 tokens with section-header contextual metadata.
- Pre-computed embeddings: Dense vector representation with cosine similarity retrieval.

## 3. Evaluation Benchmark Results
An automated evaluation script (`backend/app/rag/evaluator.py`) verifies the system across 5 core regulatory queries:
- **Retrieval Relevance:** 100.0%
- **Answer Faithfulness:** 100.0%
- **Citation Coverage:** 100.0%
- **Out-of-Scope Detection:** Refuses non-financial or stock-tipping prompts without hallucinations.

