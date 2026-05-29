import React, { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Landmark } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PoolAuditLog } from './PoolAuditLog';

export function HistoryModal({ isOpen, onClose, account, onUpdateAccountFunds, currency, locale, symbol, size = "max-w-md" }) {
  const [amount, setAmount] = useState('');

  if (!account) return null;

  const handleAction = (action) => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    
    onUpdateAccountFunds({ accountId: account.id, amount: parsedAmount, action });
    setAmount('');
  };

  return (
    <Modal size={size} isOpen={isOpen} onClose={onClose} title={`${account.name} Ledger`}>
      <div className="space-y-6 pt-2">
        {/* Transaction Controls */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Landmark size={12} /> Transaction Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm">{symbol}</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleAction('deposit')} 
            disabled={!amount || amount <= 0}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <ArrowDownToLine size={14} /> Inject
          </button>
          <button 
            onClick={() => handleAction('withdraw')} 
            disabled={!amount || amount <= 0}
            className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-40 text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10"
          >
            <ArrowUpFromLine size={14} /> Withdraw
          </button>
        </div>

        {/* History Log */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <h5 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">Transaction History</h5>
          <div className="max-h-[250px] overflow-y-auto pr-1">
            <PoolAuditLog logs={account.transactionLogs} currency={currency} locale={locale} />
          </div>
        </div>
      </div>
    </Modal>
  );
}