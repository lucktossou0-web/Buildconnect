import React, { useState, useEffect } from 'react';

const Admin: React.FC<{onNavigateToChat: () => void}> = ({ onNavigateToChat }) => {
  const [users, setUsers] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const token = localStorage.getItem('token');

  const fetchUsers = () => {
    fetch(`${API_URL}/users/admin/all`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json()).then(setUsers);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id: number) => {
    await fetch(`${API_URL}/users/admin/toggle-status/${id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <h1 className="text-5xl font-black text-marron-900 tracking-tighter uppercase">Gestion de Plateforme</h1>
        <div className="px-6 py-2 bg-marron-900 text-white rounded-full text-xs font-black uppercase tracking-widest">{users.length} Inscrits</div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-marron-50">
        <table className="w-full text-left">
          <thead className="bg-marron-50 text-marron-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr><th className="p-8">Utilisateur</th><th className="p-8">Rôle / Ville</th><th className="p-8">Statut</th><th className="p-8">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-marron-50 font-bold">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-marron-50/20 transition-all">
                <td className="p-8 flex items-center gap-4">
                  <img src={u.avatar_url} className="w-14 h-14 rounded-2xl object-cover" />
                  <div><p className="text-marron-900 text-lg font-black">{u.username}</p><p className="text-[10px] text-marron-400 uppercase">{u.email}</p></div>
                </td>
                <td className="p-8">
                  <span className="px-3 py-1 bg-marron-100 rounded-full text-[10px] uppercase text-marron-800 tracking-widest">{u.role}</span>
                  <p className="text-[10px] text-marron-300 mt-2 uppercase">{u.city}</p>
                </td>
                <td className="p-8">
                  {u.is_active ? <span className="text-green-500 font-black text-xs italic">ACTIF</span> : <span className="text-rouge font-black text-xs italic animate-pulse">BANNI</span>}
                </td>
                <td className="p-8">
                  <div className="flex gap-3">
                    <button onClick={() => toggleStatus(u.id)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase text-white shadow-md transition-all ${u.is_active ? 'bg-rouge hover:bg-rouge-dark' : 'bg-green-500 hover:bg-green-600'}`}>
                      {u.is_active ? 'Bannir' : 'Réactiver'}
                    </button>
                    <button onClick={onNavigateToChat} className="px-5 py-2 bg-marron-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black">Contacter</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;