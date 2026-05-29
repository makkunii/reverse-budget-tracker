import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';

export function AccountForm({ onSaveAccount, onClose, symbol, editAccount = null }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Digital Wallet');
  const [interestRate, setInterestRate] = useState('');
  const [frequency, setFrequency] = useState('Monthly');

  useEffect(() => {
    if (editAccount) {
      setName(editAccount.name);
      setBalance(editAccount.balance.toString());
      setType(editAccount.type);
      setInterestRate(editAccount.interestRate?.toString() || '');
      setFrequency(editAccount.frequency || 'Monthly');
    }
  }, [editAccount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !balance) return;

    onSaveAccount({
      ...(editAccount && { id: editAccount.id }),
      name: name.trim(),
      balance: parseFloat(balance) || 0,
      type,
      ...(type === 'High-Yield Savings' && {
        interestRate: parseFloat(interestRate) || 0,
        frequency
      })
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      {/* Account Name */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Account Name</label>
        <input 
          type="text" 
          placeholder="e.g., GCash, Maya, Bank Account" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>

      {/* Balance */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Available Balance</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm">{symbol}</span>
          <input 
            type="number" 
            step="any" 
            placeholder="0.00" 
            value={balance} 
            onChange={e => setBalance(e.target.value)} 
            required
            className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Account Category</label>
        <select
          value={type} 
          onChange={e => setType(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold cursor-pointer outline-none"
        >
          <option value="Digital Wallet">Digital Wallet</option>
          <option value="High-Yield Savings">High-Yield Savings</option>
          <option value="Traditional Bank">Traditional Bank Account</option>
          <option value="Traditional Bank">Cash</option>
        </select>
      </div>

      {/* Conditional Interest Fields */}
      {type === 'High-Yield Savings' && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Interest (%)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00"
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Frequency</label>
            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold outline-none cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl text-xs transition-all">Cancel</button>
        <button type="submit" className="flex-1 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all">
          {editAccount ? <><Save size={14} /> Update Account</> : <><Plus size={14} /> Register Account</>}
        </button>
      </div>
    </form>
  );
}