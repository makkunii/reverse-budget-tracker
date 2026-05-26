import React, { useState, useEffect } from 'react';
import { Plus, Save, Wallet, Building2, CreditCard } from 'lucide-react';

export function AccountForm({ onSaveAccount, onClose, symbol, editAccount = null }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Digital Wallet');

  useEffect(() => {
    if (editAccount) {
      setName(editAccount.name);
      setBalance(editAccount.balance.toString());
      setType(editAccount.type);
    } else {
      setName('');
      setBalance('');
      setType('Digital Wallet');
    }
  }, [editAccount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !balance) return;

    onSaveAccount({
      ...(editAccount && { id: editAccount.id }),
      name: name.trim(),
      balance: parseFloat(balance) || 0,
      type
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      {/* Account Name */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Name</label>
        <input 
          type="text" 
          placeholder="e.g., GCash, Maya, Bank Account" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>

      {/* Balance */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Available Balance</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">{symbol}</span>
          <input 
            type="number" 
            step="any" 
            placeholder="0.00" 
            value={balance} 
            onChange={e => setBalance(e.target.value)} 
            required
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Account Type */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account Category</label>
        <select
          value={type} 
          onChange={e => setType(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
        >
          <option value="Digital Wallet">Digital Wallet (e.g., GCash/Maya)</option>
          <option value="High-Yield Savings">High-Yield Savings</option>
          <option value="Traditional Bank">Traditional Bank Account</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button 
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
        >
          {editAccount ? (
            <>
              <Save size={14} /> Update Account
            </>
          ) : (
            <>
              <Plus size={14} /> Register Account
            </>
          )}
        </button>
      </div>
    </form>
  );
}