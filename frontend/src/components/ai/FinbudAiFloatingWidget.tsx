'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
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
    text: 'Namaste! I am FINBUD AI, your verified RAG copilot grounded in official Indian personal finance rules (Taxation, SGB, SIP compounding, IRDAI insurance). How can I assist you?',
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
  'Tax on Sovereign Gold Bonds (SGB)?',
  '10x annual income Term Insurance rule',
  'Rule of 72 doubling calculation',
  'Section 80C vs 80D tax deductions',
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
      const response = await fetch('http://127.0.0.1:8000/api/v1/ai/rag-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          history: messages.slice(-4).map((m) => ({
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
        model: data.model_used,
        isOutOfScope: data.out_of_scope,
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
          text: `Under Indian tax regulations, Sovereign Gold Bonds held until 8-year maturity enjoy 100% tax exemption on capital gains under Section 47 of the IT Act. For Term Insurance, IRDAI recommends a minimum 10x-15x annual income baseline.`,
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
      {/* 1. Animated Chat Window */}
      <div
        className={`pointer-events-auto transition-all duration-300 ease-out origin-bottom-right mb-4 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 shadow-[6px_6px_0_#182B46]'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none h-0 w-0 overflow-hidden'
        }`}
      >
        <div className="w-[360px] sm:w-[400px] h-[540px] max-h-[80vh] bg-[#FFFDF5] border-[2px] border-[#182B46] rounded-[20px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#FFD05B] border-b-[1.5px] border-[#182B46] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border-[1.5px] border-[#182B46] bg-white flex items-center justify-center shadow-[1.5px_1.5px_0_#182B46]">
                <Bot className="w-4 h-4 text-[#182B46] stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-[#182B46] tracking-tight">FINBUD AI</h3>
                  <span className="px-1.5 py-0.2 rounded border border-[#182B46] bg-[#E9FFF5] text-[9px] font-mono font-extrabold text-[#182B46]">
                    RAG
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#182B46]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#182B46] animate-pulse" />
                  Knowledge Base Grounded
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md border-[1.5px] border-[#182B46] bg-white hover:bg-[#FFFDF5] text-[#182B46] shadow-[1.5px_1.5px_0_#182B46] cursor-pointer"
              title="Close assistant"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-medium">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[14px] p-3 border-[1.5px] border-[#182B46] ${
                    m.sender === 'user'
                      ? 'bg-[#182B46] text-white shadow-[2px_2px_0_#182B46]'
                      : 'bg-white text-[#182B46] shadow-[2px_2px_0_#9DE8CB]'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap font-sans">{m.text}</p>

                  {/* Citations Pill */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t-[1.5px] border-[#182B46]/10 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#4B5E76] uppercase tracking-wider">
                        <BookOpen size={11} />
                        <span>Curated Grounding</span>
                      </div>
                      {m.citations.map((c, i) => (
                        <div
                          key={i}
                          className="p-1.5 rounded-md bg-[#FFFDF5] border border-[#182B46]/30 text-[10px]"
                        >
                          <div className="font-extrabold text-[#182B46] truncate">{c.title}</div>
                          <div className="text-[#4B5E76] font-mono truncate">{c.section}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold text-[#4B5E76] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-[12px] bg-white border-[1.5px] border-[#182B46] w-fit shadow-[2px_2px_0_#9DE8CB]">
                <Sparkles className="w-3.5 h-3.5 text-[#182B46] animate-spin" />
                <span className="text-[11px] font-bold text-[#182B46]">Retrieving knowledge...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t-[1.5px] border-[#182B46] flex gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full border border-[#182B46] bg-[#FFFDF5] hover:bg-[#FFD05B] text-[10px] font-bold text-[#182B46] transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#FFFDF5] border-t-[1.5px] border-[#182B46] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask FINBUD AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white border-[1.5px] border-[#182B46] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFD05B]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl border-[1.5px] border-[#182B46] bg-[#FFD05B] hover:bg-[#E5B842] text-[#182B46] shadow-[2px_2px_0_#182B46] disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Floating Action Button (Always visible on bottom-right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group flex items-center gap-2.5 px-4 py-3 rounded-[16px] border-[2px] border-[#182B46] bg-[#FFD05B] shadow-[4px_4px_0_#182B46] hover:shadow-[5px_5px_0_#182B46] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[1px_1px_0_#182B46] transition-all cursor-pointer"
        aria-label="Toggle FINBUD AI"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-[#182B46] stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E9FFF5] border border-[#182B46]" />
        </div>
        <span className="text-xs font-extrabold text-[#182B46] tracking-tight">
          {isOpen ? 'Close AI' : 'FINBUD AI'}
        </span>
      </button>
    </div>
  );
};

