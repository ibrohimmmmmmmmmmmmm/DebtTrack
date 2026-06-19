import React, { useEffect, useState } from 'react';
import { X, Pencil, Mail, User, CalendarDays, ShieldCheck, Wallet } from 'lucide-react';
import useProfileStore from './ProfileZustand';

export default function Profile() {
  const { profile, getProfile, updateProfile } = useProfileStore();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name || '', email: profile.email || '' });
    }
  }, [profile]);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 180);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    closeModal();
  };

  const initials = (profile?.name || '?')
    .trim()
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1E2A4A]">Profile</h1>
        <p className="text-sm text-[#8A93A6] mt-1">Manage your personal information and account details.</p>
      </div>

      {/* Banner card */}
      <div className="rounded-2xl bg-white border border-[#ECEEF3] shadow-[0_4px_20px_rgba(30,42,74,0.05)] overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-[#1E2A4A] to-[#2D3D66] relative">
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full">
            <ShieldCheck size={13} /> Verified
          </span>
        </div>

        <div className="px-6 mt-15 sm:px-8 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-2xl p-[3px] bg-[conic-gradient(#10B981_0%,#10B981_72%,#E5E7EB_72%,#E5E7EB_100%)] shrink-0">
                <div className="h-full w-full rounded-2xl bg-white p-[3px]">
                  <div className="h-full w-full rounded-2xl bg-[#1E2A4A] flex items-center justify-center text-white text-lg font-semibold">
                    {initials}
                  </div>
                </div>
              </div>
              <div className="pb-1">
                <h2 className="text-lg font-semibold text-[#1E2A4A] leading-tight">{profile?.name || 'Your name'}</h2>
                <p className="text-sm text-[#8A93A6]">{profile?.email || 'your@email.com'}</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#1E2A4A] hover:bg-[#27355E] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors active:scale-[0.98] sm:self-end"
            >
              <Pencil size={15} />
              Edit profile
            </button>
          </div>

          {/* Details grid */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DetailRow icon={<User size={16} />} label="Full name" value={profile?.name || '—'} />
            <DetailRow icon={<Mail size={16} />} label="Email address" value={profile?.email || '—'} />
            <DetailRow icon={<CalendarDays size={16} />} label="Member since" value={joined} />
          </div>
        </div>
      </div>

      {/* Secondary info card */}
      <div className="mt-5 rounded-2xl bg-white border border-[#ECEEF3] p-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
          <Wallet size={17} />
        </div>
        <p className="text-sm text-[#5B6478]">
          Your profile details are used across DebtFlow to personalize your dashboard and payoff plans.
        </p>
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={closeModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1E2A4A]/40 backdrop-blur-sm px-4 pb-4 sm:pb-0 transition-opacity duration-200 ${
            closing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 transition-all duration-200 ease-out ${
              closing ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-[modalIn_0.22s_ease-out]'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1E2A4A]">Edit profile</h2>
              <button
                onClick={closeModal}
                className="h-8 w-8 grid place-items-center rounded-full text-[#8A93A6] hover:bg-[#F1F3F7] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Full name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1E2A4A] outline-none focus:border-[#1E2A4A] transition-colors"
                />
              </Field>
              <Field label="Email address">
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1E2A4A] outline-none focus:border-[#1E2A4A] transition-colors"
                />
              </Field>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#1E2A4A] bg-[#F1F3F7] hover:bg-[#E7EAF0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-[#1E2A4A] hover:bg-[#27355E] disabled:opacity-60 transition-colors active:scale-[0.98]"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#ECEEF3]">
      <div className="h-8 w-8 grid place-items-center rounded-full bg-white text-[#1E2A4A] border border-[#ECEEF3] shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#8A93A6] leading-tight">{label}</p>
        <p className="text-sm text-[#1E2A4A] font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#8A93A6] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
