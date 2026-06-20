import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDebts } from "./debtsZustand";
import {
  ArrowLeft, ArrowDownLeft, ArrowUpRight, Pencil, Trash2,
  Wallet, Calendar, User, CreditCard, X, AlertTriangle,
} from "lucide-react";

export default function DebtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const debt = useDebts((state: any) => state.debt);
  const getDebtsById = useDebts((state: any) => state.getDebtsById);
  const deleteDebt = useDebts((state: any) => state.deleteDebt);
  const updateDebts = useDebts((state: any) => state.updateDebts);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => { if (id) getDebtsById(id); }, [id, getDebtsById]);

  const openEdit = () => {
    setFormData({
      contact_id: debt.contact_id || "",
      direction: debt.direction || "they_owe_me",
      amount: debt.amount || 0,
      currency: debt.currency || "USD",
      description: debt.description || "",
      due_date: debt.due_date ? debt.due_date.split("T")[0] : "",
      status: debt.status || "pending",
    });
    setIsEditing(true);
  };

  if (!debt) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const handleDelete = async () => {
    if (id) {
      await deleteDebt(id);
      navigate("/dashboard/debts");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateDebts(id, { ...formData, amount: Number(formData.amount) });
      setIsEditing(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isOwedToMe = debt.direction === "they_owe_me";
  const inputCls = "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150";
  const labelCls = "text-xs font-medium text-slate-500 mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95) translateY(8px);} to { opacity:1; transform:scale(1) translateY(0);} }
        .fade-up { animation: fadeUp 0.5s ease-out forwards; opacity:0; }
        .scale-in { animation: scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <button
        onClick={() => navigate("/dashboard/debts")}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors duration-150 mb-6 fade-up"
      >
        <ArrowLeft size={16} /> Back to Debts
      </button>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Hero card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 shadow-sm fade-up" style={{ animationDelay: "60ms" }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${isOwedToMe ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
                {isOwedToMe ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
              </div>
              <div>
                <p className={`text-xs font-medium ${isOwedToMe ? "text-emerald-600" : "text-indigo-600"}`}>
                  {isOwedToMe ? "They owe me" : "I owe them"}
                </p>
                <p className="text-sm text-slate-500">{debt.description || "No description"}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${debt.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {debt.status}
            </span>
          </div>

          <p className="text-4xl font-bold text-slate-900 tracking-tight mb-6">
            {debt.amount} <span className="text-lg font-medium text-slate-400">{debt.currency}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50 text-slate-400"><Calendar size={16} /></div>
              <div>
                <p className="text-xs text-slate-400">Due date</p>
                <p className="text-sm font-medium text-slate-900">{debt.due_date || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50 text-slate-400"><User size={16} /></div>
              <div>
                <p className="text-xs text-slate-400">Contact ID</p>
                <p className="text-sm font-medium text-slate-900">{debt.contact_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 fade-up" style={{ animationDelay: "120ms" }}>
          <button onClick={openEdit} className="group relative flex items-center justify-center gap-2 overflow-hidden bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-200 active:translate-y-0">
            <span className="absolute inset-0 bg-emerald-700 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
            <Pencil size={16} className="relative z-10" /> <span className="relative z-10">Edit Debt</span>
          </button>
          <button onClick={() => setIsDeleting(true)} className="group flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:bg-red-50 hover:-translate-y-0.5 active:translate-y-0">
            <Trash2 size={16} className="group-hover:animate-pulse" /> Delete Debt
          </button>
          <button onClick={() => navigate(`/dashboard/debt/${id}/payments`)} className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
            <CreditCard size={16} /> Manage Payments
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
          <form onSubmit={handleUpdate} onClick={(e) => e.stopPropagation()} className="scale-in bg-white w-full md:w-[420px] rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600"><Wallet size={18} /></div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Debt</h2>
              </div>
              <button type="button" onClick={() => setIsEditing(false)} className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div><label className={labelCls}>Contact ID</label><input className={inputCls} name="contact_id" value={formData.contact_id} onChange={handleChange} required /></div>
            <div>
              <label className={labelCls}>Direction</label>
              <select className={inputCls} name="direction" value={formData.direction} onChange={handleChange}>
                <option value="they_owe_me">They owe me</option>
                <option value="i_owe_them">I owe them</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Amount</label><input className={inputCls} name="amount" type="number" value={formData.amount} onChange={handleChange} required /></div>
              <div><label className={labelCls}>Currency</label><input className={inputCls} name="currency" value={formData.currency} onChange={handleChange} required /></div>
            </div>
            <div><label className={labelCls}>Description</label><input className={inputCls} name="description" value={formData.description} onChange={handleChange} required /></div>
            <div><label className={labelCls}>Due Date</label><input className={inputCls} name="due_date" type="date" value={formData.due_date} onChange={handleChange} required /></div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-150">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors duration-150">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleting(false)}>
          <div onClick={(e) => e.stopPropagation()} className="scale-in bg-white w-full md:w-[380px] rounded-2xl shadow-xl p-6 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-red-500 mx-auto mb-4">
              <AlertTriangle size={26} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1.5">Delete this debt?</h2>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently remove {debt.description || "this debt"} for {debt.amount} {debt.currency}. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleting(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-150 hover:shadow-md hover:shadow-red-200">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
