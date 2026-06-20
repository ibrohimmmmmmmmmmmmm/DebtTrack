import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Inbox,
  Plus,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDebts } from "./debtsZustand";

function evaluateExpression(expr: string): number | null {
  const cleaned = expr.trim();
  if (!cleaned) return null;
  if (!/^[0-9+\-*/().\s]*$/.test(cleaned)) return null;
  try {
    const result = Function(`"use strict"; return (${cleaned})`)();
    return typeof result === "number" && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

export default function Debts() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const debts = useDebts((state) => state.debts);
  const getDebts = useDebts((state) => state.getDebts);
  const postDebts = useDebts((state) => state.postDebts);
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm();

  // Calculate the amount expression only when the user tabs/enters/clicks away.
  const calculateAmount = () => {
    const raw = getValues("amount");
    const result = evaluateExpression(raw || "");
    if (result !== null && String(raw).replace(/\s/g, "") !== String(result)) {
      setValue("amount", String(result), { shouldValidate: true });
    }
  };

  const onSubmit = (data: any) => {
    const newDebt = {
      contact_id: data.contact_id,
      direction: data.direction,
      amount: Number(evaluateExpression(data.amount) ?? data.amount),
      currency: data.currency,
      description: data.description,
      due_date: data.due_date,
    };
    postDebts(newDebt);
    reset();
    setOpen(false);
  };

  useEffect(() => {
    getDebts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUpMobile {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fade-up {
          animation: fadeUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .modal-overlay {
          animation: overlayIn 0.25s ease-out forwards;
        }
        .modal-panel {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 768px) {
          .modal-panel {
            animation: slideUpMobile 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-up" style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Debts</h1>
          <p className="text-sm text-slate-500 mt-1">Track what's owed, both ways.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all duration-200 hover:shadow-md hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          Add Debt
        </button>
      </div>

      {/* Debt list */}
      {debts?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {debts.map((debt: any, i: any) => {
            const isOwedToMe = debt.direction === "they_owe_me";
            return (
              <div
                key={debt.id}
                onClick={() => navigate(`/dashboard/debt/${debt.id}`)}
                className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                      isOwedToMe ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {isOwedToMe ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      debt.status === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {debt.status}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-1">{debt.description}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">
                  {debt.amount}{" "}
                  <span className="text-base font-medium text-slate-400">{debt.currency}</span>
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span
                    className={`text-xs font-medium ${
                      isOwedToMe ? "text-emerald-600" : "text-indigo-600"
                    }`}
                  >
                    {isOwedToMe ? "They owe me" : "I owe them"}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-emerald-600 group-hover:gap-1.5 transition-all duration-200">
                    View
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-24 fade-up">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 mb-4">
            <Inbox size={28} />
          </div>
          <p className="text-slate-900 font-medium">No debts yet</p>
          <p className="text-sm text-slate-500 mt-1">Add your first one to start tracking.</p>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm modal-overlay"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-panel bg-white w-full md:w-[440px] md:rounded-2xl rounded-t-3xl shadow-xl p-6 md:p-7"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Wallet size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Add Debt</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                  Contact ID
                </label>
                <input
                  placeholder="e.g. 1024"
                  {...register("contact_id", { required: "Contact ID is required" })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150"
                />
                {errors.contact_id && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.contact_id.message as string}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                  Direction
                </label>
                <select
                  {...register("direction")}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150 appearance-none bg-white"
                >
                  <option value="they_owe_me">They owe me</option>
                  <option value="i_owe_them">I owe them</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                    Amount
                  </label>
                  <input
                    placeholder="10+20"
                    {...register("amount", { required: "Amount is required" })}
                    onBlur={calculateAmount}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        calculateAmount();
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150"
                  />
                  {errors.amount && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.amount.message as string}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                    Currency
                  </label>
                  <input
                    placeholder="USD"
                    {...register("currency", { required: "Currency is required" })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150"
                  />
                  {errors.currency && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.currency.message as string}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                  Description
                </label>
                <input
                  placeholder="What's this for?"
                  {...register("description")}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                  Due date
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="date"
                    {...register("due_date")}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full shimmer-bg text-white font-medium text-sm py-3 rounded-xl mt-2 shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-300 transition-shadow duration-200 active:scale-[0.98]"
              >
                Create Debt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
