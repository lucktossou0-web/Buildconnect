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
  const [user, setUser] = useState<UserState>({ isLoggedIn: false, role: null, username: null, userId: null, isAdmin: false });

  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  // CHARGEMENT PERSISTANCE
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
        alert(data.detail || "Échec de connexion.");
      }
    } catch (err) { alert("Serveur injoignable."); }
  };

  return (
    <Layout user={user} onLogout={() => { localStorage.clear(); window.location.reload(); }} onNavigate={setPage}>
        {(() => {
          switch (page) {
            case 'feed': return <Feed onViewProfile={(id) => { setSelectedProfileId(id); setPage('profile'); }} />;
            case 'messages': return <Messages />;
            case 'profile': return <Profile userId={selectedProfileId} isMe={false} onBack={() => setPage('feed')} />;
            case 'my-profile': return <Profile isMe={true} />;
            case 'admin': return <Admin onNavigateToChat={() => setPage('messages')} />;
            case 'register-role': return <Register onSuccess={handleAuthSuccess} onNavigate={setPage} />;
            case 'login': return (
              <div className="max-w-md mx-auto py-24 px-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-marron-50">
                  <h2 className="text-3xl font-black text-marron-900 mb-8 text-center uppercase tracking-tighter leading-none">Connexion</h2>
                  <form className="space-y-6" onSubmit={handleLogin}>
                    <input type="text" placeholder="Utilisateur" className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-rouge" required
                      value={loginCredentials.username} onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})} />
                    <input type="password" placeholder="Mot de passe" className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-rouge" required
                      value={loginCredentials.password} onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})} />
                    <button type="submit" className="w-full py-5 bg-marron-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all transform active:scale-95">Se connecter</button>
                  </form>
                </div>
              </div>
            );
            default: return <Feed onViewProfile={(id) => { setSelectedProfileId(id); setPage('profile'); }} />;
          }
        })()}
    </Layout>
  );
};
export default App;