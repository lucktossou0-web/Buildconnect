import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Register from './components/Register';
import Messages from './components/Messages'; // <-- IMPORT DU COMPOSANT
import { UserRole, UserState } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState<string>('feed');
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    role: null,
    username: null
  });

  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  const handleAuthSuccess = (username: string, role: UserRole) => {
    setUser({ isLoggedIn: true, role: role, username: username });
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
        alert("Identifiants incorrects");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, role: null, username: null });
    localStorage.removeItem('token');
    setPage('feed');
  };

  const renderContent = () => {
    switch (page) {
      case 'feed': return <Feed />;
      case 'messages': return <Messages />; // <-- NOUVELLE PAGE
      case 'register-role': return <Register onSuccess={handleAuthSuccess} onNavigate={setPage} />;
      case 'login': return (
          <div className="max-w-md mx-auto py-24 px-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-marron-50">
              <h2 className="text-3xl font-black text-marron-900 mb-8 tracking-tight">Connexion</h2>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Utilisateur</label>
                  <input type="text" className="w-full px-5 py-4 bg-marron-50 rounded-2xl outline-none" required
                    value={loginCredentials.username} onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-marron-700 mb-2">Mot de passe</label>
                  <input type="password"  className="w-full px-5 py-4 bg-marron-50 rounded-2xl outline-none" required
                    value={loginCredentials.password} onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-5 bg-rouge text-white rounded-2xl font-bold shadow-xl">Se connecter</button>
              </form>
            </div>
          </div>
      );
      default: return <Feed />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={setPage}>
        {renderContent()}
    </Layout>
  );
};
export default App;