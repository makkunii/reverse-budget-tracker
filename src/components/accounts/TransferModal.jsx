import React, { useState } from 'react';
import { ArrowRightLeft, Landmark } from 'lucide-react';
import { Modal } from '../common/Modal';

export function TransferModal({ isOpen, onClose, onTransfer, accounts, symbol }) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sourceId && targetId && amount > 0) {
      onTransfer({ sourceAccountId: sourceId, targetAccountId: targetId, amount: parseFloat(amount) });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Execute Internal Transfer">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        
        {/* Source Account */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Source Pool</label>
          <select 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
            onChange={e => setSourceId(e.target.value)} 
            required
          >
            <option value="">Select source account...</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({symbol}{a.balance.toLocaleString()})</option>)}
          </select>
        </div>

        {/* Target Account */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Destination Pool</label>
          <select 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
            onChange={e => setTargetId(e.target.value)} 
            required
          >
            <option value="">Select destination account...</option>
            {accounts.filter(a => a.id !== sourceId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Landmark size={12} /> Transfer Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">{symbol}</span>
            <input 
              type="number" 
              step="any"
              placeholder="0.00" 
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              onChange={e => setAmount(e.target.value)} 
              required 
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
        >
          <ArrowRightLeft size={14} /> Execute Transfer
        </button>
      </form>
    </Modal>
  );
}