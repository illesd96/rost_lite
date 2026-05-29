'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface OpenDaySuccessCardProps {
  orderNumber: string;
  quantity: number;
  onReset?: () => void;
}

export function OpenDaySuccessCard({ orderNumber, quantity, onReset }: OpenDaySuccessCardProps) {
  return (
    <div className="animate-fade-in text-center mt-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
      <div className="flex flex-col items-center justify-center mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti_double_white-bg_PNG.png"
          alt="Rosti koccintás"
          className="h-32 w-auto object-contain drop-shadow-sm relative z-10 mix-blend-multiply"
        />
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center z-20 shadow-sm border-[3px] border-white -mt-4 relative">
          <Check className="w-5 h-5 text-green-600" strokeWidth={5} />
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 mb-2 relative z-10 uppercase tracking-tight">Érkezik a rostid!</h2>
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 relative z-10 text-balance leading-relaxed">
        Kérlek mutasd be ezt a képernyőt a standnál lévő kollégának.
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-3 relative z-10">
        <div className="font-mono font-bold text-2xl text-[#0B5D3F]">
          #{orderNumber}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <span className="font-bold text-gray-500 dark:text-gray-400 text-sm">Mennyiség:</span>
          <span className="font-black text-gray-900 dark:text-gray-100 text-sm">{quantity} palack</span>
        </div>
      </div>

      <div className="text-center mb-6 relative z-10">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Ne aggódj, a bizonylatot e-mailben is elküldtük!</span>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="w-full bg-[#0B5D3F] text-white py-4 rounded-full font-bold shadow-sm hover:bg-[#147A55] transition-colors relative z-10"
        >
          Még egyet rendelek!
        </button>
      )}

      {/* Decoration */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full -z-0"></div>
    </div>
  );
}
