'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { FinbudLogo } from '@/components/common/FinbudLogo';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });

    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      setMsg({
        type: 'success',
        text: 'Password recovery email dispatched. Please check your inbox.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm relative">
        <div className="flex justify-center mb-6">
          <FinbudLogo showWordmark={true} size="lg" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">Reset Password</h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Enter your registered email to receive recovery instructions
          </p>
        </div>

        {msg && (
          <div
            className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              msg.type === 'error'
                ? 'bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]'
                : 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]'
            }`}
          >
            {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#10B981]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send Recovery Link'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-center text-xs text-[#6B7280]">
          Remembered password?{' '}
          <Link href="/auth/login" className="text-[#059669] font-semibold hover:underline">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
