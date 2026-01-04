import React, { useState, useEffect } from 'react';

const Admin: React.FC<{onNavigateToChat: () => void}> = ({ onNavigateToChat }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Appel des utilisateurs
      const resUsers = await fetch(`${API_URL}/users/admin/all`, { headers });
      const dataUsers = await resUsers.json();

      // Appel des paiements
      const resPay = await fetch(`${API_URL}/users/admin/payments`, { headers });
      const dataPay = await resPay.json();

      // VÉRIFICATION CRUCIALE : On s'assure que ce sont des tableaux
      if (resUsers.ok && Array.isArray(dataUsers)) {
        setUsers(dataUsers);
      } else {
        console.error("Erreur users:", dataUsers);
        setError(dataUsers.detail || "Impossible de charger les utilisateurs.");
      }

      if (resPay.ok && Array.isArray(dataPay)) {
        setPayments(dataPay);
      } else {
        console.error("Erreur paiements:", dataPay);
      }

    } catch (err) {
      console.error("Crash Fetch:", err);
      setError("Le serveur Render ne répond pas ou est en cours de réveil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approvePayment = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/users/admin/payments/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) { alert("Erreur lors de la validation"); }
  };

  const toggleUser = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/users/admin/toggle-status/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) { alert("Erreur lors du bannissement"); }
  };

  const handleChat = (u: any) => {
    localStorage.setItem('admin_chat_target', JSON.stringify(u));
    onNavigateToChat();
  };

  // --- RENDU SÉCURISÉ ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rouge"></div>
      <p className="mt-4 font-black text-marron-300 uppercase tracking-widest text-xs">Accès sécurisé en cours...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-rouge/20 text-center">
      <div className="text-5xl mb-6">🚫</div>
      <h2 className="text-2xl font-black text-marron-900 mb-4 uppercase">Accès Refusé ou Erreur</h2>
      <p className="text-marron-500 font-medium mb-8 leading-relaxed">{error}</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-marron-900 text-white rounded-full font-bold uppercase text-xs tracking-widest shadow-lg">Réessayer</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-20 animate-fade-in">

      {/* SECTION PAIEMENTS */}
      <section>
        <h2 className="text-3xl md:text-4xl font-black text-marron-900 tracking-tighter mb-8 uppercase italic">Transactions en attente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {payments.length > 0 ? payments.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-marron-50 flex flex-col items-center">
               <p className="font-black text-rouge text-[10px] uppercase mb-6 tracking-widest">Paiement #{p.id} (Utilisateur {p.user_id})</p>
               <a href={p.screenshot_url} target="_blank" rel="noreferrer" className="mb-6 block rounded-3xl overflow-hidden border border-marron-100 shadow-inner">
                 <img src={p.screenshot_url} className="h-48 w-full object-cover" alt="Preuve" />
               </a>
               <button onClick={() => approvePayment(p.id)} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-green-600 transition-all">Valider 500 FCFA</button>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center bg-marron-50/50 rounded-[2.5rem] border-2 border-dashed border-marron-200 text-marron-300 font-bold uppercase text-xs">Aucun paiement à valider</div>
          )}
        </div>
      </section>

      {/* SECTION UTILISATEURS */}
      <section>
        <h2 className="text-3xl md:text-4xl font-black text-marron-900 tracking-tighter mb-8 uppercase italic">Gestion des membres</h2>
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-marron-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-marron-50 text-marron-400 text-[9px] font-black uppercase tracking-[0.3em]">
                <tr><th className="p-8">Membre</th><th className="p-8">Rôle / Ville</th><th className="p-8">Statut</th><th className="p-8">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-marron-50">
                {users.length > 0 ? users.map(u => (
                  <tr key={u.id} className="hover:bg-marron-50/20 transition-all">
                    <td className="p-8 flex items-center gap-4">
                      <img src={u.avatar_url} className="w-12 h-12 rounded-2xl object-cover shadow-sm border" alt="" />
                      <div><p className="font-black text-marron-900">{u.username}</p><p className="text-[10px] text-marron-400 uppercase font-bold">{u.email}</p></div>
                    </td>
                    <td className="p-8">
                      <span className="px-3 py-1 bg-marron-100 rounded-full text-[9px] uppercase tracking-widest text-marron-800 font-black">{u.role}</span>
                      <p className="text-[9px] text-marron-300 mt-2 font-bold uppercase">{u.city}</p>
                    </td>
                    <td className="p-8">
                      {u.is_active ? <span className="text-green-500 font-black text-[10px] uppercase">✓ Actif</span> : <span className="text-rouge font-black text-[10px] uppercase italic">⚠ Banni</span>}
                      {u.is_subscribed && <span className="ml-2 bg-yellow-400 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">Abonné</span>}
                    </td>
                    <td className="p-8">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => toggleUser(u.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase text-white shadow-md ${u.is_active ? 'bg-rouge hover:bg-rouge-dark' : 'bg-green-500'}`}>{u.is_active ? 'Bannir' : 'Activer'}</button>
                        <button onClick={() => handleChat(u)} className="px-4 py-2 bg-marron-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-black transition-all">Contacter</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="p-20 text-center font-bold text-marron-200">Aucun utilisateur trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;