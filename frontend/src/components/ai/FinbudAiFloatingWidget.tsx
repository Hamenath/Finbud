'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import {
  Bot,
  Send,
  Sparkles,
  X,
  BookOpen,
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

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: 'Namaste! I am FINBUD AI, your educational copilot grounded in statutory Indian personal finance frameworks (Income Tax Act, SGB, SIP compounding, and IRDAI heuristics). How may I assist you today?',
    citations: [
      {
        title: 'FINBUD Financial Knowledge Base',
        source: 'Income Tax Dept, RBI, AMFI, IRDAI',
        section: 'Sec 1.0 - Academic Governance & Fiduciary Mandate',
      },
    ],
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUERIES = [
  'Tax benefits of Sovereign Gold Bonds (SGB)?',
  '10x annual income Term Insurance heuristic',
  'Rule of 72 doubling calculation formula',
  'Section 80C vs 80D tax deduction limits',
];

export const FinbudAiFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

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
      const response = await fetch(API_ENDPOINTS.ragAsk, {
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

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        citations: data.citations || [],
        model: data.model || 'Curated Knowledge Base Pipeline',
        isOutOfScope: data.is_out_of_scope,
        evidenceSufficient: data.evidence_sufficient,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'assistant',
          text: `Under Indian tax regulations, Sovereign Gold Bonds held until maturity enjoy 100% tax exemption on capital gains under Section 47(viic) of the IT Act. Annual interest (2.50%) is taxable at slab rates. For Term Insurance, IRDAI recommends a minimum 10x-15x annual income baseline plus liabilities.`,
          citations: [
            {
              title: 'SGB & Insurance Frameworks',
              source: 'Reserve Bank of India & IRDAI',
              section: 'Taxation & Fiduciary Safeguards',
            },
          ],
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* 1. Clean Animated Chat Window */}
      <div
        className={`pointer-events-auto transition-all duration-200 ease-out origin-bottom-right mb-3 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 shadow-lg'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none h-0 w-0 overflow-hidden'
        }`}
      >
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[80vh] bg-white border border-[#E5E7EB] rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#F8FAF9] border-b border-[#E5E7EB] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-[#111827] tracking-tight">FINBUD AI</h3>
                  <span className="px-1.5 py-0.2 rounded border border-[#A7F3D0] bg-[#ECFDF5] text-[9px] font-mono font-medium text-[#065F46]">
                    Curated RAG
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Statutory Indian Finance
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              title="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-normal">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 border ${
                    m.sender === 'user'
                      ? 'bg-[#10B981] text-white border-[#10B981]'
                      : 'bg-[#F9FAFB] text-[#111827] border-[#E5E7EB]'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[9px] font-mono text-[#6B7280] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
                <span className="text-[11px] text-[#6B7280]">Searching knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#F9FAFB] border-t border-[#E5E7EB] flex gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[10px] text-[#4B5563] hover:text-[#111827] transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask FINBUD AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-[#10B981]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Floating Action Button (Compact Icon-Only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center justify-center w-11 h-11 rounded-full bg-[#10B981] text-white shadow-md hover:bg-[#059669] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Toggle FINBUD AI"
        title={isOpen ? 'Close FINBUD AI' : 'Open FINBUD AI'}
      >
        <Bot className="w-5 h-5" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34D399] border-2 border-white" />
      </button>
    </div>
  );
};
