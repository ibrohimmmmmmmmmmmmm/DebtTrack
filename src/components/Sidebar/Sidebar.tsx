import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CreditCard,
  Users, FolderOpen, TrendingUp,
  ChevronRight, ChevronUp, LogOut, User,
} from "lucide-react";
import { axiosRequest } from "../../utils/axios";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Debts",     icon: CreditCard,       path: "/dashboard/debts" },
  { label: "Contacts",  icon: Users,             path: "/dashboard/contacts" },
  { label: "Folders",   icon: FolderOpen,        path: "/dashboard/folders" },
];

const HOVER_COLORS = ["#ECFDF5", "#EEF2FF", "#FEF3C7", "#FCE7F3", "#E0F2FE", "#F3E8FF"];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const name     = localStorage.getItem("userName") ?? "User";
  const role     = localStorage.getItem("userRole") ?? "Member";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  async function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) { navigate("/login"); return; }
    try {
      await axiosRequest.post("auth/logout", { refreshToken });
    } catch (_) {}
    localStorage.clear();
    navigate("/login");
  }

  function navTo(path: string) {
    setOpen(false);
    navigate(path);
  }

  function handleHover(path: string) {
    setHoveredPath(path);
    setHoverColor(HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)]);
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .popup-enter  { animation: slideUp 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }
        .nav-item     { transition: background-color 0.25s ease, color 0.15s, transform 0.12s; }
        .nav-item:hover { transform: translateX(2px); }
        .nav-icon     { transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.15s; }
        .nav-item:hover .nav-icon { transform: scale(1.08); }
        .user-card    { transition: background 0.15s, box-shadow 0.15s; }
        .chevron      { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <aside className="flex flex-col w-[240px] min-h-screen bg-white border-r border-gray-100/80 shadow-[2px_0_20px_rgba(0,0,0,0.04)]">

        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-gray-900">
            Debt<span className="text-emerald-500">Flow</span>
          </span>
        </div>

        {/* Section label */}
        <p className="px-5 mb-2 text-[10px] font-bold text-gray-300 uppercase tracking-[0.14em]">
          Main Menu
        </p>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ label, icon: Icon, path }) => {
            const active =
              path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(path);
            const isHovered = !active && hoveredPath === path;

            return (
              <button
                key={path}
                onClick={() => navTo(path)}
                onMouseEnter={() => handleHover(path)}
                onMouseLeave={() => setHoveredPath(null)}
                style={isHovered ? { backgroundColor: hoverColor ?? undefined } : undefined}
                className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  ${active ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:text-gray-800"}`}
              >
                <span className={`nav-icon w-8 h-8 rounded-lg flex items-center justify-center
                  ${active ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : "bg-gray-100 text-gray-400"}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">{label}</span>
                {active && (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-3 border-t border-gray-100 relative">
          {open && (
            <div className="popup-enter absolute bottom-[calc(100%-4px)] left-3 right-3 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden z-50">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors group">
                <span className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                  <LogOut className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 text-left">Logout</span>
              </button>

              <div className="h-px bg-gray-100 mx-4" />
              <button onClick={() => navTo("/dashboard/profile")}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group">
                <span className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                  <User className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 text-left">Profile</span>
              </button>
            </div>
          )}

          <button onClick={() => setOpen((p) => !p)}
            className={`user-card w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
              ${open
                ? "bg-linear-to-r from-emerald-50 to-white ring-1 ring-emerald-100 shadow-sm"
                : "hover:bg-gray-50"}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 transition-all
              ${open
                ? "bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200 scale-105"
                : "bg-linear-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-100"}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
              <p className="text-[11px] text-gray-400 font-medium">{role}</p>
            </div>
            <ChevronUp className={`chevron w-4 h-4 shrink-0 ${open ? "text-emerald-400 rotate-0" : "text-gray-300 rotate-180"}`} />
          </button>
        </div>
      </aside>
    </>
  );
}
