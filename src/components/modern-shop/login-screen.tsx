import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft, ChevronDown } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Hibás email cím vagy jelszó');
      } else {
        // Successful login
        onLogin();
      }
    } catch (error) {
      setError('Hiba történt a bejelentkezés során');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in text-left bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')" }}>
      <main className="w-full max-w-6xl mx-auto py-10 text-left">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          <div className="flex flex-col w-full items-center lg:items-start">
            <div 
              onClick={handleScrollDown}
              className="hidden lg:flex flex-col items-center text-white mb-2 animate-bounce cursor-pointer hover:text-emerald-300 transition-colors w-full"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
                <span className="text-[10px] font-bold uppercase tracking-widest mb-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">Miért a Rosti?</span>
                <ChevronDown size={24} strokeWidth={2.5} className="drop-shadow-md" />
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 text-left w-full max-w-lg">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-gray-900 tracking-tight leading-tight">
                Minőség <span className="text-green-600">elsőként.</span>
              </h2>

              <div className="h-1.5 w-16 bg-emerald-500 rounded-full mb-5"></div>
              
              <div className="text-lg leading-relaxed text-gray-700">
                  <p>
                      Kézműves, nem tömegtermékkel dolgozunk. <br className="hidden sm:inline" />
                      <span className="text-green-600 font-bold">A prémium minőség garantálásához <br className="hidden sm:inline" />a Rosti vásárlói közösséget fokozatosan bővítjük.</span>
                  </p>
                  
                  <div className="border-t border-gray-100 my-5"></div>
                  
                  <p>
                      Ha érdekel a Rosti, <a href="mailto:rendeles@rosti.hu" className="font-bold text-green-600 hover:text-green-700 transition-colors no-underline">írj nekünk</a>, <br className="block sm:hidden" />felvesszük a kapcsolatot az első szállítás egyeztetéséhez.
                  </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto border border-gray-100 relative text-left">
            <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-700 mb-8 transition-colors group focus:outline-none">
              <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Vissza a főoldalra
            </button>
    
            <header className="mb-8 text-left">
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 text-gray-900 tracking-tight leading-tight whitespace-nowrap">
                <span className="text-green-600">Rosti</span> rendelés
              </h1>
              <p className="text-gray-500 mt-2 text-sm text-left">Jelentkezz be a következő rendelésed leadásához</p>
            </header>
    
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 ml-1 text-left">Email cím</label>
                <input 
                  id="login-email" 
                  type="email" 
                  required 
                  disabled={isLoading}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="írd be az email címed" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 text-left disabled:opacity-50"
                />
              </div>
    
              <div>
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 ml-1 text-left">Jelszó</label>
                <div className="relative group">
                  <input 
                    id="login-password" 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    disabled={isLoading}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="írd be a jelszavad" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 disabled:opacity-50"
                  />
                  
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
    
              <div className="pt-2 text-left">
                <button 
                  type="submit" 
                  disabled={isLoading || !email || !password}
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Bejelentkezés...' : 'Belépés'}
                </button>
              </div>
            </form>
    
            <footer className="mt-10 text-center border-t border-gray-100 pt-8 text-left">
              <p className="text-sm text-gray-500 text-left text-center">
                Nincs még Rosti fiókod? 
                <a href="mailto:rendeles@rosti.hu" className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors ml-1">
                  Írj nekünk
                </a>
              </p>

              <div 
                onClick={handleScrollDown}
                className="mt-8 flex flex-col items-center justify-center text-gray-400 lg:hidden animate-bounce cursor-pointer hover:text-emerald-600 transition-colors"
              >
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Miért a Rosti?</span>
                  <ChevronDown size={20} strokeWidth={2.5} />
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;
