'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141418] border border-[#22222E] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#F59E0B] to-[#FBBF24] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20">
            F
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
              FINBUD
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROD
              </span>
            </h1>
            <p className="text-xs text-neutral-400">Sign in to your secure financial vault</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Email Address
            </label>
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">Password</label>
              <Link
                href="/auth/reset-password"
                className="text-[11px] text-[#F59E0B] hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262634] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#1F1F2A] text-center text-xs text-neutral-400">
          Do not have an account?{' '}
          <Link href="/auth/signup" className="text-[#F59E0B] font-semibold hover:underline">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

