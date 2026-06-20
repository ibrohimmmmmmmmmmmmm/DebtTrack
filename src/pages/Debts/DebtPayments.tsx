import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDebts } from "./debtsZustand";
import { ArrowLeft, Plus, Receipt, Wallet, Clock, Inbox } from "lucide-react";

export default function DebtPayments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const payments = useDebts((state: any) => state.payments);
  const getPayments = useDebts((state: any) => state.getPayments);
  const postPayment = useDebts((state: any) => state.postPayment);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => { if (id) getPayments(id); }, [id, getPayments]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && amount) {
      await postPayment(id, { amount: Number(amount), note, paid_at: new Date().toISOString() });
      setAmount("");
      setNote("");
    }
  };

  const total = payments?.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0) || 0;
  const inputCls = "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-150";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        @keyframes popIn { from { opacity:0; transform:scale(0.96);} to { opacity:1; transform:scale(1);} }
        .fade-up { animation: fadeUp 0.5s ease-out forwards; opacity:0; }
        .pop-in { animation: popIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
      `}</style>

      <button
        onClick={() => navigate(`/dashboard/debt/${id}`)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors duration-150 mb-6 fade-up"
      >
        <ArrowLeft size={16} /> Back to Debt Detail
      </button>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Add payment form */}
        <div className="md:col-span-1 fade-up" style={{ animationDelay: "60ms" }}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet size={18} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Add Payment</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5">Total paid so far: <span className="font-semibold text-emerald-600">{total}</span></p>

            <form onSubmit={handleAddPayment} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Amount</label>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Note</label>
                <input type="text" placeholder="Optional note" value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-200 active:translate-y-0"
              >
                <Plus size={16} /> Add Payment
              </button>
            </form>
          </div>
        </div>

        {/* Payment history */}
        <div className="md:col-span-2 fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
              <Receipt size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
          </div>

          {(!payments || payments.length === 0) ? (
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center py-16">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 mb-3">
                <Inbox size={24} />
              </div>
              <p className="text-slate-900 font-medium">No payments yet</p>
              <p className="text-sm text-slate-500 mt-1">Payments you add will show up here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment: any, i: number) => (
                <div
                  key={payment.id}
                  className="pop-in bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-semibold text-sm shrink-0">
                      {payment.amount}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payment.note || "Payment"}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Clock size={12} />
                        {new Date(payment.paid_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
