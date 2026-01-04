import React, { useState, useEffect } from 'react';

const Admin: React.FC<{onNavigateToChat: () => void}> = ({ onNavigateToChat }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const h = { 'Authorization': `Bearer ${token}` };
      const resU = await fetch(`${API_URL}/users/admin/all`, { headers: h });
      const resP = await fetch(`${API_URL}/users/admin/payments`, { headers: h });

      if (!resU.ok || !resP.ok) {
        throw new Error(`Erreur serveur (Status: ${resU.status})`);
      }

      const dataU = await resU.json();
      const dataP = await resP.json();

      setUsers(Array.isArray(dataU) ? dataU : []);
      setPayments(Array.isArray(dataP) ? dataP : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (error) return <div className="p-20 text-center text-rouge font-bold">Erreur Admin : {error}. <br/>Vérifiez que vous êtes bien Admin en base de données.</div>;
  if (loading) return <div className="p-20 text-center animate-pulse">Chargement de la console...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-20 animate-fade-in">
      <section>
        <h2 className="text-4xl font-black text-marron-900 tracking-tighter mb-8 uppercase italic underline">Validation Paiements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {payments.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-marron-50 flex flex-col items-center text-center">
               <p className="font-black text-rouge text-[10px] uppercase mb-4 tracking-widest italic">Abonnement ID: #{p.id}</p>
               <img src={p.screenshot_url} className="h-56 w-full object-cover rounded-3xl mb-6 border" alt="Capture" />
               <button onClick={() => approve(p.id)} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-green-600 transition-all">Valider 500 FCFA</button>
            </div>
          ))}
          {payments.length === 0 && <div className="col-span-full py-20 text-center bg-marron-50 rounded-[3rem] border-2 border-dashed text-marron-300 font-bold uppercase text-xs">Aucune transaction en attente</div>}
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-black text-marron-900 tracking-tighter mb-8 uppercase">Gestion des Membres</h2>
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-x-auto border border-marron-50">
          <table className="w-full text-left">
            <thead className="bg-marron-50 text-marron-400 text-[9px] font-black uppercase tracking-[0.3em]">
              <tr><th className="p-8">Membre</th><th className="p-8">Rôle / Ville</th><th className="p-8">Statut</th><th className="p-8">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-marron-50 font-bold text-sm">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-marron-50/20">
                  <td className="p-8 flex items-center gap-4"><img src={u.avatar_url} className="w-14 h-14 rounded-2xl object-cover" /><div><p className="text-marron-900 font-black">{u.username}</p><p className="text-[10px] text-marron-400 uppercase tracking-widest">{u.email}</p></div></td>
                  <td className="p-8"><span className="px-3 py-1 bg-marron-100 rounded-full text-[9px] uppercase tracking-widest text-marron-800">{u.role}</span><p className="text-[9px] text-marron-300 mt-2 uppercase">{u.city}</p></td>
                  <td className="p-8">{u.is_active ? <span className="text-green-500 font-black text-[10px]">ACTIF</span> : <span className="text-rouge font-black text-[10px] italic animate-pulse">BANNI</span>}</td>
                  <td className="p-8">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => toggleStatus(u.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase text-white shadow-md ${u.is_active ? 'bg-rouge' : 'bg-green-500'}`}>{u.is_active ? 'Bannir' : 'Activer'}</button>
                      <button onClick={() => handleChat(u)} className="px-4 py-2 bg-marron-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-black transition-all">Contacter</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default Admin;