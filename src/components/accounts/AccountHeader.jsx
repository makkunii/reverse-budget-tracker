import React from 'react';
import { Wallet, Plus } from 'lucide-react';

export function AccountHeader({ accountCount, onAddAccount }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
      {/* Left Side: Branding & Stats */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Active Liquidity Pools</h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage your {accountCount} linked capital accounts and cash flows.
          </p>
        </div>
      </div>
      
      {/* Right Side: Action */}
      <button 
        onClick={onAddAccount} 
        className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <Plus size={14} /> Link Capital Account
      </button>
    </div>
  );
}