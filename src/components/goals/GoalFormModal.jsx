import React, { useState, useEffect } from 'react';
import { Target, Landmark, Tag } from 'lucide-react';

export function GoalFormModal({ isOpen, onClose, onSave, categories, symbol, editGoal = null }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title);
      setTarget(editGoal.targetAmount.toString());
      setCategoryId(editGoal.categoryId || '');
    } else {
      setTitle('');
      setTarget('');
      setCategoryId(categories[0]?.id || '');
    }
  }, [editGoal, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !target) return;

    const goalData = {
      title: title.trim(),
      targetAmount: parseFloat(target) || 0,
      categoryId
    };

    if (editGoal?.id) {
      goalData.id = editGoal.id;
    }

    onSave(goalData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Title */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
          <Target size={12} /> Milestone Name
        </label>
        <input 
          type="text"
          placeholder="e.g., MacBook Pro Fund"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>

      {/* Target Amount */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
          <Landmark size={12} /> Target Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">{symbol}</span>
          <input 
            type="number"
            step="any"
            placeholder="0.00"
            value={target}
            onChange={e => setTarget(e.target.value)}
            required
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
          <Tag size={12} /> Allocation Bucket
        </label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
        >
          <option value="">Uncategorized</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-slate-900/10"
      >
        {editGoal ? 'Save Modifications' : 'Launch Target Milestone'}
      </button>
    </form>
  );
}