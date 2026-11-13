"use client";

import * as React from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { ThinkingPromptInput } from "@/components/ui/thinking-prompt-input";
import type { ThinkingStatus, ThinkingStep, ThinkingSubmitOptions } from "@/components/ui/thinking-prompt-input";
import { API_ENDPOINTS } from "@/config/api";
import { createClient } from "@/utils/supabase/client";

export default function ThinkingDemo() {
  const [status, setStatus] = React.useState<ThinkingStatus>("idle");
  const [prompt, setPrompt] = React.useState("");
  const [value, setValue] = React.useState("");
  const [steps, setSteps] = React.useState<ThinkingStep[]>([]);
  const [answer, setAnswer] = React.useState("");
  const [elapsed, setElapsed] = React.useState(0);
  const [think, setThink] = React.useState(true);

  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (status === "thinking") {
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

  async function handleSend(userPrompt: string, options: ThinkingSubmitOptions) {
    setPrompt(userPrompt);
    setStatus("thinking");
    setAnswer("");
    setSteps([
      { id: "analyze", text: "Analyzing query & financial context…", status: "active" },
    ]);

    try {
      if (options.think) {
        setTimeout(() => {
          setSteps((prev) => [
            { id: "analyze", text: "Query analyzed", status: "complete" },
            { id: "retrieve", text: "Retrieving verified knowledge passages…", status: "active" },
          ]);
        }, 800);
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(API_ENDPOINTS.ragAsk, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          query: userPrompt,
        }),
      });

      if (!res.ok) throw new Error("Backend request failed");
      const data = await res.json();

      setSteps([
        { id: "analyze", text: "Query analyzed", status: "complete" },
        { id: "retrieve", text: "Verified knowledge grounded", status: "complete" },
        { id: "synthesize", text: "Synthesis ready", status: "complete" },
      ]);

      setStatus("answering");
      
      // Smooth streaming simulation for response
      const fullText = data.answer || "No response received.";
      let idx = 0;
      const interval = setInterval(() => {
        idx += 3;
        setAnswer(fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setStatus("done");
        }
      }, 20);
    } catch (err) {
      setSteps((prev) => prev.map((s) => ({ ...s, status: "complete" })));
      setStatus("done");
      setAnswer("Unable to reach the FINBUD AI service. Please ensure the backend is running.");
    }
  }

  return (
    <div className="flex w-full items-center justify-center p-2 font-sans text-foreground">
      <div className="w-full max-w-[480px]">
        <div className="h-[460px] flex flex-col justify-end">
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
            onStop={() => setStatus("idle")}
            placeholder="Ask FINBUD AI anything..."
            followUpPlaceholder="Ask a follow-up..."
            answerNote="Educational decision-support heuristics · Not SEBI-registered financial advisory."
          />
        </div>
      </div>
    </div>
  );
}

