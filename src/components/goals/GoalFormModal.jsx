import React, { useState, useEffect } from 'react';
import { Target, Landmark, Tag, Image as ImageIcon } from 'lucide-react';

export function GoalFormModal({ isOpen, onClose, onSave, categories = [], symbol, editGoal = null }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title || '');
      setTarget(editGoal.targetAmount ? editGoal.targetAmount.toString() : '');
      setCategoryId(editGoal.categoryId || '');
      setImageUrl(editGoal.imageUrl || '');
    } else {
      setTitle('');
      setTarget('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setImageUrl('');
    }
  }, [editGoal, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !target) return;

    // Package the payload safely back up to the parent save handler
    onSave({
      ...(editGoal?.id && { id: editGoal.id }),
      title: title.trim(),
      targetAmount: parseFloat(target) || 0,
      categoryId: categoryId || null,
      imageUrl: imageUrl.trim()
    });
    onClose();
  };

  return (
    <div className="space-y-8">
      {/* Live Preview Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
        <label className="text-[9px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Card Preview</label>
        
        <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-end p-4">
          {imageUrl && (
            <div className="absolute inset-0 z-0">
              <img 
                src={imageUrl} 
                alt="preview" 
                className="w-full h-full object-cover" 
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
            </div>
          )}

          <div className="relative z-10">
            <h4 className={`text-xs font-black truncate ${imageUrl ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {title || 'Milestone Name'}
            </h4>
            <p className={`text-[10px] font-bold mt-0.5 ${imageUrl ? 'text-white/70' : 'text-slate-400'}`}>
              {symbol}{parseFloat(target) ? parseFloat(target).toLocaleString() : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Target size={12} /> Milestone Name
          </label>
          <input 
            type="text"
            placeholder="e.g., MacBook Pro Fund"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <ImageIcon size={12} /> Image URL
          </label>
          <input 
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Landmark size={12} /> Target Amount
            </label>
            <input 
              type="number"
              step="any"
              placeholder="0.00"
              value={target}
              onChange={e => setTarget(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Tag size={12} /> Allocation Bucket
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold outline-none cursor-pointer"
            >
              <option value="">Uncategorized</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-slate-900/10 dark:shadow-indigo-600/20"
        >
          {editGoal ? 'Save Modifications' : 'Launch Target Milestone'}
        </button>
      </form>
    </div>
  );
}