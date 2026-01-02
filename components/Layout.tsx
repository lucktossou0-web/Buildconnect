import React from 'react';
import { UserState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserState;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* --- BARRE DE NAVIGATION (STRECHED GLASS EFFECT) --- */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-marron-100 shadow-sm bg-white/80 backdrop-blur-md h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">

            {/* LOGO BUILDCONNECT */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate('feed')}
            >
              <span className="text-2xl font-black tracking-tighter text-marron-800 transition-all group-hover:text-rouge">
                BUILD<span className="text-rouge">CONNECT</span>
              </span>
            </div>

            {/* LIENS DE NAVIGATION & ACTIONS */}
            <div className="hidden md:flex items-center space-x-8">

              {/* LIEN EXPLORER (TOUJOURS VISIBLE) */}
              <button
                onClick={() => onNavigate('feed')}
                className="text-marron-800 font-bold hover:text-rouge transition-colors uppercase text-xs tracking-widest"
              >
                Explorer
              </button>

              {user.isLoggedIn ? (
                /* --- SECTION UTILISATEUR CONNECTÉ --- */
                <>
                  {/* MESSAGES AVEC PASTILLE DYNAMIQUE */}
                  <button
                    onClick={() => onNavigate('messages')}
                    className="flex items-center gap-2 text-marron-800 font-bold hover:text-rouge transition-colors group relative uppercase text-xs tracking-widest"
                  >
                    <span>Messages</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rouge opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rouge"></span>
                    </span>
                  </button>

                  {/* MON PROFIL */}
                  <button
                    onClick={() => onNavigate('my-profile')}
                    className="text-marron-800 font-bold hover:text-rouge transition-colors uppercase text-xs tracking-widest"
                  >
                    Mon Profil
                  </button>

                  {/* LIEN ADMINISTRATION (VISIBLE UNIQUEMENT POUR LES ADMINS) */}
                  {user.isAdmin && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="flex items-center gap-2 text-rouge font-black uppercase text-xs tracking-[0.2em] border-2 border-rouge/20 px-4 py-2 rounded-full hover:bg-rouge hover:text-white transition-all animate-pulse"
                    >
                      Administration
                    </button>
                  )}

                  {/* SÉPARATEUR VISUEL */}
                  <div className="h-6 w-px bg-marron-100 mx-2"></div>

                  {/* SALUTATION */}
                  <span className="text-marron-600 text-sm">
                    Bienvenue, <strong className="text-marron-900 font-black">{user.username}</strong>
                  </span>

                  {/* BOUTON DÉCONNEXION */}
                  <button
                    onClick={onLogout}
                    className="bg-marron-900 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                /* --- SECTION VISITEUR (NON CONNECTÉ) --- */
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-marron-800 font-bold hover:text-rouge transition-colors uppercase text-xs tracking-widest"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => onNavigate('register-role')}
                    className="bg-rouge text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-rouge-dark transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Rejoindre
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- CONTENU DE LA PAGE --- */}
      <main className="flex-grow">
        {children}
      </main>

      {/* --- FOOTER PREMIUM --- */}
      <footer className="bg-marron-900 text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

            {/* À PROPOS */}
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-black tracking-tighter">
                BUILD<span className="text-rouge-50">CONNECT</span>
              </span>
              <p className="mt-4 text-marron-200 max-w-sm mx-auto md:mx-0 leading-relaxed font-medium italic opacity-80">
                La première plateforme de mise en relation pour les professionnels du bâtiment au Bénin. Construisons ensemble l'avenir de nos villes.
              </p>
            </div>

            {/* NAVIGATION PLATEFORME */}
            <div>
              <h3 className="text-lg font-black mb-6 text-champagne uppercase tracking-widest text-sm">Plateforme</h3>
              <ul className="space-y-3 text-marron-300 font-medium">
                <li><button onClick={() => onNavigate('feed')} className="hover:text-white transition-colors">Explorer les talents</button></li>
                <li><button className="hover:text-white transition-colors cursor-not-allowed">Devenir partenaire</button></li>
                <li><button className="hover:text-white transition-colors cursor-not-allowed">Aide & Support</button></li>
              </ul>
            </div>

            {/* CONTACTS */}
            <div>
              <h3 className="text-lg font-black mb-6 text-champagne uppercase tracking-widest text-sm">Contact</h3>
              <ul className="space-y-3 text-marron-300 font-medium">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <span>Cotonou, Bénin</span>
                </li>
                <li>contact@buildconnect.bj</li>
                <li className="font-bold text-white">+229 01 00 00 00 00</li>
              </ul>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="border-t border-marron-800 mt-16 pt-8 text-center text-marron-400 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} BuildConnect Excellence. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;