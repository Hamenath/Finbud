'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { FinbudLogo } from '@/components/common/FinbudLogo';

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

    const { error } = await supabase.auth.signInWithPassword({
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm relative">
        <div className="flex justify-center mb-6">
          <FinbudLogo showWordmark={true} size="lg" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#6B7280] mt-1">Sign in to your secure financial vault</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#374151]">Password</label>
              <Link
                href="/auth/reset-password"
                className="text-[11px] text-[#1E40AF] hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1E40AF] text-white font-semibold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-center text-xs text-[#6B7280]">
          Do not have an account?{' '}
          <Link href="/auth/signup" className="text-[#1E40AF] font-semibold hover:underline">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

