import React from 'react';
import { RefreshCcw, Mail, CreditCard } from 'lucide-react';

interface FailedScreenProps {
  onRetry: () => void;
  onBackToHome: () => void;
}

const FailedScreen: React.FC<FailedScreenProps> = ({ onRetry, onBackToHome }) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 animate-fade-in text-left bg-gray-50 dark:bg-gray-900">
      <div className="bg-[#141414] rounded-[2rem] shadow-2xl p-8 sm:p-12 w-full max-w-2xl mx-auto border border-gray-800 text-center relative overflow-visible mt-16">

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0B5D3F]/20 to-transparent rounded-t-[2rem]"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0B5D3F] rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#0B5D3F] rounded-full blur-[100px] opacity-10"></div>

        <div className="relative z-10">
          <div className="-mt-24 mb-6 flex justify-center">
            <img
              src="https://raw.githubusercontent.com/bal1nt/rosti-img/main/Rosti%20HomePage%20bottle_P_tr.png"
              alt="Rosti palack"
              className="h-48 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
            Már csak egy lépés
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-lg mx-auto font-medium leading-relaxed">
            A fizetés nem sikerült.
          </p>

          <div className="flex flex-col items-center gap-4 justify-center">
            <button
              onClick={onRetry}
              className="px-10 py-4 bg-[#0B5D3F] text-white rounded-xl font-black hover:bg-[#147A55] transition-all shadow-lg hover:shadow-[#0B5D3F]/20 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <RefreshCcw size={20} />
              Újrapróbálom
            </button>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
            >
              <CreditCard size={16} />
              Másik kártyát használok
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h4 className="font-bold text-gray-300 mb-2">Továbbra sem sikerül? Segítünk!</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              <a
                href="mailto:rendeles@rosti.hu"
                className="text-[#0B5D3F] font-bold hover:underline inline-flex items-center gap-1"
              >
                <Mail size={16} />
                Írj nekünk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedScreen;
