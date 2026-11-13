'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';

interface Citation {
  title: string;
  source: string;
  section: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  model?: string;
  isOutOfScope?: boolean;
  evidenceSufficient?: boolean;
  timestamp: string;
}

interface RAGEvalReport {
  total_test_queries: number;
  retrieval_relevance_rate_pct: number;
  answer_faithfulness_rate_pct: number;
  citation_coverage_rate_pct: number;
  status: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: 'Namaste! I am FINBUD AI, your verified Retrieval-Augmented Generation (RAG) copilot. Every answer I generate is strictly grounded in our curated, versioned Indian Personal Finance Knowledge Base covering taxation, Sovereign Gold Bonds (SGB), SIP compounding, insurance heuristics, and cash-flow budgeting. How may I assist you today?',
    citations: [
      {
        title: 'FINBUD Curated Financial Knowledge Base (v1.2.0)',
        source: 'Income Tax Dept, RBI, AMFI, IRDAI',
        section: 'Sec 1.0 - Academic Governance & Fiduciary Mandate',
      },
    ],
    model: 'Curated Vector RAG Pipeline',
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUERIES = [
  'What are the tax implications of Sovereign Gold Bonds vs Physical Gold?',
  'Explain the 10x annual income heuristic for Term Insurance',
  'How does the Rule of 72 calculate investment doubling time?',
  'What are the tax deduction limits under Section 80C and Section 80D?',
  'How is the 50/30/20 budgeting rule divided for emergency funds?',
];

export default function FinbudAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalReport, setEvalReport] = useState<RAGEvalReport | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(API_ENDPOINTS.ragAsk, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          query: textToSend.trim(),
          conversation_history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          citations: data.citations || [],
          model: data.model || 'Grounded RAG Pipeline',
          isOutOfScope: data.is_out_of_scope,
          evidenceSufficient: data.evidence_sufficient,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      console.warn('RAG backend failed, displaying client fallback', err);
      const fallbackReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to reach the live RAG vector service. Please verify that the FastAPI backend server is running on port 8000.',
        citations: [],
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRunEvaluation = async () => {
    setEvalModalOpen(true);
    setEvalLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.ragEvaluate);
      if (res.ok) {
        const data = await res.json();
        setEvalReport(data);
      }
    } catch (e) {
      console.error('Eval error', e);
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B46] tracking-tight">
              FINBUD RAG Financial Assistant
            </h1>
            <span className="text-[10px] bg-[#E9FFF5] text-[#182B46] border border-[#182B46] px-2 py-0.5 rounded font-mono font-bold">
              GROUNDED RAG COPILOT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5E76] mt-0.5">
            Grounded vector retrieval across Indian tax codes, SGBs, SIP mechanics, and insurance heuristics with verifiable source citations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunEvaluation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#182B46] hover:border-[#1E40AF] text-[#374151] hover:text-[#182B46] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Award size={14} className="text-[#182B46]" />
            Audit RAG Evaluation Set
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-white border border-[#182B46] shadow-xs flex flex-col h-140 overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-[#FFD05B] text-[#182B46] text-white shadow-xs'
                    : 'bg-[#E9FFF5] text-[#182B46] border border-[#182B46]'
                }`}
              >
                {m.sender === 'user' ? 'U' : <Bot size={16} />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#FFD05B] text-[#182B46] text-white shadow-xs'
                      : m.isOutOfScope
                      ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                      : 'bg-[#FFFDF5] text-[#182B46] border border-[#182B46]'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {m.model && m.sender === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-[#182B46] flex items-center justify-between text-[10px] text-[#4B5E76]">
                      <span className="font-mono">Engine: {m.model}</span>
                      <span className="flex items-center gap-1 text-[#182B46]">
                        <ShieldCheck size={11} className="text-[#182B46]" /> Zero Hallucination Guard
                      </span>
                    </div>
                  )}
                </div>

                {/* Grounded Citation Badges */}
                {m.citations && m.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    {m.citations.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#182B46] text-[#4B5E76]"
                      >
                        <BookOpen size={11} className="text-[#182B46] shrink-0" />
                        <span>
                          <strong>{c.title}</strong> • {c.section}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-sm items-center text-xs text-[#4B5E76]">
              <div className="w-8 h-8 rounded-xl bg-[#E9FFF5] text-[#182B46] flex items-center justify-center">
                <Sparkles size={14} className="animate-spin" />
              </div>
              <span className="animate-pulse">Retrieving grounded knowledge passages & synthesizing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-[#FFFDF5] border-t border-[#182B46] overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F4F6] border border-[#182B46] text-[#374151] hover:text-[#182B46] transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              <span>{q}</span>
              <ArrowRight size={11} className="text-[#182B46]" />
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-[#182B46] flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask about Indian taxation, SIP compounding, SGBs, or insurance heuristics..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-[#FFFDF5] border border-[#182B46] rounded-xl px-4 py-2.5 text-xs text-[#182B46] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-2.5 rounded-xl bg-[#FFD05B] text-[#182B46] hover:bg-[#FFD05B] text-[#182B46] text-white font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* RAG Evaluation Audit Modal */}
      {evalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#182B46] shadow-xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#182B46] pb-3">
              <h3 className="text-base font-bold text-[#182B46] flex items-center gap-2">
                <Award size={18} className="text-[#182B46]" />
                RAG Retrieval & Faithfulness Audit
              </h3>
              <button
                onClick={() => setEvalModalOpen(false)}
                className="text-[#4B5E76] hover:text-[#182B46] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {evalLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#4B5E76]">
                <RefreshCw size={20} className="animate-spin text-[#182B46]" />
                <span>Running benchmark test suite across evaluation queries...</span>
              </div>
            ) : evalReport ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#E9FFF5] border border-[#182B46] text-center">
                    <span className="text-[10px] text-[#182B46] font-semibold block">Retrieval Relevance</span>
                    <span className="text-xl font-bold font-mono text-[#182B46]">
                      {evalReport.retrieval_relevance_rate_pct}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#E9FFF5] border border-[#182B46] text-center">
                    <span className="text-[10px] text-[#182B46] font-semibold block">Answer Faithfulness</span>
                    <span className="text-xl font-bold font-mono text-[#182B46]">
                      {evalReport.answer_faithfulness_rate_pct}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#E9FFF5] border border-[#182B46] text-center">
                    <span className="text-[10px] text-[#182B46] font-semibold block">Citation Coverage</span>
                    <span className="text-xl font-bold font-mono text-[#182B46]">
                      {evalReport.citation_coverage_rate_pct}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFDF5] border border-[#182B46] text-[#4B5E76] space-y-1">
                  <div className="font-semibold text-[#182B46]">Academic Evaluation Benchmark:</div>
                  <p>
                    Evaluated across {evalReport.total_test_queries} curated test cases covering taxation, SGB capital gains, Rule of 72 compounding, Section 80C/80D limits, and 50/30/20 budgeting.
                  </p>
                  <p className="text-[#182B46] font-semibold">
                    Status: {evalReport.status} • Grounded with zero unreferenced statements.
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#182B46]">
                  <button
                    onClick={() => setEvalModalOpen(false)}
                    className="px-4 py-2 bg-[#FFD05B] text-[#182B46] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#FFD05B] text-[#182B46]"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

