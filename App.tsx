import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Register from './components/Register';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Admin from './components/Admin';
import { UserRole, UserState } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState<string>('feed');
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false, role: null, username: null, userId: null, isAdmin: false
  });

  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  // PERSISTANCE : On récupère les infos au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuthSuccess = (username: string, role: UserRole, userId: number, isAdmin: boolean = false) => {
    const userData = { isLoggedIn: true, role, username, userId, isAdmin };
    setUser(userData);
    localStorage.setItem('user_info', JSON.stringify(userData));
    localStorage.setItem('current_user_id', userId.toString());
    setPage('feed');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        handleAuthSuccess(data.username, data.role as UserRole, data.user_id, data.is_admin);
      } else {
        alert(data.detail || "Identifiants incorrects ou compte banni.");
      }
    } catch (error) {
      alert("Le serveur backend ne répond pas.");
    }
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, role: null, username: null, userId: null, isAdmin: false });
    localStorage.clear();
    setPage('feed');
  };

  const renderContent = () => {
    switch (page) {
      case 'feed':
        return <Feed onViewProfile={(id) => { setSelectedProfileId(id); setPage('profile'); }} />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile userId={selectedProfileId} isMe={false} onBack={() => setPage('feed')} />;
      case 'my-profile':
        return <Profile isMe={true} />;
      case 'admin':
        return <Admin onNavigateToChat={() => setPage('messages')} />;
      case 'register-role':
        return <Register onSuccess={handleAuthSuccess} onNavigate={setPage} />;
      case 'login':
        return (
          <div className="max-w-md mx-auto py-24 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-marron-50">
              <h2 className="text-3xl font-black text-marron-900 mb-8 tracking-tight text-center">Connexion</h2>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Utilisateur</label>
                  <input type="text" placeholder="Pseudo" className="w-full px-5 py-4 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-marron-500 transition-all outline-none" required
                    value={loginCredentials.username} onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-marron-500 transition-all outline-none" required
                    value={loginCredentials.password} onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})} />
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
      default: return <Feed onViewProfile={(id) => { setSelectedProfileId(id); setPage('profile'); }} />;
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