import React from 'react';
import { Wallet, Plus, ArrowRightLeft } from 'lucide-react';

export function AccountHeader({ accountCount, onAddAccount, onOpenTransfer }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
      {/* Left Side: Branding & Stats */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Active Liquidity Pools</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Manage your {accountCount} linked capital accounts and cash flows.
          </p>
        </div>
      </div>
      
      {/* Right Side: Actions */}
      <div className="flex gap-2 w-full md:w-auto">
        {accountCount > 1 && (
          <button 
            onClick={onOpenTransfer} 
            className="flex-1 md:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRightLeft size={14} /> Transfer
          </button>
        )}
        <button 
          onClick={onAddAccount} 
          className="flex-1 md:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={14} /> Link Account
        </button>
      </div>
    </div>
  );
}