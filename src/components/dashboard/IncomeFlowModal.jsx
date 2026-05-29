import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, Target } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export function IncomeFlowModal({ isOpen, onClose, accounts, goals, onCommitPayday, currency, locale, symbol }) {
  const [selectedAcc, setSelectedAcc] = useState('');
  const [income, setIncome] = useState('');
  const [allocations, setAllocations] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (accounts.length > 0 && !selectedAcc) {
        setSelectedAcc(accounts[0].id);
      }
      setAllocations({});
      setIncome('');
    }
  }, [isOpen, accounts]);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const incomeNum = parseFloat(income) || 0;
  const safeToSpend = Math.max(incomeNum - totalAllocated, 0);

  const handleExecute = (e) => {
    e.preventDefault();
    if (!selectedAcc || incomeNum <= 0) return;

    onCommitPayday({ 
      accountId: selectedAcc, 
      income: incomeNum, 
      allocations, 
      safeToSpend 
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Income Flow">
      <form onSubmit={handleExecute} className="space-y-6 pt-2">
        
        {/* Account Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Wallet size={12} /> Destination Account
          </label>
          <select 
            value={selectedAcc} 
            onChange={e => setSelectedAcc(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          >
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <ArrowDownCircle size={12} /> Total Income Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm">{symbol}</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={income} 
              onChange={e => setIncome(e.target.value)} 
              required 
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-lg font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
            />
          </div>
        </div>

        {/* Allocation Matrix */}
        {goals.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Target size={12} /> Target Allocations
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {goals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[50%]">{goal.title}</span>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={allocations[goal.id] || ''} 
                    onChange={(e) => setAllocations(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-mono font-bold text-right text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Summary */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 dark:border-slate-700 space-y-1 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400">Safe to Spend:</span>
            <span className="font-mono text-emerald-400 text-lg font-black">
              {formatCurrency(safeToSpend, currency, locale)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={incomeNum <= 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          Finalize Execution
        </button>
      </form>
    </Modal>
  );
}