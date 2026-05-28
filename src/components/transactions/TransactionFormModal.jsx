import React, { useState } from 'react';
import { Plus, Landmark, Tag, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';

export function TransactionFormModal({ isOpen, onClose, onSave, accounts, symbol }) {
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !accountId) return;

    onSave({
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      accountId
    });

    // Reset and close
    setAmount('');
    setDescription('');
    setAccountId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Financial Activity">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        
        {/* Type Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
              type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            EXPENSE
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
              type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            INCOME
          </button>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <FileText size={12} /> Description
          </label>
          <input 
            type="text" 
            placeholder="e.g., Grocery Shopping, Monthly Salary" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Landmark size={12} /> Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">{symbol}</span>
            <input 
              type="number" 
              step="any"
              placeholder="0.00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Account Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Tag size={12} /> Source Account
          </label>
          <select 
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
          >
            <option value="">Select account...</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({symbol}{acc.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          className={`w-full py-4 rounded-2xl text-xs font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            type === 'income' 
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
              : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
          }`}
        >
          <Plus size={14} /> Log {type}
        </button>
      </form>
    </Modal>
  );
}