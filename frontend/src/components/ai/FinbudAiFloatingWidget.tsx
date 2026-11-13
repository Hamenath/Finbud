'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { ThinkingPromptInput } from '@/components/ui/thinking-prompt-input';
import type { ThinkingStatus, ThinkingStep, ThinkingSubmitOptions } from '@/components/ui/thinking-prompt-input';
import { createClient } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';

export const FinbudAiFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ThinkingStatus>('idle');
  const [prompt, setPrompt] = useState('');
  const [value, setValue] = useState('');
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [answer, setAnswer] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [think, setThink] = useState(true);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'thinking') {
      setElapsed(0);
      const start = Date.now();
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.round((Date.now() - start) / 1000));
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const handleSend = async (userPrompt: string, options: ThinkingSubmitOptions) => {
    setPrompt(userPrompt);
    setStatus('thinking');
    setAnswer('');
    setSteps([
      { id: 'analyze', text: 'Analyzing financial query…', status: 'active' },
    ]);

    try {
      if (options.think) {
        setTimeout(() => {
          setSteps((prev) => [
            { id: 'analyze', text: 'Query analyzed', status: 'complete' },
            { id: 'retrieve', text: 'Retrieving verified knowledge passages…', status: 'active' },
          ]);
        }, 600);
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(API_ENDPOINTS.ragAsk, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          query: userPrompt,
        }),
      });

      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();

      setSteps([
        { id: 'analyze', text: 'Query analyzed', status: 'complete' },
        { id: 'retrieve', text: 'Verified knowledge grounded', status: 'complete' },
        { id: 'synthesize', text: 'Answer synthesized', status: 'complete' },
      ]);

      setStatus('answering');

      // Clean formatted text streaming
      const fullText = data.answer || 'No response generated.';
      let idx = 0;
      const interval = setInterval(() => {
        idx += 3;
        setAnswer(fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setStatus('done');
        }
      }, 20);
    } catch (err) {
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'complete' })));
      setStatus('done');
      setAnswer('Unable to connect to FINBUD AI service. Please verify server connectivity.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Animated Chat Window Powered by ThinkingPromptInput in Light Theme */}
      <div
        data-lenis-prevent
        className={`pointer-events-auto transition-all duration-300 ease-out origin-bottom-right mb-3 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 shadow-2xl'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none h-0 w-0 overflow-hidden'
        }`}
      >
        <div 
          data-lenis-prevent
          className="w-[380px] sm:w-[440px] h-[580px] max-h-[85vh] bg-white border border-[#E5E7EB] rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-[#F8FAF9] border-b border-[#E5E7EB] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-[#111827] tracking-tight">FINBUD AI</h3>
                  <span className="px-1.5 py-0.5 rounded border border-[#A7F3D0] bg-[#ECFDF5] text-[9px] font-mono font-medium text-[#065F46]">
                    Reasoning Copilot
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
              className="p-1.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              title="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thinking Component Container */}
          <div 
            data-lenis-prevent
            className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col justify-end bg-white"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            <ThinkingPromptInput
              status={status}
              prompt={prompt}
              value={value}
              onValueChange={setValue}
              think={think}
              onThinkChange={setThink}
              steps={steps}
              answer={answer}
              elapsedSeconds={elapsed}
              onSubmit={handleSend}
              onStop={() => setStatus('idle')}
              placeholder="Ask FINBUD AI anything (e.g. what is sip ?)..."
              followUpPlaceholder="Ask a follow-up question..."
              answerNote="Educational decision-support heuristics · Not financial advisory."
              className="w-full max-w-full"
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-11 h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white cursor-pointer"
        aria-label="Toggle FINBUD AI Assistant"
      >
        <Bot size={22} className="text-white" />
      </button>
    </div>
  );
};
