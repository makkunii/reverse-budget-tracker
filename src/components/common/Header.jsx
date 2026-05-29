import React from 'react';
import { Wallet, TrendingUp, Scale, Settings } from 'lucide-react';

export function Header({ 
  totalNetWorth, 
  currentCurrency, 
  currentLocale, 
  onOpenSettings
}) {
  return (
    <header className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Title Area */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Scale size={20} className="text-indigo-600 dark:text-indigo-400" /> Pensus
          </h1>
          <span className="hidden md:block text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
            Reverse Budget Engine
          </span>
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-1.5 flex items-center gap-1.5">
          <TrendingUp size={12} /> Allocation workflow operational.
        </p>
      </div>

      {/* Control Area */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Net Worth Display */}
        <div className="bg-slate-900 dark:bg-indigo-600 text-white rounded-3xl px-6 py-4 flex items-center gap-4 flex-1 md:flex-none shadow-lg shadow-slate-900/10 dark:shadow-indigo-950/20">
          <div className="p-2 bg-slate-800 dark:bg-indigo-700 rounded-xl text-indigo-400 dark:text-indigo-200">
            <Wallet size={18} />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 dark:text-indigo-200/70 uppercase tracking-wider block">Asset Base</span>
            <span className="text-lg font-black font-mono text-white">
              {totalNetWorth.toLocaleString(currentLocale, { 
                style: 'currency', 
                currency: currentCurrency, 
                minimumFractionDigits: 0 
              })}
            </span>
          </div>
        </div>

        <button 
          onClick={onOpenSettings}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-200 dark:hover:border-slate-600 rounded-3xl p-5 transition-all outline-none"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}