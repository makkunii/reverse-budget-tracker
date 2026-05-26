import React from 'react';
import { ArrowRight, Wallet } from 'lucide-react';

export function DashboardHeader({ onOpenIncomeModal, netWorth, currency, locale, symbol }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Financial Ledger</h2>
          <p className="text-xs text-slate-400 font-medium">Review your income flows and distribution history.</p>
        </div>
      </div>
      
      <button 
        onClick={onOpenIncomeModal}
        className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <ArrowRight size={14} /> Process New Income
      </button>
    </div>
  );
}