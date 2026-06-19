import { useState } from 'react';
import {
  Search, Globe, Sun, Moon, Monitor, ChevronDown,
  User, Settings, LifeBuoy, ShieldCheck, LogOut, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇺🇸' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'TJ', label: 'Тоҷикӣ', flag: '🇹🇯' },
];

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export default function Header({ userName = 'Ibrohim', userRole = 'Owner' }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<'lang' | 'account' | null>(null);
  const [accountTab, setAccountTab] = useState<'profile' | 'settings'>('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [language, setLanguage] = useState(LANGUAGES[0]);

  const toggleMenu = (menu: 'lang' | 'account') => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const applyTheme = (value: 'light' | 'dark' | 'auto') => {
    setTheme(value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  };

  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      {/* Click outside to close any open dropdown */}
      {openMenu && <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(null)} />}

      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search folders, contacts, debts…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Right side */}
        <div className="relative z-40 flex items-center gap-1.5 sm:gap-2">
          {/* Language dropdown */}
          <div className="relative">
            <button onClick={() => toggleMenu('lang')} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">
              <Globe className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">{language.code}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 sm:inline" />
            </button>

            {openMenu === 'lang' && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang); setOpenMenu(null); }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick theme toggle (light/dark) */}
          <button
            onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {theme === 'dark' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* Account button + panel */}
          <div className="relative">
            <button onClick={() => toggleMenu('account')} className="flex items-center gap-2 rounded-lg py-1.5 pl-1 pr-2 hover:bg-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-bold text-white">
                {firstLetter}
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:inline" />
            </button>

            {openMenu === 'account' && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                {/* Profile header */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-base font-bold text-white">
                    {firstLetter}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-400">{userRole}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-2">
                  <button
                    onClick={() => setAccountTab('profile')}
                    className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors ${
                      accountTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button
                    onClick={() => setAccountTab('settings')}
                    className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors ${
                      accountTab === 'settings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                </div>

                {/* Tab content */}
                {accountTab === 'profile' ? (
                  <div className="px-5 py-4">
                    <Link to="/dashboard/profile" className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <span className="flex items-center gap-2.5"><User className="h-4 w-4 text-slate-400" /> View profile</span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </Link>
                    <button className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-red-500 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="px-5 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Theme Mode</p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Monitor },
                      ] as const).map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => applyTheme(value)}
                          className={`flex flex-col items-center gap-2 rounded-xl border py-3 transition-all ${
                            theme === value ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${theme === value ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className={`text-xs font-medium ${theme === value ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="my-4 h-px bg-slate-100" />

                    <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <span className="flex items-center gap-2.5"><LifeBuoy className="h-4 w-4 text-slate-400" /> Support</span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </button>
                    <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <span className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-slate-400" /> Privacy Center</span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
