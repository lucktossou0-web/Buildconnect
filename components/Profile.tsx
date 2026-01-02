import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface ProfileProps { userId?: number | null; isMe: boolean; onBack?: () => void; }

const Profile: React.FC<ProfileProps> = ({ userId, isMe, onBack }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', image_url: '' });
  const [editBio, setEditBio] = useState({ bio: '', phone: '', city: '' });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const token = localStorage.getItem('token');

  const fetchProfileData = async () => {
    try {
      const url = isMe ? `${API_URL}/users/me` : `${API_URL}/users/${userId}`;
      const headers: any = isMe ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(url, { headers });
      const data = await res.json();
      setProfile(data);
      setEditBio({ bio: data.bio || '', phone: data.phone || '', city: data.city || '' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfileData(); }, [userId, isMe]);

  const handleUpdateInfo = async () => {
    await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editBio)
    });
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/users/me/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newProject)
    });
    if (res.ok) { setShowAddProject(false); setNewProject({ title: '', description: '', image_url: '' }); fetchProfileData(); }
  };

  if (loading) return <div className="flex justify-center items-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rouge"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-fade-in overflow-x-hidden">
      {onBack && <button onClick={onBack} className="mb-8 text-marron-400 font-black uppercase text-[10px] tracking-widest hover:text-marron-900 transition-all">← Retour</button>}

      {/* HEADER PROFIL RESPONSIVE */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-marron-50 flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-16 relative">
        <img src={profile.avatar_url} className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3rem] object-cover border-4 border-rouge shadow-xl rotate-2" alt="" />

        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-black text-marron-900 tracking-tighter leading-none">{profile.shop_name || profile.username}</h1>
            <span className="self-center md:self-auto px-3 py-1 bg-marron-100 text-marron-800 rounded-full text-[9px] font-black uppercase tracking-widest">{profile.role}</span>
          </div>

          {profile.role === 'client' ? (
            <div className="bg-marron-50/50 p-6 md:p-8 rounded-[2rem] border border-marron-100 text-left space-y-6">
               <h3 className="text-[10px] font-black text-marron-300 uppercase tracking-widest">Informations Privées</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><p className="text-[9px] font-bold text-marron-400 uppercase tracking-widest mb-1">Email</p><p className="font-black text-marron-900 break-all text-sm md:text-base">{profile.email}</p></div>
                  <div><p className="text-[9px] font-bold text-marron-400 uppercase tracking-widest mb-1">Téléphone</p>
                    {isMe ? <input className="bg-transparent border-b border-marron-200 outline-none w-full font-black text-marron-900 focus:border-rouge" value={editBio.phone} onChange={e => setEditBio({...editBio, phone: e.target.value})} onBlur={handleUpdateInfo} placeholder="Ajouter un numéro" /> : <p className="font-black text-marron-900">{profile.phone || "Non renseigné"}</p>}
                  </div>
               </div>
            </div>
          ) : (
            <>
              {isMe ? (
                <textarea className="w-full p-5 bg-marron-50 rounded-[1.5rem] outline-none mb-6 font-medium text-sm h-32 focus:ring-2 focus:ring-rouge border-none" value={editBio.bio} onChange={e => setEditBio({...editBio, bio: e.target.value})} onBlur={handleUpdateInfo} placeholder="Décrivez votre expertise ici..." />
              ) : (
                <p className="text-marron-500 text-base md:text-lg leading-relaxed mb-8 font-medium max-w-3xl">{profile.bio || "Pas de présentation."}</p>
              )}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {profile.cv_url && <a href={profile.cv_url} target="_blank" className="px-6 md:px-8 py-3 md:py-4 bg-marron-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">Catalogue / CV</a>}
                {isMe && <button onClick={() => setShowAddProject(true)} className="px-6 md:px-8 py-3 md:py-4 bg-rouge text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ Réalisation</button>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PORTFOLIO RESPONSIVE */}
      {profile.role !== 'client' && (
        <>
          <h2 className="text-2xl md:text-3xl font-black text-marron-900 mb-8 md:mb-10 tracking-tighter uppercase text-center md:text-left">Portfolio & Réalisations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {profile.projects?.map((p: any) => (
              <div key={p.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-marron-50 group">
                <div className="aspect-video overflow-hidden"><img src={p.image_url || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000'} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" /></div>
                <div className="p-6 md:p-8"><h3 className="font-black text-marron-900 text-lg md:text-xl mb-2">{p.title}</h3><p className="text-marron-400 text-xs md:text-sm leading-relaxed">{p.description}</p></div>
              </div>
            ))}
          </div>
          {(!profile.projects || profile.projects.length === 0) && (
            <div className="py-20 text-center bg-marron-50/50 rounded-[3rem] border-2 border-dashed border-marron-100 text-marron-300 font-black uppercase text-xs tracking-widest">Aucun projet à afficher</div>
          )}
        </>
      )}

      {/* MODALE RESPONSIVE */}
      {showAddProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-marron-900/60 backdrop-blur-md">
          <form onSubmit={handleAddProject} className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] max-w-lg w-full shadow-2xl border border-marron-50 animate-slide-up">
            <h2 className="text-xl md:text-2xl font-black mb-6 uppercase tracking-tighter text-marron-900">Nouvelle réalisation</h2>
            <div className="space-y-4">
              <input required placeholder="Titre" className="w-full p-4 bg-marron-50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold text-sm" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              <textarea required placeholder="Description..." className="w-full p-4 bg-marron-50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-medium text-sm h-32" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              <input placeholder="Lien image" className="w-full p-4 bg-marron-50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rouge text-sm" value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddProject(false)} className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-marron-400">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-marron-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Publier</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;