import React, { useState, useEffect } from 'react';
import { Plus, Save, Image as ImageIcon, Target, Landmark, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export function AccountForm({ onSaveAccount, onClose, symbol, currency, locale, editAccount = null }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Digital Wallet');
  const [interestRate, setInterestRate] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editAccount) {
      setName(editAccount.name);
      setBalance(editAccount.balance.toString());
      setType(editAccount.type);
      setInterestRate(editAccount.interestRate?.toString() || '');
      setFrequency(editAccount.frequency || 'Monthly');
      setImageUrl(editAccount.imageUrl || '');
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
      imageUrl,
      ...(type === 'High-Yield Savings' && {
        interestRate: parseFloat(interestRate) || 0,
        frequency
      })
    });
    onClose();
  };

  return (
    <div className="space-y-8">
      {/* Live Preview Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
        <label className="text-[9px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Card Preview</label>
        <div className="relative h-32 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-end p-4">
          {imageUrl && (
            <div className="absolute inset-0 z-0">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
            </div>
          )}
          <div className="relative z-10">
            <h4 className={`text-xs font-black truncate ${imageUrl ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {name || 'Account Name'}
            </h4>
            <p className={`text-[10px] font-bold mt-0.5 ${imageUrl ? 'text-white/70' : 'text-slate-400'}`}>
              {formatCurrency(parseFloat(balance) || 0, currency, locale)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <ImageIcon size={12} /> Image URL (Optional)
          </label>
          <input 
            type="url" 
            placeholder="https://example.com/image.jpg" 
            value={imageUrl} 
            onChange={e => setImageUrl(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Target size={12} /> Account Name
          </label>
          <input 
            type="text" 
            placeholder="e.g., GCash, Maya, Bank" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Landmark size={12} /> Available Balance
          </label>
          <input 
            type="number" 
            step="any" 
            placeholder="0.00" 
            value={balance} 
            onChange={e => setBalance(e.target.value)} 
            required
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Tag size={12} /> Account Category
          </label>
          <select
            value={type} 
            onChange={e => setType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold cursor-pointer outline-none"
          >
            <option value="Digital Wallet">Digital Wallet</option>
            <option value="High-Yield Savings">High-Yield Savings</option>
            <option value="Traditional Bank">Traditional Bank Account</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

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

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl text-xs transition-all">Cancel</button>
          <button type="submit" className="flex-1 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all">
            {editAccount ? <><Save size={14} /> Update Account</> : <><Plus size={14} /> Register Account</>}
          </button>
        </div>
      </form>
    </div>
  );
}