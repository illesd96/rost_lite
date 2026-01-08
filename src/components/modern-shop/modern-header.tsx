import React, { useState } from 'react';
import { ScreenType } from '../../types/modern-shop';
import { signOut } from 'next-auth/react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import type { Session } from 'next-auth';

interface ModernHeaderProps {
  onLogoClick: () => void;
  isLoggedIn: boolean;
  onToggleAuth: () => void;
  currentScreen: ScreenType;
  session?: Session | null;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onLogoClick, isLoggedIn, onToggleAuth, currentScreen, session }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  if (currentScreen === 'login') return null;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center text-balance">
        <div 
          className="text-2xl font-black tracking-tighter text-green-700 uppercase cursor-pointer select-none" 
          onClick={onLogoClick}
        >
          Rosti
        </div>
        
        {isLoggedIn && session?.user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-medium select-none transition-all shadow-sm bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="max-w-32 truncate">{session.user.email}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                  <p className="text-xs text-gray-500">Bejelentkezve</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Kijelentkezés
                </button>
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={onToggleAuth}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest select-none cursor-pointer transition-all shadow-sm bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300"
          >
            <span className="w-2.5 h-2.5 rounded-full shadow-sm bg-red-500"></span>
            <span>Vendég</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernHeader;
