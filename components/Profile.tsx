import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface ProfileProps { userId?: number | null; isMe: boolean; onBack?: () => void; }

const Profile: React.FC<ProfileProps> = ({ userId, isMe, onBack }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', description: '', image_url: '' });
  const [editBio, setEditBio] = useState({ bio: '', phone: '', city: '', avatar_url: '' });
  const [payUrl, setPayUrl] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const token = localStorage.getItem('token');

  const fetchProfileData = async () => {
    try {
      const url = isMe ? `${API_URL}/users/me` : `${API_URL}/users/${userId}`;
      const headers: any = isMe ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(url, { headers });
      const data = await res.json();
      setProfile(data);
      setEditBio({
        bio: data.bio || '',
        phone: data.phone || '',
        city: data.city || '',
        avatar_url: data.avatar_url || ''
      });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfileData(); }, [userId, isMe]);

  const handleUpdateInfo = async (newData?: any) => {
    const body = newData || editBio;
    await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (newData?.avatar_url) fetchProfileData(); // Recharger si photo changée
  };

  if (loading) return <div className="py-40 text-center animate-pulse font-black text-marron-200">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in overflow-x-hidden">
      {onBack && <button onClick={onBack} className="mb-8 text-marron-400 font-black uppercase text-[10px] tracking-widest hover:text-marron-900 transition-all">← Retour</button>}

      {/* BANNIÈRE PAIEMENT (PROS UNIQUEMENT) */}
      {isMe && profile.role !== 'client' && !profile.is_admin && !profile.is_subscribed && (
        <div className="bg-rouge/5 border-2 border-dashed border-rouge p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center gap-8 shadow-inner animate-in zoom-in-95">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-rouge uppercase mb-2 italic tracking-tighter">Hébergement Expiré (500 FCFA)</h3>
            <p className="text-marron-900 font-bold tracking-widest text-xl">+229 0154626444</p>
          </div>
          <div className="w-full md:w-80 space-y-3">
            {profile.has_pending_payment ? <div className="bg-marron-900 text-white p-4 rounded-2xl text-center font-black uppercase text-[10px] animate-pulse">Vérification en cours...</div> :
            <>
              <input value={payUrl} onChange={e => setPayUrl(e.target.value)} placeholder="URL de la capture d'écran" className="w-full p-4 bg-white rounded-xl border outline-none text-xs font-bold" />
              <button onClick={async () => { await fetch(`${API_URL}/users/me/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ screenshot_url: payUrl }) }); fetchProfileData(); }} className="w-full py-4 bg-rouge text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Confirmer</button>
            </>}
          </div>
        </div>
      )}

      {/* HEADER PROFIL AVEC CHANGEMENT DE PHOTO POUR TOUS */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-marron-50 flex flex-col md:flex-row gap-10 items-center mb-16 relative">
        <div className="relative group">
          <img src={profile.avatar_url} className="w-32 h-32 md:w-52 md:h-52 rounded-[2rem] md:rounded-[3rem] object-cover border-4 border-rouge shadow-2xl rotate-2 transition-all group-hover:brightness-50" alt="" />
          {isMe && (
            <button
              onClick={() => {
                const newUrl = prompt("Entrez l'URL de votre nouvelle photo (ex: ImgBB ou Unsplash) :", profile.avatar_url);
                if (newUrl) handleUpdateInfo({ ...editBio, avatar_url: newUrl });
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Modifier la photo
            </button>
          )}
        </div>

        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
            <h1 className="text-3xl md:text-6xl font-black text-marron-900 tracking-tighter leading-none">{profile.shop_name || profile.username}</h1>
            <span className="self-center md:self-auto px-3 py-1 bg-marron-100 text-marron-800 rounded-full text-[9px] font-black uppercase tracking-widest">
              {profile.is_admin ? "Administrateur" : profile.role}
            </span>
          </div>

          {profile.role === 'client' || profile.is_admin ? (
            <div className="bg-marron-50/50 p-6 md:p-8 rounded-[2rem] border border-marron-100 text-left grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-[9px] font-black text-marron-300 uppercase mb-1">Email Privé</p><p className="font-black text-marron-900 break-all text-sm md:text-base">{profile.email}</p></div>
              <div><p className="text-[9px] font-black text-marron-300 uppercase mb-1">Ville</p>
                {isMe ? <input className="bg-transparent border-b outline-none w-full font-black text-marron-900 focus:border-rouge" value={editBio.city} onChange={e => setEditBio({...editBio, city: e.target.value})} onBlur={() => handleUpdateInfo()} /> : <p className="font-black text-marron-900">{profile.city}</p>}
              </div>
              <div className="md:col-span-2"><p className="text-[9px] font-black text-marron-300 uppercase mb-1">Numéro WhatsApp</p>
                {isMe ? <input className="bg-transparent border-b outline-none w-full font-black text-marron-900 focus:border-rouge text-xl" value={editBio.phone} onChange={e => setEditBio({...editBio, phone: e.target.value})} onBlur={() => handleUpdateInfo()} placeholder="+229..." /> : <p className="font-black text-marron-900 text-xl">{profile.phone || "Privé"}</p>}
              </div>
            </div>
          ) : (
            <>
              {isMe ? <textarea className="w-full p-5 bg-marron-50 rounded-[1.5rem] outline-none mb-6 font-medium text-sm h-32 focus:ring-2 focus:ring-rouge border-none" value={editBio.bio} onChange={e => setEditBio({...editBio, bio: e.target.value})} onBlur={() => handleUpdateInfo()} placeholder="Votre présentation..." /> : <p className="text-marron-500 text-base md:text-lg leading-relaxed mb-8 font-medium max-w-3xl">{profile.bio || "Pas de présentation."}</p>}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {profile.cv_url && <a href={profile.cv_url} target="_blank" className="px-6 md:px-8 py-3 md:py-4 bg-marron-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all">Catalogue</a>}
                {isMe && <button onClick={() => setShowAddProject(true)} className="px-6 md:px-8 py-3 md:py-4 bg-rouge text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-rouge-dark">+ Réalisation</button>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PORTFOLIO (Sauf client et admin) */}
      {!profile.is_admin && profile.role !== 'client' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {profile.projects?.map((p: any) => (
            <div key={p.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-marron-50 group">
              <div className="aspect-video overflow-hidden"><img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" /></div>
              <div className="p-6 md:p-8"><h3 className="font-black text-marron-900 text-lg md:text-xl mb-2">{p.title}</h3><p className="text-marron-400 text-xs md:text-sm leading-relaxed">{p.description}</p></div>
            </div>
          ))}
          {(!profile.projects || profile.projects.length === 0) && <div className="col-span-full py-20 text-center bg-marron-50/50 rounded-[3rem] border-2 border-dashed border-marron-100 text-marron-300 font-black uppercase text-xs tracking-widest italic">Aucun projet publié</div>}
        </div>
      )}

      {/* MODALE RÉALISATION (IDENTIQUE) */}
      {showAddProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-marron-900/60 backdrop-blur-sm">
          <form onSubmit={async (e) => { e.preventDefault(); await fetch(`${API_URL}/users/me/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newProj) }); setShowAddProject(false); fetchProfileData(); }} className="bg-white p-10 rounded-[3rem] max-w-lg w-full shadow-2xl animate-slide-up">
            <h2 className="text-xl md:text-2xl font-black mb-6 uppercase text-marron-900">Nouvelle réalisation</h2>
            <div className="space-y-4">
              <input required placeholder="Titre" className="w-full p-4 bg-marron-50 rounded-xl outline-none focus:ring-2 focus:ring-rouge font-bold" value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} />
              <textarea required placeholder="Description détaillée..." className="w-full p-4 bg-marron-50 rounded-xl outline-none focus:ring-2 focus:ring-rouge h-24" value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} />
              <input placeholder="URL de l'image" className="w-full p-4 bg-marron-50 rounded-xl outline-none focus:ring-2 focus:ring-rouge" value={newProj.image_url} onChange={e => setNewProj({...newProj, image_url: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddProject(false)} className="flex-1 py-4 font-black text-[10px] uppercase text-marron-400">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-marron-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Publier</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default Profile;