
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Register from './components/Register';
import { UserRole, UserState } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState<string>('feed');
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    role: null,
    username: null
  });
  const [selectedRoleForRegister, setSelectedRoleForRegister] = useState<UserRole | null>(null);

  // Animation simple pour le changement de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleLoginSuccess = (username: string, role: UserRole) => {
    setUser({
      isLoggedIn: true,
      role: role,
      username: username
    });
    setPage('feed');
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      role: null,
      username: null
    });
    setPage('feed');
  };

  const renderContent = () => {
    switch (page) {
      case 'feed':
        return <Feed />;
      case 'register-role':
        return (
          <Register 
            onSuccess={handleLoginSuccess} 
            onNavigate={setPage} 
            initialRole={null} 
          />
        );
      case 'login':
        return (
          <div className="max-w-md mx-auto py-24 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-marron-50">
              <h2 className="text-3xl font-black text-marron-900 mb-8 tracking-tight">Connexion</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLoginSuccess('Moussa', UserRole.CLIENT); }}>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Utilisateur</label>
                  <input type="text" placeholder="Pseudo" className="w-full px-5 py-4 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-marron-500 transition-all outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-marron-500 transition-all outline-none" required />
                </div>
                <button className="w-full py-5 bg-rouge text-white rounded-2xl font-bold shadow-xl hover:bg-rouge-dark transition-all transform active:scale-95">
                  Se connecter
                </button>
              </form>
              <p className="mt-8 text-center text-marron-400">
                Pas de compte ? <button onClick={() => setPage('register-role')} className="text-marron-900 font-bold hover:underline">S'inscrire</button>
              </p>
            </div>
          </div>
        );
      default:
        return <Feed />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={setPage}>
      <div className="animate-in fade-in duration-700">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
