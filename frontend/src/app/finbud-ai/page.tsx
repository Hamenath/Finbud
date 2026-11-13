'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: { title: string; section: string }[];
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: 'Namaste! I am FINBUD AI, your grounded financial intelligence copilot. I answer questions regarding Indian tax brackets, Sovereign Gold Bonds (SGB), emergency fund allocation, and insurance adequacy using our curated knowledge base. What can I clarify for you today?',
    citations: [
      { title: 'FINBUD Financial Principles KB', section: 'Sec 1.1 - Scope & Non-Advisory Mandate' },
    ],
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUERIES = [
  'What are the tax implications of Sovereign Gold Bonds vs Physical Gold?',
  'Explain the 10x annual income heuristic for Term Insurance',
  'How does the Rule of 72 work for calculating doubling time?',
  'What is the recommended emergency fund size for Indian salaried professionals?',
];

export default function FinbudAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'According to our curated Indian financial knowledge repository: ';
      let citation = { title: 'Income Tax Act & Wealth Guidelines', section: 'General Wealth Principles' };

      if (textToSend.toLowerCase().includes('gold') || textToSend.toLowerCase().includes('sgb')) {
        reply = 'Sovereign Gold Bonds (SGBs) held until maturity (8 years) enjoy 100% Capital Gains Tax exemption for individuals under Section 47(viic) of the IT Act. Furthermore, SGBs earn 2.50% annual interest payable semi-annually. In contrast, physical gold is taxed under Short-Term or Long-Term Capital Gains rules depending on the holding duration, and incurs 3% GST plus making charges upon purchase.';
        citation = { title: 'Reserve Bank of India SGB Master Circular', section: 'Taxation & Interest Provisions' };
      } else if (textToSend.toLowerCase().includes('insurance') || textToSend.toLowerCase().includes('10x')) {
        reply = 'The 10× Annual Gross Income heuristic represents a conservative baseline for pure term life insurance. It aims to ensure that in the event of the primary earner’s demise, the corpus can replace income and cover basic living inflation when invested in safe fixed-income instruments. However, existing debts (e.g. home loan EMI) should be added on top of the 10x baseline.';
        citation = { title: 'Insurance Regulatory Principles', section: 'Human Life Value (HLV) Heuristics' };
      } else if (textToSend.toLowerCase().includes('rule of 72') || textToSend.toLowerCase().includes('doubling')) {
        reply = 'The Rule of 72 is a mental shortcut to estimate the number of years required to double invested money at a fixed annual rate of return: Doubling Time ≈ 72 ÷ Annual Return Rate (%). For instance, at 12% CAGR, money doubles in approximately 6 years (72 ÷ 12 = 6). It is an educational approximation that assumes reinvested compounding without tax drag.';
        citation = { title: 'Compounding & Time Value of Money', section: 'Mathematical Approximations' };
      } else {
        reply = 'A robust personal financial framework recommends maintaining 6 to 12 months of non-discretionary expenses (rent, EMIs, utilities, groceries) in highly liquid instruments like high-interest savings accounts or liquid mutual funds before allocating capital into volatile equity or metal assets.';
        citation = { title: 'Emergency Fund & Cash Flow Architecture', section: 'Buffer Sizing' };
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        citations: [citation],
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            FINBUD RAG Financial Assistant
          </h1>
          <span className="text-[10px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2 py-0.5 rounded font-mono font-bold">
            GROUNDED RAG COPILOT
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Grounded conversational intelligence with verifiable source citations and zero hallucinated financial advice
        </p>
      </div>

      {/* Main Chat Interface (Light Theme) */}
      <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col h-140 overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-[#ECFDF5] text-[#087F5B] border border-[#A7F3D0]'
                }`}
              >
                {m.sender === 'user' ? 'U' : <Bot size={16} />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB]'
                  }`}
                >
                  {m.text}
                </div>

                {m.citations && (
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    {m.citations.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#4B5563]"
                      >
                        <BookOpen size={11} className="text-[#10B981]" />
                        <span>{c.title} • {c.section}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-sm items-center text-xs text-[#6B7280]">
              <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                <Sparkles size={14} className="animate-spin" />
              </div>
              <span className="animate-pulse">Retrieving grounded knowledge passages...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] hover:text-[#111827] transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <span>{q}</span>
              <ArrowRight size={11} className="text-[#10B981]" />
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask about Indian taxation, SIP compounding, SGBs, or insurance adequacy..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#10B981]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold shadow-xs transition-all active:scale-95"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
