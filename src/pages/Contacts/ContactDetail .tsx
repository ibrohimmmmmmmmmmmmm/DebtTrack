import { ArrowLeft, CalendarClock, Clock, Mail, Pencil, Phone, Sparkles, StickyNote, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import useContactsZustand from './ContactsZustand'

export default function ContactDetail () {
    const {contacts, getContacts, updateContacts, deleteContacts} = useContactsZustand((state: any) => state)
    const [open,setOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, reset, setValue } = useForm();
    const onSubmit = (data: any) => {
    const updateContact = {
      id,
      ...data,
    };
    updateContacts(updateContact)
    reset();
    setOpen(false);
  };
    useEffect(() => {
      getContacts();
    }, []);

    const contact = contacts.find((c: any) => String(c.id) === id);

    const handleOpenEdit = () => {
  if (contact) {
    setValue("name", contact.name);
    setValue("email", contact.email);
    setValue("phone", contact.phone);
    setValue("note", contact.note);
  }

  setOpen(true);
};

const handleDelete = async () => {
    if (id) {
        await deleteContacts(id);
        navigate('/dashboard/contacts');
    }
};

const initials = (name: string) =>
  name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

const formatDate = (value: any) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-10">
      <style>{`
        @keyframes cd-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cd-pop-in { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cd-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cd-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .cd-section { animation: cd-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) backwards; }
        .cd-backdrop { animation: cd-backdrop-in 0.2s ease-out; }
        .cd-panel { animation: cd-pop-in 0.35s cubic-bezier(0.16,1,0.3,1); }
        .cd-glow { animation: cd-glow 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cd-section, .cd-backdrop, .cd-panel, .cd-glow { animation: none; } }
      `}</style>

      <button
        onClick={() => navigate('/dashboard/contacts')}
        className="cd-section mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contacts
      </button>

      {contact ? (
        <>
          <div className="cd-section relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" style={{ animationDelay: '60ms' }}>
            <div className="cd-glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600 sm:h-20 sm:w-20 sm:text-2xl">
                  {initials(contact.name)}
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
                    Contact Details
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{contact.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    {contact.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {contact.email}
                      </span>
                    )}
                    {contact.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:shrink-0">
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 active:translate-y-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="cd-section rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-3" style={{ animationDelay: '140ms' }}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                <StickyNote className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Note</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{contact.note || 'No note added.'}</p>
            </div>

            <div className="cd-section rounded-2xl border border-slate-200 bg-white p-5" style={{ animationDelay: '200ms' }}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created At</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(contact.created_at)}</p>
            </div>

            <div className="cd-section rounded-2xl border border-slate-200 bg-white p-5" style={{ animationDelay: '260ms' }}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                <CalendarClock className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated At</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(contact.updated_at)}</p>
            </div>
          </div>

          {open && (
            <div className="cd-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
              <div className="cd-panel w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20">
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Edit Contact</h2>
                  </div>
                  <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mb-5 text-sm text-slate-500">Update this contact's information.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  <input type="text" {...register("name")} placeholder='Name' className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  <input type="email" {...register("email")} placeholder='Email' className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  <input type="tel" {...register("phone")} placeholder='Phone' className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  <input type="text" {...register("note")} placeholder='Note' className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />

                  <div className="flex gap-2 pt-2">
                    <button type='button' onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type='submit' className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {confirmDelete && (
            <div className="cd-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
              <div className="cd-panel w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Delete this contact?</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  "{contact.name}" will be permanently removed. This can't be undone.
                </p>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                    Cancel
                  </button>
                  <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
            <p className="text-sm font-medium text-slate-400">Loading or contact not found…</p>
          </div>
        </div>
      )}
    </div>
  )
}
