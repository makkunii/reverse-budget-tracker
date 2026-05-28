import React from 'react';
import { Coffee, Heart } from 'lucide-react';
import { Modal } from '../common/Modal';
import gcashQR from '../../assets/coffee.png';

export function BuyMeACoffeeModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buy Me a Coffee">
      <div className="text-center space-y-6 p-2">
        <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
          <Coffee size={32} />
        </div>
        
        <div>
          <h3 className="text-lg font-black text-slate-900">Support the Hustle</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            If this tool has helped you get your finances organized, feel free to buy me a coffee!
            Scan the QR code below via GCash to send your support.
          </p>
        </div>

        {/* GCash QR Code Container */}
        <div className="border border-slate-100 rounded-3xl p-6 bg-slate-50">
          <img 
            src={gcashQR} 
            alt="GCash QR Code" 
            className="w-48 h-48 mx-auto rounded-xl shadow-inner border border-slate-200"
          />
          <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">GCash QR</p>
        </div>
        
        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
          Thank you for your kindness! <Heart size={10} className="fill-rose-500 text-rose-500" />
        </p>
      </div>
    </Modal>
  );
}