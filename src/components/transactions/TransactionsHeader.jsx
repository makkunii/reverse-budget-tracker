import React from 'react';
import { Plus, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export function TransactionsHeader({ 
  onOpenLogTransaction, stats, period, setPeriod, 
  selectedDate, setSelectedDate, month, setMonth, 
  year, setYear, isExpanded, setIsExpanded,
  currency, locale
}) {
  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex justify-between items-center p-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ledger</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Financial overview & activity</p>
        </div>
        <button 
          onClick={onOpenLogTransaction}
          className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Log
        </button>
      </div>

      {/* Analytics Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Calendar size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Financial Insights</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white capitalize">{period} View</p>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="text-slate-400" size={18} /> : <ChevronDown className="text-slate-400" size={18} />}
        </button>

        {isExpanded && (
          <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-4">
            {/* Control Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['daily', 'monthly', 'yearly', 'custom'].map((p) => (
                <button 
                  key={p} onClick={() => setPeriod(p)}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${period === p ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Selectors */}
            {(period === 'monthly' || period === 'yearly' || period === 'custom') && (
              <div className="grid grid-cols-2 gap-2">
                {period === 'monthly' && (
                  <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="w-full p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                )}
                {(period === 'monthly' || period === 'yearly') && (
                  <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="w-full p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    {[0, 1, 2, 3, 4].map(i => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                  </select>
                )}
                {period === 'custom' && (
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                )}
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="sm:col-span-2">
                <Metric label="Net Balance" value={stats.net} color="text-slate-900 dark:text-white" currency={currency} locale={locale} />
              </div>
              <Metric label="Total Income" value={stats.income} color="text-emerald-600 dark:text-emerald-400" currency={currency} locale={locale} />
              <Metric label="Total Expense" value={stats.expense} color="text-rose-600 dark:text-rose-400" currency={currency} locale={locale} />
              <Metric label="Avg Income" value={stats.avgIncome} color="text-emerald-600 dark:text-emerald-400" currency={currency} locale={locale} />
              <Metric label="Avg Expense" value={stats.avgExpense} color="text-rose-600 dark:text-rose-400" currency={currency} locale={locale} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, color, currency, locale }) {
  const safeCurrency = currency || 'PHP';
  const safeLocale = locale || 'en-PH';
  
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-black tracking-tight ${color}`}>
        {new Intl.NumberFormat(safeLocale, { 
          style: 'currency', 
          currency: safeCurrency 
        }).format(value || 0)}
      </p>
    </div>
  );
}