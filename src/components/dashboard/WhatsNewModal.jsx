import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';

export function WhatsNewModal({ currentVersion, lastSeenVersion, onUpdateVersion }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (lastSeenVersion !== currentVersion) {
      setIsOpen(true);
    }
  }, [lastSeenVersion, currentVersion]);

  const handleClose = () => {
    setIsOpen(false);
    onUpdateVersion(currentVersion);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`What's New in v${currentVersion}`}>
      <div className="space-y-4 text-sm text-slate-600">
        <p>We've added some exciting updates:</p>
        <ul className="list-disc pl-4 space-y-2">
          <li><strong>Automated Interest Payouts:</strong> Your savings now grow automatically!</li>
          <li><strong>Account Transfer:</strong> You can now transfer money to different accounts.</li>
          <li><strong>Transaction Ledger:</strong> You can now track your expenses and incomes.</li>
        </ul>
        <button 
          onClick={handleClose} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors"
        >
          Got it!
        </button>
      </div>
    </Modal>
  );
}