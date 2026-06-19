import { useEffect, useState } from 'react';
import useFolderStore from './foldersZustand';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Folder, FolderPlus, ArrowRight, X, Palette, Clock, Sparkles } from 'lucide-react';

const SWATCHES = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444'];

export default function Folders() {
  const { getFolders, postFolder, updateFolder, deleteFolder } = useFolderStore((state) => state);
  const [open, setOpen] = useState(false);
  const folders = useFolderStore((state) => state.folders);

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const selectedColor = watch('color');

  const onSubmit = (data: any) => {
    const newData = {
      id: Date.now(),
      name: data.name,
      color: data.color,
    };
    postFolder(newData);
    setOpen(false);
    reset();
  };

  const navigate = useNavigate();

  const handleViewFolder = (folder: any) => {
    navigate(`/dashboard/folder/${folder.id}`);
  };

  const closeDialog = () => {
    setOpen(false);
    reset();
  };

  const formatDate = (value: any) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-10">
      <style>{`
        @keyframes folders-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes folders-pop-in {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes folders-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .folder-card {
          animation: folders-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
        .dialog-backdrop { animation: folders-backdrop-in 0.2s ease-out; }
        .dialog-panel { animation: folders-pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        @media (prefers-reduced-motion: reduce) {
          .folder-card, .dialog-backdrop, .dialog-panel { animation: none; }
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-9">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-indigo-500 uppercase mb-1.5">
            DebtFlow / Workspace
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Folders</h1>
          <p className="text-sm text-slate-500 mt-1">Group your debts so payoff plans stay organized.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition-all duration-200 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <FolderPlus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          <span className="hidden sm:inline">Add Folder</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {folders.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Folder className="h-7 w-7 text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No folders yet</p>
          <p className="mt-1 text-sm text-slate-400">Create your first folder to start grouping debts.</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <FolderPlus className="h-4 w-4" />
            Add Folder
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {folders.map((folder: any, idx: number) => (
          <div
            key={folder.id}
            className="folder-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <span
              className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
              style={{ backgroundColor: folder.color || '#6366F1' }}
            />

            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: `${folder.color || '#6366F1'}1A` }}
              >
                <Folder className="h-5 w-5" style={{ color: folder.color || '#6366F1' }} />
              </div>
              <span
                className="h-2.5 w-2.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: folder.color || '#6366F1' }}
              />
            </div>

            <p className="mt-4 truncate text-base font-semibold text-slate-900">{folder.name}</p>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(folder.created_at)}</span>
            </div>

            <button
              onClick={() => handleViewFolder(folder)}
              className="mt-4 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              View Details
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Dialog */}
      {open && (
        <div className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="dialog-panel w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">New Folder</h2>
              </div>
              <button
                onClick={closeDialog}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-slate-500">Give it a name and a color to spot it at a glance.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Folder Name</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Credit Cards"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
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
                      className="h-7 w-7 rounded-full ring-offset-2 transition-transform duration-150 hover:scale-110"
                      style={{
                        backgroundColor: c,
                        boxShadow: selectedColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
                      }}
                    />
                  ))}
                </div>
                <input
                  {...register('color')}
                  placeholder="Or type a color (e.g. #6366F1)"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color.message as string}</p>}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Add Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
