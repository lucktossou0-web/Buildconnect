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

  // Pour gérer les inputs du formulaire de login
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Optionnel : Vérifier si un token existe déjà dans le localStorage au chargement
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        // Ici on pourrait appeler /api/v1/users/me pour reconnecter l'utilisateur automatiquement
    }
  }, [page]);

  // Fonction appelée après un Login OU un Register réussi
  const handleAuthSuccess = (username: string, role: UserRole) => {
    setUser({
      isLoggedIn: true,
      role: role,
      username: username
    });
    setPage('feed');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        handleAuthSuccess(data.username, data.role as UserRole);
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Erreur de connexion");
      }
    } catch (error) {
      alert("Le serveur backend ne répond pas.");
    }
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, role: null, username: null });
    localStorage.removeItem('token');
    setPage('feed');
  };

  const renderContent = () => {
    switch (page) {
      case 'feed':
        return <Feed />;
      case 'register-role':
        return (
          <Register
            onSuccess={handleAuthSuccess}
            onNavigate={setPage}
            initialRole={null}
          />
        );
      case 'login':
        return (
          <div className="max-w-md mx-auto py-24 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-marron-50">
              <h2 className="text-3xl font-black text-marron-900 mb-8 tracking-tight">Connexion</h2>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Utilisateur</label>
                  <input
                    type="text"
                    placeholder="Pseudo"
                    className="w-full px-5 py-4 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-marron-500 transition-all outline-none"
                    required
                    value={loginCredentials.username}
                    onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-marron-500 transition-all outline-none"
                    required
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-rouge text-white rounded-2xl font-bold shadow-xl hover:bg-rouge-dark transition-all transform active:scale-95">
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