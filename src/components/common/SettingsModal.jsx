import React, { useState } from 'react';
import { Settings, Globe, ShieldCheck, Download, Upload, Trash2, RefreshCcw, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';

export function SettingsModal({ 
  isOpen, onClose, currency, currencies, onCurrencyChange, 
  appState, setAppState, isDark, onToggleTheme 
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Helper to show temporary feedback
  const showStatus = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // 1. Export Backup
  const handleExport = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pensus-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // 2. Import Backup
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setAppState(importedData);
        showStatus('Data restored successfully!');
      } catch (err) {
        showStatus('Error: Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="App Settings">
      <div className="space-y-8">
        
        {/* Status Feedback Message */}
        {statusMessage && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-[10px] font-black uppercase">
            <CheckCircle size={14} /> {statusMessage}
          </div>
        )}
        
        {/* Currency Setting */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} /> Preferred Currency
          </label>
          <select 
            value={currency} 
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none transition-colors cursor-pointer"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>

        {/* Data Management */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Data Management
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleExport} className="flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 p-3 rounded-2xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-all cursor-pointer">
              <Download size={14} /> Export Data
            </button>
            <label className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-3 rounded-2xl text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <Upload size={14} /> Import Data
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
            <button 
              onClick={() => {
                setAppState(prev => ({
                  ...prev,
                  categories: [
                    { id: 'cat-1', name: 'Emergency Fund', color: '#f43f5e' },
                    { id: 'cat-2', name: 'Investments', color: '#6366f1' },
                    { id: 'cat-3', name: 'Big Purchases', color: '#f59e0b' }
                  ]
                }));
                showStatus('Categories reset to defaults.');
              }}
              className="col-span-2 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-3 rounded-2xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <RefreshCcw size={14} /> Reset Categories to Default
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            Appearance
          </label>
          <button 
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs font-bold text-slate-900 dark:text-slate-100 transition-colors cursor-pointer"
          >
            <span>Dark Mode</span>
            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-1 ${isDark ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}>
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            Danger Zone
          </label>
          {!isConfirmingDelete ? (
            <button 
              onClick={() => setIsConfirmingDelete(true)}
              className="w-full flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-all cursor-pointer"
            >
              <Trash2 size={14} /> Clear All Data
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIsConfirmingDelete(false)} className="w-full py-4 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setAppState(prev => ({
                    ...prev,
                    accounts: [],
                    goals: [],
                    history: [],
                    transactions: []
                  }));
                  setIsConfirmingDelete(false);
                  showStatus('Financial data cleared successfully.');
                }}
                className="w-full py-4 rounded-2xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          )}
        </div>

        {/* Version */}
        <div className="text-center pt-2">
          <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
            Pensus v1.0.7
          </p>
        </div>
      </div>
    </Modal>
  );
}