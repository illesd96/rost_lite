import React from 'react';
import { ScreenType } from '../../types/modern-shop';

interface ModernHeaderProps {
  onLogoClick: () => void;
  isLoggedIn: boolean;
  onToggleAuth: () => void;
  currentScreen: ScreenType;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onLogoClick, isLoggedIn, onToggleAuth, currentScreen }) => {
  if (currentScreen === 'login') return null;

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center text-balance">
        <div 
          className="text-2xl font-black tracking-tighter text-green-700 uppercase cursor-pointer select-none" 
          onClick={onLogoClick}
        >
          Rosti
        </div>
        
        <div 
          onClick={onToggleAuth}
          className="flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest select-none cursor-pointer transition-all shadow-sm bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300"
        >
          <span 
            className={`w-2.5 h-2.5 rounded-full shadow-sm ${isLoggedIn ? 'bg-emerald-500' : 'bg-red-500'}`}
          ></span>
          <span>{isLoggedIn ? 'Bejelentkezve' : 'Vendég'}</span>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
