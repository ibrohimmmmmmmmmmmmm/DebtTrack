import { useEffect } from "react";
import useDashboard from "./dashboardZustand";
import {
  Wallet, ArrowDownCircle, ArrowUpCircle, Users,
  Clock, CheckCircle2, Hourglass, Layers, CalendarClock,
} from "lucide-react";

export default function Dashboard() {
  const { dashboard, getDashboard } = useDashboard((state) => state);

  useEffect(() => {
    getDashboard();
  }, []);

  const fmt = (n: number) => `${n.toLocaleString()} TJS`;

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600",
    partial: "bg-indigo-50 text-indigo-600",
    paid: "bg-emerald-50 text-emerald-600",
  };

  if (!dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-500" />
          <p className="text-sm font-medium text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes db-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes db-grow-x { from { width: 0%; } to { width: var(--target-width); } }
        @keyframes db-draw { from { stroke-dashoffset: var(--circumference); } to { stroke-dashoffset: var(--offset); } }
        .db-card { animation: db-fade-up 0.45s cubic-bezier(0.16,1,0.3,1) backwards; }
        .db-bar { animation: db-grow-x 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s backwards; }
        .db-ring { animation: db-draw 1s cubic-bezier(0.16,1,0.3,1) 0.3s backwards; }
      `}</style>

      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Dashboard</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="db-card rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Net Balance</p>
          </div>
          <p className={`mt-5 text-3xl font-extrabold ${dashboard.outstanding.net_balance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {fmt(dashboard.outstanding.net_balance)}
          </p>
        </div>

        <div className="db-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-100" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <ArrowDownCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Owes Me</p>
          </div>
          <p className="mt-5 text-3xl font-extrabold text-emerald-600">{fmt(dashboard.outstanding.they_owe_me)}</p>
        </div>

        <div className="db-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-100" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <ArrowUpCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-gray-500">I Owe</p>
          </div>
          <p className="mt-5 text-3xl font-extrabold text-red-500">{fmt(dashboard.outstanding.i_owe_them)}</p>
        </div>
      </div>

      {/* Visual breakdown: balance split + status donut, built from real numbers */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Owes me vs I owe — animated split bar */}
        <div className="db-card rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 lg:col-span-2" style={{ animationDelay: "240ms" }}>
          <h2 className="mb-5 text-base font-bold text-gray-900">Balance Breakdown</h2>
          {(() => {
            const me = dashboard.outstanding.they_owe_me;
            const them = dashboard.outstanding.i_owe_them;
            const total = me + them;
            const mePct = total > 0 ? (me / total) * 100 : 50;
            const themPct = total > 0 ? (them / total) * 100 : 50;
            return (
              <>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="db-bar h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    style={{ ["--target-width" as any]: `${mePct}%` }}
                  />
                  <div
                    className="db-bar h-full bg-gradient-to-r from-red-400 to-red-500"
                    style={{ ["--target-width" as any]: `${themPct}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm text-gray-500">Owed to me</span>
                    <span className="text-sm font-bold text-gray-800">{fmt(me)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-500">I owe</span>
                    <span className="text-sm font-bold text-gray-800">{fmt(them)}</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Status distribution — animated donut */}
        <div className="db-card rounded-2xl border border-gray-100 bg-white p-5 sm:p-6" style={{ animationDelay: "300ms" }}>
          <h2 className="mb-4 text-base font-bold text-gray-900">Debt Status</h2>
          {(() => {
            const { pending, partial, paid } = dashboard.counts;
            const total = pending + partial + paid || 1;
            const r = 42;
            const circumference = 2 * Math.PI * r;
            const segments = [
              { value: pending, color: "#F59E0B" },
              { value: partial, color: "#6366F1" },
              { value: paid, color: "#10B981" },
            ];
            let offsetAcc = 0;
            return (
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90 shrink-0">
                  <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  {segments.map((seg, i) => {
                    const len = (seg.value / total) * circumference;
                    const dasharray = `${len} ${circumference - len}`;
                    const dashoffset = -offsetAcc;
                    offsetAcc += len;
                    return (
                      <circle
                        key={i}
                        cx="50" cy="50" r={r} fill="none"
                        stroke={seg.color} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={dasharray}
                        strokeDashoffset={dashoffset}
                        className="db-ring"
                        style={{ ["--circumference" as any]: circumference, ["--offset" as any]: dashoffset }}
                      />
                    );
                  })}
                </svg>
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs text-gray-500"><span className="h-2 w-2 rounded-full bg-amber-500" /> Pending — {dashboard.counts.pending}</p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Partial — {dashboard.counts.partial}</p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Paid — {dashboard.counts.paid}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Status counts strip */}
      <div className="db-card mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ animationDelay: "220ms" }}>
        {[
          { label: "Pending", value: dashboard.counts.pending, icon: Hourglass, tint: "text-amber-500 bg-amber-50" },
          { label: "Partial", value: dashboard.counts.partial, icon: Layers, tint: "text-indigo-500 bg-indigo-50" },
          { label: "Paid", value: dashboard.counts.paid, icon: CheckCircle2, tint: "text-emerald-500 bg-emerald-50" },
          { label: "Contacts", value: dashboard.contacts_count, icon: Users, tint: "text-sky-500 bg-sky-50" },
        ].map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-lg font-bold text-gray-800 leading-none">{value}</p>
              <p className="text-xs font-medium text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming due */}
      <div className="db-card mt-6 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6" style={{ animationDelay: "280ms" }}>
        <div className="mb-4 flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-bold text-gray-900">Upcoming Due</h2>
        </div>

        {dashboard.upcoming_due.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock className="mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm font-medium text-gray-400">No upcoming dues right now</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dashboard.upcoming_due.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    item.direction === "they_owe_me" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                  }`}>
                    {item.contact_name?.charAt(0).toUpperCase() || "?"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.contact_name}</p>
                    <p className="text-xs text-gray-400">Due {item.due_date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${item.direction === "they_owe_me" ? "text-emerald-600" : "text-red-500"}`}>
                    {item.amount.toLocaleString()} {item.currency}
                  </p>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[item.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
