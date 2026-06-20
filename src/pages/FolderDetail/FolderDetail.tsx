import { useNavigate, useParams } from 'react-router-dom';
import useFolderStore from '../Folders/foldersZustand';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ArrowLeft, Folder, Pencil, Trash2, X, Sparkles, Clock, Hash, Palette } from 'lucide-react';

const SWATCHES = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444'];

export default function FolderDetail() {
  const navigate = useNavigate();
  const { updateFolder, deleteFolder } = useFolderStore((state: any) => state);
  const { register, handleSubmit, watch, setValue } = useForm();
  const [open, SetOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { id } = useParams();

  const folder = useFolderStore((state: any) =>
    state.folders.find((f: any) => String(f.id) === id)
  );

  const selectedColor = watch('color');

  const onSubmit = (data: any) => {
    updateFolder({
      id,
      name: data.name,
      color: data.color,
    });

    SetOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteFolder(id);
    navigate('/dashboard/folders');
  };

  const formatDate = (value: any) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (!folder) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
          <p className="text-sm font-medium text-slate-400">Loading folder…</p>
        </div>
      </div>
    );
  }

  const color = folder.color || '#6366F1';

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-10">
      <style>{`
        @keyframes fd-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fd-pop-in { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fd-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fd-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .fd-section { animation: fd-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) backwards; }
        .fd-backdrop { animation: fd-backdrop-in 0.2s ease-out; }
        .fd-panel { animation: fd-pop-in 0.35s cubic-bezier(0.16,1,0.3,1); }
        .fd-glow { animation: fd-glow 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fd-section, .fd-backdrop, .fd-panel, .fd-glow { animation: none; }
        }
      `}</style>

      <button
        onClick={() => navigate('/dashboard/folders')}
        className="fd-section mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Folders
      </button>

      <div
        className="fd-section relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        style={{ animationDelay: '60ms' }}
      >
        <div
          className="fd-glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: `${color}33` }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:h-20 sm:w-20"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Folder className="h-8 w-8 sm:h-9 sm:w-9" style={{ color }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-indigo-500 uppercase mb-1.5">
                Folder Details
              </p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">{folder.name}</h1>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ backgroundColor: color }} />
                <span className="text-xs font-medium text-slate-400">{color}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:shrink-0">
            <button
              onClick={() => SetOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-100 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="fd-section rounded-2xl border border-slate-200 bg-white p-5"
          style={{ animationDelay: '140ms' }}
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
            <Hash className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Folder ID</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-800">{folder.id}</p>
        </div>

        <div
          className="fd-section rounded-2xl border border-slate-200 bg-white p-5"
          style={{ animationDelay: '200ms' }}
        >
          <div
            className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}1A` }}
          >
            <Palette className="h-4 w-4" style={{ color }} />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Color</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{color}</p>
        </div>

        <div
          className="fd-section rounded-2xl border border-slate-200 bg-white p-5"
          style={{ animationDelay: '260ms' }}
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Created At</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(folder.created_at)}</p>
        </div>
      </div>

      {/* Edit dialog */}
      {open && (
        <div className="fd-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="fd-panel w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="mb-1 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Edit Folder</h2>
              </div>
              <button
                onClick={() => SetOpen(false)}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-slate-500">Update the name or color of this folder.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Folder Name</label>
                <input
                  {...register('name')}
                  defaultValue={folder.name}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Palette className="h-3.5 w-3.5" />
                  Color
                </label>
                <div className="mb-2 flex items-center gap-2">
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue('color', c)}
                      className="h-7 w-7 rounded-full transition-transform duration-150 hover:scale-110"
                      style={{
                        backgroundColor: c,
                        boxShadow:
                          (selectedColor ?? folder.color) === c
                            ? `0 0 0 2px white, 0 0 0 4px ${c}`
                            : undefined,
                      }}
                    />
                  ))}
                </div>
                <input
                  {...register('color')}
                  defaultValue={folder.color}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => SetOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fd-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="fd-panel w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Delete this folder?</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              "{folder.name}" will be permanently removed. This can't be undone.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
