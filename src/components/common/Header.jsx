import React from 'react';
import { Wallet, Globe, TrendingUp, Scale } from 'lucide-react';

export function Header({ 
  totalNetWorth, 
  currentCurrency, 
  currentLocale, 
  currencies = [], 
  onCurrencyChange 
}) {
  return (
    <header className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      {/* Title Area */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale size={20} className="text-indigo-600" /> Pensus
          </h1>
          <span className="hidden md:block text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            Reverse Budget Engine
          </span>
        </div>
        <p className="text-slate-400 text-xs font-bold mt-1.5 flex items-center gap-1.5">
          <TrendingUp size={12} /> Allocation workflow operational.
        </p>
      </div>

      {/* Control Area */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Net Worth Display */}
        <div className="bg-slate-900 text-white rounded-3xl px-6 py-4 flex items-center gap-4 flex-1 md:flex-none shadow-lg shadow-slate-900/10">
          <div className="p-2 bg-slate-800 rounded-xl text-indigo-400">
            <Wallet size={18} />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Asset Base</span>
            <span className="text-lg font-black font-mono text-white">
              {totalNetWorth.toLocaleString(currentLocale, { 
                style: 'currency', 
                currency: currentCurrency, 
                minimumFractionDigits: 0 
              })}
            </span>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <select 
            value={currentCurrency} 
            onChange={e => onCurrencyChange(e.target.value)} 
            className="appearance-none bg-slate-50 border border-slate-100 text-slate-900 rounded-3xl pl-9 pr-8 py-4 text-xs font-black focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer transition-all h-[64px]"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}