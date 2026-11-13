'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141418] border border-[#22222E] rounded-3xl p-8 shadow-2xl relative">
        <h1 className="text-xl font-extrabold text-white tracking-tight">Reset Password</h1>
        <p className="text-xs text-neutral-400 mt-1 mb-6">
          Enter your registered email to receive recovery instructions
        </p>

        {msg && (
          <div
            className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              msg.type === 'error'
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262634] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send Recovery Link'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#1F1F2A] text-center text-xs text-neutral-400">
          Remembered password?{' '}
          <Link href="/auth/login" className="text-[#F59E0B] font-semibold hover:underline">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

