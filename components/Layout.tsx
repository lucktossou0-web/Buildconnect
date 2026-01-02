import React, { useState } from 'react';
import { UserState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserState;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* --- BARRE DE NAVIGATION RESPONSIVE --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-marron-100 min-h-[72px] md:h-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center py-3">

          {/* LOGO */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => handleNav('feed')}
          >
            <span className="text-xl md:text-2xl font-black tracking-tighter text-marron-800 transition-all group-hover:text-rouge">
              BUILD<span className="text-rouge">CONNECT</span>
            </span>
          </div>

          {/* BOUTON MENU BURGER (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-marron-800 hover:bg-marron-50 rounded-xl transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button onClick={() => handleNav('feed')} className="text-marron-800 font-bold uppercase text-[10px] tracking-widest hover:text-rouge transition-all">Explorer</button>

            {user.isLoggedIn ? (
              <>
                <button onClick={() => handleNav('messages')} className="flex items-center gap-2 text-marron-800 font-bold uppercase text-[10px] tracking-widest hover:text-rouge relative">
                  Messages
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rouge opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rouge"></span>
                  </span>
                </button>
                <button onClick={() => handleNav('my-profile')} className="text-marron-800 font-bold uppercase text-[10px] tracking-widest hover:text-rouge">Mon Profil</button>

                {user.isAdmin && (
                  <button onClick={() => handleNav('admin')} className="text-rouge font-black uppercase text-[10px] border-2 border-rouge/20 px-3 py-1 rounded-full animate-pulse">Administration</button>
                )}

                <div className="h-6 w-px bg-marron-100 mx-2"></div>
                <button onClick={onLogout} className="bg-marron-900 text-white px-5 py-2 rounded-full font-bold text-[10px] uppercase hover:bg-black transition-all shadow-md">Déconnexion</button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => handleNav('login')} className="text-marron-800 font-bold uppercase text-[10px]">Connexion</button>
                <button onClick={() => handleNav('register-role')} className="bg-rouge text-white px-5 py-2 rounded-full font-black text-[10px] uppercase shadow-lg hover:bg-rouge-dark transition-all">Rejoindre</button>
              </div>
            )}
          </div>
        </div>

        {/* MENU MOBILE DÉROULANT */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-marron-100 p-6 space-y-5 shadow-xl animate-in slide-in-from-top duration-300">
            <button onClick={() => handleNav('feed')} className="block w-full text-left font-black text-marron-800 uppercase text-xs tracking-widest">Explorer</button>
            {user.isLoggedIn ? (
              <>
                <button onClick={() => handleNav('messages')} className="block w-full text-left font-black text-marron-800 uppercase text-xs tracking-widest">Messages</button>
                <button onClick={() => handleNav('my-profile')} className="block w-full text-left font-black text-marron-800 uppercase text-xs tracking-widest">Mon Profil</button>
                {user.isAdmin && <button onClick={() => handleNav('admin')} className="block w-full text-left font-black text-rouge uppercase text-xs tracking-widest">Administration</button>}
                <button onClick={onLogout} className="block w-full pt-4 border-t border-marron-50 text-left font-black text-marron-400 uppercase text-xs tracking-widest">Déconnexion</button>
              </>
            ) : (
              <>
                <button onClick={() => handleNav('login')} className="block w-full text-left font-black text-marron-800 uppercase text-xs tracking-widest">Connexion</button>
                <button onClick={() => handleNav('register-role')} className="block w-full py-4 bg-rouge text-white rounded-2xl text-center font-black uppercase text-xs tracking-widest shadow-lg">S'inscrire</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* CONTENU CENTRAL */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER RESPONSIVE */}
      <footer className="bg-marron-900 text-white py-12 md:py-16 mt-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 lg:col-span-2">
            <span className="text-2xl font-black tracking-tighter">BUILD<span className="text-rouge-50">CONNECT</span></span>
            <p className="mt-4 text-marron-200 max-w-sm mx-auto md:mx-0 text-sm leading-relaxed opacity-80 italic">
              La première plateforme de mise en relation pour les professionnels du bâtiment au Bénin.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-rouge-50">Plateforme</h3>
            <ul className="space-y-3 text-marron-300 font-bold text-xs uppercase">
              <li><button onClick={() => handleNav('feed')} className="hover:text-white transition-colors">Explorer</button></li>
              <li className="opacity-50">Devenir Partenaire</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-rouge-50">Contact</h3>
            <ul className="space-y-3 text-marron-300 font-bold text-xs uppercase">
              <li>Cotonou, Bénin</li>
              <li>contact@buildconnect.bj</li>
              <li className="text-white">+229 01 00 00 00 00</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-marron-800 mt-12 pt-8 text-center text-[9px] font-black text-marron-500 uppercase tracking-widest">
          © {new Date().getFullYear()} BUILDCONNECT EXCELLENCE. TOUS DROITS RÉSERVÉS.
        </div>
      </footer>
    </div>
  );
};

export default Layout;