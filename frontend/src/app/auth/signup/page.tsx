'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('50000');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          monthly_income_target: parseFloat(monthlyIncome) || 50000,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      if (data?.session) {
        // Direct auto-login if email confirmation is disabled in Supabase
        router.push('/');
        router.refresh();
      } else {
        setSuccessMsg('Account created successfully! Please verify your email or sign in.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141418] border border-[#22222E] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#F59E0B] to-[#FBBF24] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20">
            F
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Create Account</h1>
            <p className="text-xs text-neutral-400">Join FINBUD Multi-Asset Intelligence</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                required
                placeholder="e.g. Diwakar D"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262634] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262634] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Monthly Inflow Target (₹ INR)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 75000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full bg-[#0A0A0C] border border-[#262634] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#1F1F2A] text-center text-xs text-neutral-400">
          Already registered?{' '}
          <Link href="/auth/login" className="text-[#F59E0B] font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

