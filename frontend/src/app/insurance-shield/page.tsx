'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Calendar,
  Users,
  CreditCard,
  Building,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { DEMO_INSURANCE_POLICIES } from '@/data/demoData';

interface InsurancePolicy {
  id: string;
  policy_type: 'TERM_LIFE' | 'HEALTH_INDIVIDUAL' | 'HEALTH_FAMILY_FLOATER' | 'CRITICAL_ILLNESS';
  provider_name: string;
  policy_number_masked: string;
  sum_insured: number;
  premium_annual: number;
  renewal_date: string;
  covered_members: string;
  notes?: string | null;
  created_at?: string;
}

export default function InsuranceShieldPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // User Inflow / Annual Income Heuristic state
  const [monthlyInflow, setMonthlyInflow] = useState<number>(245000);
  const [heuristicMultiplier, setHeuristicMultiplier] = useState<number>(10);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formPolicyType, setFormPolicyType] = useState<'TERM_LIFE' | 'HEALTH_INDIVIDUAL' | 'HEALTH_FAMILY_FLOATER' | 'CRITICAL_ILLNESS'>('TERM_LIFE');
  const [formProvider, setFormProvider] = useState('');
  const [formPolicyNo, setFormPolicyNo] = useState('');
  const [formSumInsured, setFormSumInsured] = useState('');
  const [formPremium, setFormPremium] = useState('');
  const [formPaymentFrequency, setFormPaymentFrequency] = useState<'ANNUAL' | 'MONTHLY' | 'HALF_YEARLY'>('ANNUAL');
  const [formRenewalDate, setFormRenewalDate] = useState('2027-04-15');
  const [formCoveredMembers, setFormCoveredMembers] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Type filter
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    async function init() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      if (currentUser) {
        await fetchUserPolicies(currentUser.id);
        await fetchUserProfileIncome(currentUser.id);
      } else {
        loadDemoPolicies();
      }
    }

    init();
  }, []);

  const fetchUserProfileIncome = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('monthly_inflow_target')
        .eq('id', userId)
        .single();
      if (data && data.monthly_inflow_target) {
        setMonthlyInflow(Number(data.monthly_inflow_target));
      }
    } catch {
      // Keep default
    }
  };

  const fetchUserPolicies = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insurance_policies')
        .select('*')
        .eq('user_id', userId)
        .order('renewal_date', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setPolicies(data as InsurancePolicy[]);
        setIsDemoMode(false);
      } else {
        loadDemoPolicies();
      }
    } catch (err) {
      console.error('Error fetching insurance policies:', err);
      loadDemoPolicies();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoPolicies = () => {
    setIsDemoMode(true);
    const demoMapped: InsurancePolicy[] = DEMO_INSURANCE_POLICIES.map((p) => ({
      id: p.id,
      policy_type: p.type as any,
      provider_name: p.provider,
      policy_number_masked: p.policyNo,
      sum_insured: p.sumInsured,
      premium_annual: p.annualPremium,
      renewal_date: p.renewalDate,
      covered_members: p.members,
      notes: 'Demo verified policy record',
    }));
    setPolicies(demoMapped);
    setLoading(false);
  };

  // Heuristic computations
  const annualIncome = monthlyInflow * 12;
  const indicativeTermNeed = annualIncome * heuristicMultiplier;

  const currentTermCoverage = useMemo(() => {
    return policies
      .filter((p) => p.policy_type === 'TERM_LIFE')
      .reduce((sum, p) => sum + Number(p.sum_insured), 0);
  }, [policies]);

  const currentHealthCoverage = useMemo(() => {
    return policies
      .filter((p) => p.policy_type !== 'TERM_LIFE')
      .reduce((sum, p) => sum + Number(p.sum_insured), 0);
  }, [policies]);

  const totalAnnualPremium = useMemo(() => {
    return policies.reduce((sum, p) => sum + Number(p.premium_annual), 0);
  }, [policies]);

  const termCoverageGap = Math.max(0, indicativeTermNeed - currentTermCoverage);
  const termAdequacyRatio = indicativeTermNeed > 0 ? Math.min(100, (currentTermCoverage / indicativeTermNeed) * 100) : 100;

  // Renewal helper: checks if renewal is within 45 days
  const getRenewalStatus = (renewalDateStr: string) => {
    const today = new Date('2026-11-13'); // Reference date
    const renewal = new Date(renewalDateStr);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'EXPIRED', label: 'Overdue / Lapsed', badgeClass: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]', days: diffDays };
    }
    if (diffDays <= 45) {
      return { status: 'UPCOMING', label: `Renew in ${diffDays}d`, badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]', days: diffDays };
    }
    return { status: 'ACTIVE', label: 'Healthy Cover', badgeClass: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]', days: diffDays };
  };

  // Handle Save / Edit Policy
  const handleSubmitPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const sumNum = parseFloat(formSumInsured);
    let premiumNum = parseFloat(formPremium);

    if (isNaN(sumNum) || sumNum <= 0 || isNaN(premiumNum) || premiumNum < 0) {
      alert('Please enter valid positive numbers for Sum Insured and Premium.');
      setSubmitting(false);
      return;
    }

    // Normalize premium to annual if monthly or half-yearly
    if (formPaymentFrequency === 'MONTHLY') premiumNum *= 12;
    if (formPaymentFrequency === 'HALF_YEARLY') premiumNum *= 2;

    const payload = {
      policy_type: formPolicyType,
      provider_name: formProvider.trim(),
      policy_number_masked: formPolicyNo.trim() || 'POL-XXXXXXXX',
      sum_insured: sumNum,
      premium_annual: premiumNum,
      renewal_date: formRenewalDate,
      covered_members: formCoveredMembers.trim() || 'Self',
      notes: formNotes.trim() || null,
    };

    if (user && !isDemoMode) {
      try {
        if (editingId) {
          const { error } = await supabase
            .from('insurance_policies')
            .update(payload)
            .eq('id', editingId)
            .eq('user_id', user.id);
          if (error) throw error;
          setToastMsg('Policy updated successfully.');
        } else {
          const { error } = await supabase
            .from('insurance_policies')
            .insert([{ ...payload, user_id: user.id }]);
          if (error) throw error;
          setToastMsg('New policy recorded in Smart Shield.');
        }
        await fetchUserPolicies(user.id);
      } catch (err: any) {
        console.error('Supabase error:', err);
        alert(`Failed to save policy: ${err.message || 'Database error'}`);
      }
    } else {
      // Local state fallback (Demo mode)
      if (editingId) {
        setPolicies((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
        );
        setToastMsg('Updated policy in preview.');
      } else {
        const newPolicy: InsurancePolicy = {
          id: `demo-${Date.now()}`,
          ...payload,
        };
        setPolicies((prev) => [newPolicy, ...prev]);
        setToastMsg('Policy added to preview.');
      }
    }

    setSubmitting(false);
    setModalOpen(false);
    resetForm();
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this insurance policy?')) return;

    if (user && !isDemoMode) {
      try {
        const { error } = await supabase
          .from('insurance_policies')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        if (error) throw error;
        await fetchUserPolicies(user.id);
        setToastMsg('Policy removed.');
      } catch (err: any) {
        alert(`Error deleting policy: ${err.message}`);
      }
    } else {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
      setToastMsg('Policy removed from preview.');
    }
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openEditModal = (p: InsurancePolicy) => {
    setEditingId(p.id);
    setFormPolicyType(p.policy_type);
    setFormProvider(p.provider_name);
    setFormPolicyNo(p.policy_number_masked);
    setFormSumInsured(String(p.sum_insured));
    setFormPremium(String(p.premium_annual));
    setFormPaymentFrequency('ANNUAL');
    setFormRenewalDate(p.renewal_date);
    setFormCoveredMembers(p.covered_members);
    setFormNotes(p.notes || '');
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormPolicyType('TERM_LIFE');
    setFormProvider('');
    setFormPolicyNo('');
    setFormSumInsured('');
    setFormPremium('');
    setFormPaymentFrequency('ANNUAL');
    setFormRenewalDate('2027-04-15');
    setFormCoveredMembers('Self');
    setFormNotes('');
  };

  const filteredPolicies = useMemo(() => {
    if (filterType === 'ALL') return policies;
    if (filterType === 'TERM') return policies.filter((p) => p.policy_type === 'TERM_LIFE');
    if (filterType === 'HEALTH') return policies.filter((p) => p.policy_type !== 'TERM_LIFE');
    return policies;
  }, [policies, filterType]);

  const formatINR = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '₹0';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const formatLakhCr = (val: number | undefined) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#111827] text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-[#10B981]" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Smart Insurance Shield
            </h1>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                DEMO PREVIEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Audit term-life coverage gaps, health floater adequacy, renewal calendar, and premium commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#10B981] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#059669] transition-all cursor-pointer"
          >
            <Plus size={16} /> Record Policy
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Term Life Cover */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Active Term Life Cover</span>
            <ShieldCheck size={16} className="text-[#10B981]" />
          </div>
          <div className="text-2xl font-black text-[#111827] font-mono">
            {formatLakhCr(currentTermCoverage)}
          </div>
          <p className="text-[11px] text-[#065F46] font-semibold">
            {termAdequacyRatio.toFixed(1)}% of Indicative 10× Target
          </p>
        </div>

        {/* Health Insurance Cover */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Comprehensive Health Cover</span>
            <ShieldCheck size={16} className="text-[#0284C7]" />
          </div>
          <div className="text-2xl font-black text-[#0284C7] font-mono">
            {formatLakhCr(currentHealthCoverage)}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Individual & Family Floater Protection
          </p>
        </div>

        {/* Total Annual Premium Outflow */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Total Annual Premiums</span>
            <CreditCard size={16} className="text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-black text-[#4F46E5] font-mono">
            {formatINR(totalAnnualPremium)}
          </div>
          <p className="text-[11px] text-[#6B7280] font-mono">
            ~{formatINR(Math.round(totalAnnualPremium / 12))}/mo allocation
          </p>
        </div>

        {/* Active Policies Count & Upcoming Renewal Alert */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Policies in Vault</span>
            <Building size={16} className="text-[#D97706]" />
          </div>
          <div className="text-2xl font-black text-[#111827] font-mono">
            {policies.length} Policies
          </div>
          <div className="text-[11px] text-[#D97706] font-semibold flex items-center gap-1">
            <Clock size={12} />
            {policies.filter((p) => getRenewalStatus(p.renewal_date).status === 'UPCOMING').length} due within 45 days
          </div>
        </div>
      </div>

      {/* Indicative Term Life Coverage Heuristic Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                INDICATIVE STARTING HEURISTIC
              </span>
              <span className="text-[10px] text-[#6B7280] font-mono">
                {heuristicMultiplier}× Income Multiplier
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#111827] mt-1">
              Term Life Adequacy & Protection Gap
            </h2>
            <p className="text-xs text-[#6B7280]">
              Calculated against your recorded annual inflow of <strong>{formatLakhCr(annualIncome)}</strong> (₹{(monthlyInflow / 1000).toFixed(0)}k/mo)
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#6B7280]">Indicative Need ({heuristicMultiplier}× Income)</span>
            <div className="text-2xl font-black text-[#111827] font-mono">
              {formatLakhCr(indicativeTermNeed)}
            </div>
          </div>
        </div>

        {/* Progress Bar & Gap Analysis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#374151]">
            <span className="font-semibold">
              Adequacy Ratio: <strong className="text-[#10B981]">{termAdequacyRatio.toFixed(1)}%</strong> Covered
            </span>
            {termCoverageGap > 0 ? (
              <span className="text-[#D97706] font-mono font-semibold flex items-center gap-1">
                <AlertCircle size={13} />
                Indicative Protection Gap: ~{formatLakhCr(termCoverageGap)}
              </span>
            ) : (
              <span className="text-[#059669] font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> Full Coverage Reached
              </span>
            )}
          </div>

          <div className="w-full bg-[#F3F4F6] h-3 rounded-full overflow-hidden border border-[#E5E7EB]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                termAdequacyRatio >= 100 ? 'bg-[#10B981]' : termAdequacyRatio >= 60 ? 'bg-[#D97706]' : 'bg-[#DC2626]'
              }`}
              style={{ width: `${termAdequacyRatio}%` }}
            />
          </div>
        </div>

        {/* Multiplier Adjustment Slider */}
        <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-[#6B7280]">
            Adjust Income Multiple Heuristic based on dependents & liabilities:
          </span>
          <div className="flex items-center gap-3">
            {[7, 10, 15, 20].map((m) => (
              <button
                key={m}
                onClick={() => setHeuristicMultiplier(m)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
                  heuristicMultiplier === m
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                {m}×
              </button>
            ))}
          </div>
        </div>

        {/* Plain Language Regulatory Disclaimer */}
        <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 pt-1">
          <HelpCircle size={14} className="text-[#10B981] shrink-0" />
          <span>
            <strong>Disclaimer:</strong> The income multiplier heuristic is an educational starting point, not universal or individualized insurance advisory. Actual adequacy depends on outstanding debts (e.g. home loans), children's education timelines, and existing liquid assets.
          </span>
        </div>
      </div>

      {/* Filter Tabs & Policies Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#10B981]" />
              Policy Cards & Renewal Schedule
            </h2>
            <span className="text-xs text-[#6B7280]">({filteredPolicies.length} policies)</span>
          </div>

          <div className="flex bg-[#F3F4F6] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'ALL' ? 'bg-[#10B981] text-white shadow-xs' : 'text-[#6B7280]'
              }`}
            >
              All Policies
            </button>
            <button
              onClick={() => setFilterType('TERM')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'TERM' ? 'bg-[#10B981] text-white shadow-xs' : 'text-[#6B7280]'
              }`}
            >
              Term Life
            </button>
            <button
              onClick={() => setFilterType('HEALTH')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'HEALTH' ? 'bg-[#10B981] text-white shadow-xs' : 'text-[#6B7280]'
              }`}
            >
              Health & Critical Care
            </button>
          </div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPolicies.length === 0 ? (
            <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#6B7280]">
              No insurance policies recorded under this category. Click "Record Policy" to add your active cover.
            </div>
          ) : (
            filteredPolicies.map((p) => {
              const renewalInfo = getRenewalStatus(p.renewal_date);
              const isTerm = p.policy_type === 'TERM_LIFE';

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 hover:border-[#D1D5DB] transition-all relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isTerm
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                          : 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]'
                      }`}>
                        {p.policy_type.replace(/_/g, ' ')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${renewalInfo.badgeClass}`}>
                          {renewalInfo.label}
                        </span>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 text-[#9CA3AF] hover:text-[#10B981] transition-colors"
                          title="Edit Policy"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
                          title="Delete Policy"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#111827] text-base">{p.provider_name}</h3>
                      <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                        Policy #{p.policy_number_masked}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E7EB] text-xs">
                    <div>
                      <span className="text-[#6B7280] text-[11px]">Sum Insured</span>
                      <p className="font-mono font-bold text-[#111827] text-sm">
                        {formatLakhCr(p.sum_insured)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#6B7280] text-[11px]">Annual Premium</span>
                      <p className="font-mono font-bold text-[#374151] text-sm">
                        {formatINR(p.premium_annual)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#6B7280] text-[11px] flex items-center gap-1">
                        <Users size={11} /> Covered Members
                      </span>
                      <p className="text-[#374151] text-xs font-medium truncate">
                        {p.covered_members}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#6B7280] text-[11px] flex items-center gap-1">
                        <Calendar size={11} /> Renewal Due Date
                      </span>
                      <p className="text-[#D97706] font-mono font-semibold text-xs">
                        {p.renewal_date}
                      </p>
                    </div>
                  </div>

                  {p.notes && (
                    <div className="text-[10px] text-[#9CA3AF] italic pt-1 border-t border-[#F3F4F6]">
                      Note: {p.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Record / Edit Policy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10B981]" />
                {editingId ? 'Edit Insurance Policy' : 'Record Insurance Policy'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitPolicy} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Policy Type */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Policy Category</label>
                  <select
                    value={formPolicyType}
                    onChange={(e) => setFormPolicyType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-semibold focus:outline-hidden focus:border-[#10B981]"
                  >
                    <option value="TERM_LIFE">Pure Term Life</option>
                    <option value="HEALTH_FAMILY_FLOATER">Health (Family Floater)</option>
                    <option value="HEALTH_INDIVIDUAL">Health (Individual)</option>
                    <option value="CRITICAL_ILLNESS">Critical Illness Rider</option>
                  </select>
                </div>

                {/* Insurer / Provider */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Insurer / Provider</label>
                  <input
                    type="text"
                    required
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="e.g. HDFC Life, Care Health"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] focus:outline-hidden focus:border-[#10B981]"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Policy Number */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Policy Number (Masked)</label>
                  <input
                    type="text"
                    value={formPolicyNo}
                    onChange={(e) => setFormPolicyNo(e.target.value)}
                    placeholder="e.g. POL-89214XXX"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>

                {/* Sum Insured */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Sum Insured (₹)</label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={formSumInsured}
                    onChange={(e) => setFormSumInsured(e.target.value)}
                    placeholder="e.g. 20000000 (2 Cr)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Premium Amount */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Premium Amount (₹)</label>
                  <input
                    type="number"
                    step={100}
                    required
                    value={formPremium}
                    onChange={(e) => setFormPremium(e.target.value)}
                    placeholder="e.g. 18500"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>

                {/* Payment Frequency */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Payment Frequency</label>
                  <select
                    value={formPaymentFrequency}
                    onChange={(e) => setFormPaymentFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-semibold focus:outline-hidden focus:border-[#10B981]"
                  >
                    <option value="ANNUAL">Annual (Lump Sum)</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="HALF_YEARLY">Half-Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Renewal Date */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Renewal Due Date</label>
                  <input
                    type="date"
                    required
                    value={formRenewalDate}
                    onChange={(e) => setFormRenewalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>

                {/* Covered Members */}
                <div>
                  <label className="text-[#6B7280] font-semibold block mb-1">Covered Members</label>
                  <input
                    type="text"
                    value={formCoveredMembers}
                    onChange={(e) => setFormCoveredMembers(e.target.value)}
                    placeholder="e.g. Self, Spouse, 1 Child"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>
              </div>

              {/* Policy Notes */}
              <div>
                <label className="text-[#6B7280] font-semibold block mb-1">Notes / Cashless Hospitals (Optional)</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Restoration benefit included, Apollo network"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-semibold hover:bg-[#F9FAFB] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Policy'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
