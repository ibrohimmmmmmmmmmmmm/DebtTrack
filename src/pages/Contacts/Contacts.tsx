import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useContactsZustand from "./ContactsZustand";
import { UserRound, UserPlus, Mail, Phone, ArrowRight, X, Sparkles, StickyNote } from "lucide-react";

export default function Contacts() {
  const { contacts, getContacts, postContacts } = useContactsZustand((state) => state);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getContacts(id);
  }, [id]);

  const onSubmit = async (data: any) => {
    const newContact: any = { name: data.name, email: data.email, phone: data.phone, note: data.note };
    if (id) newContact.folder_id = id;
    await postContacts(newContact);
    reset();
    setOpen(false);
  };

  const initials = (name: string) =>
    name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="min-h-screen w-full px-6 py-8 sm:px-10 sm:py-10">
      <style>{`
        @keyframes ct-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ct-pop-in { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ct-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        .ct-card { animation: ct-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) backwards; }
        .ct-backdrop { animation: ct-backdrop-in 0.2s ease-out; }
        .ct-panel { animation: ct-pop-in 0.35s cubic-bezier(0.16,1,0.3,1); }
        @media (prefers-reduced-motion: reduce) { .ct-card, .ct-backdrop, .ct-panel { animation: none; } }
      `}</style>

      <div className="mb-9 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
            DebtFlow / Workspace
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Contacts</h1>
          <p className="mt-1 text-sm text-slate-500">People tied to this folder's debts.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="group flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0"
        >
          <UserPlus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          <span className="hidden sm:inline">Add Contact</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <UserRound className="h-7 w-7 text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No contacts yet</p>
          <p className="mt-1 text-sm text-slate-400">Add someone connected to this folder.</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contacts.map((contact: any, idx: number) => (
          <div
            key={contact.id}
            className="ct-card group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600 transition-transform duration-300 group-hover:scale-105">
                {initials(contact.name)}
              </div>
              <p className="truncate text-base font-semibold text-slate-900">{contact.name}</p>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{contact.email || "—"}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{contact.phone}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/dashboard/contact/${contact.id}`)}
              className="mt-4 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              View more
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="ct-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="ct-panel w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="mb-1 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">New Contact</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-slate-500">Save the details of someone tied to this folder.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <input {...register("name")} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              <input {...register("email")} placeholder="Email address" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              <input {...register("phone")} placeholder="Phone number" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              <div className="relative">
                <StickyNote className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-300" />
                <input {...register("note")} placeholder="Note (optional)" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pl-9 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25">
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
