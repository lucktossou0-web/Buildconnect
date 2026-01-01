
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
      <nav className="sticky top-0 z-50 glass-effect border-b border-marron-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate('feed')}
            >
              <span className="text-2xl font-black tracking-tighter text-marron-800 transition-all group-hover:text-rouge">
                BUILD<span className="text-rouge">CONNECT</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => onNavigate('feed')}
                className="text-marron-800 font-medium hover:text-rouge transition-colors"
              >
                Explorer
              </button>
              {user.isLoggedIn ? (
                <>
                  <span className="text-marron-600">Bienvenue, <strong className="text-marron-800">{user.username}</strong></span>
                  <button 
                    onClick={onLogout}
                    className="bg-marron-800 text-white px-6 py-2 rounded-full font-medium hover:bg-marron-900 transition-all transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => onNavigate('login')}
                    className="text-marron-800 font-medium hover:text-rouge transition-colors"
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => onNavigate('register-role')}
                    className="bg-rouge text-white px-6 py-2 rounded-full font-medium hover:bg-rouge-dark transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Rejoindre
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-marron-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-bold tracking-tighter">BUILD<span className="text-rouge-50">CONNECT</span></span>
              <p className="mt-4 text-marron-200 max-w-sm">
                La première plateforme de mise en relation pour les professionnels du bâtiment au Bénin. Construisons ensemble l'avenir de nos villes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-champagne">Plateforme</h3>
              <ul className="space-y-2 text-marron-300">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partenaires</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aide & Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-champagne">Contact</h3>
              <ul className="space-y-2 text-marron-300">
                <li>Cotonou, Bénin</li>
                <li>contact@buildconnect.bj</li>
                <li>+229 00 00 00 00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-marron-800 mt-12 pt-8 text-center text-marron-400 text-sm">
            © {new Date().getFullYear()} BuildConnect. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
