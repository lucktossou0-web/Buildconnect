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
    const url = isMe ? `${API_URL}/users/me` : `${API_URL}/users/${userId}`;
    const headers: any = isMe ? { 'Authorization': `Bearer ${token}` } : {};
    const res = await fetch(url, { headers });
    const data = await res.json();
    setProfile(data);
    setEditBio({ bio: data.bio || '', phone: data.phone || '', city: data.city || '' });
    setLoading(false);
  };

  useEffect(() => { fetchProfileData(); }, [userId, isMe]);

  const handleUpdateInfo = async () => {
    await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editBio)
    });
  };

  if (loading) return <div className="flex justify-center items-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rouge"></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      {onBack && <button onClick={onBack} className="mb-8 text-marron-500 font-bold uppercase text-xs tracking-widest transition-all">← Retour</button>}

      {/* HEADER PRINCIPAL */}
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-marron-50 flex flex-col md:flex-row gap-12 items-center mb-16 relative">
        <img src={profile.avatar_url} className="w-48 h-48 rounded-[3rem] object-cover border-4 border-rouge shadow-xl rotate-2" alt="" />

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-black text-marron-900 tracking-tighter mb-2">{profile.shop_name || profile.username}</h1>
          <div className="px-4 py-1 bg-marron-100 text-marron-800 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-8">{profile.role}</div>

          {/* CAS CLIENT : AFFICHAGE DES DONNÉES PERSONNELLES UNIQUEMENT */}
          {profile.role === 'client' ? (
            <div className="bg-marron-50/50 p-8 rounded-[2.5rem] border border-marron-100 text-left space-y-6">
               <h3 className="text-xs font-black text-marron-300 uppercase tracking-widest">Informations de contact</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><p className="text-[10px] font-bold text-marron-400 uppercase tracking-widest">Nom complet</p><p className="font-black text-marron-900 text-lg">{profile.username}</p></div>
                  <div><p className="text-[10px] font-bold text-marron-400 uppercase tracking-widest">Email (Privé)</p><p className="font-black text-marron-900 text-lg">{profile.email}</p></div>
                  <div><p className="text-[10px] font-bold text-marron-400 uppercase tracking-widest">Ville / Zone de résidence</p>
                    {isMe ? (
                      <input className="bg-transparent border-b-2 border-marron-200 outline-none focus:border-rouge w-full font-black text-marron-900 text-lg"
                        value={editBio.city} onChange={e => setEditBio({...editBio, city: e.target.value})} onBlur={handleUpdateInfo} />
                    ) : <p className="font-black text-marron-900 text-lg">{profile.city}</p>}
                  </div>
                  <div><p className="text-[10px] font-bold text-marron-400 uppercase tracking-widest">Numéro de téléphone</p>
                    {isMe ? (
                      <input className="bg-transparent border-b-2 border-marron-200 outline-none focus:border-rouge w-full font-black text-marron-900 text-lg"
                        value={editBio.phone} onChange={e => setEditBio({...editBio, phone: e.target.value})} onBlur={handleUpdateInfo} placeholder="Ajouter votre numéro..." />
                    ) : <p className="font-black text-marron-900 text-lg">{profile.phone || "Non renseigné"}</p>}
                  </div>
               </div>
               {isMe && <p className="text-[9px] text-marron-300 italic">* Vos modifications sont enregistrées automatiquement quand vous quittez le champ.</p>}
            </div>
          ) : (
            /* CAS PRESTATAIRE / FOURNISSEUR : BIO + ACTIONS */
            <>
              {isMe ? (
                <textarea className="w-full p-6 bg-marron-50 rounded-3xl outline-none mb-6 font-medium h-32 focus:ring-2 focus:ring-rouge"
                  value={editBio.bio} onChange={e => setEditBio({...editBio, bio: e.target.value})} onBlur={handleUpdateInfo} placeholder="Présentez votre entreprise..." />
              ) : (
                <p className="text-marron-500 text-lg leading-relaxed mb-8 font-medium max-w-3xl">{profile.bio || "Pas de présentation."}</p>
              )}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {profile.cv_url && <a href={profile.cv_url} target="_blank" className="px-8 py-4 bg-marron-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Voir Catalogue</a>}
                {isMe && <button onClick={() => setShowAddProject(true)} className="px-8 py-4 bg-rouge text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-rouge-dark">+ Réalisation</button>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* AFFICHAGE RÉALISATIONS (UNIQUEMENT POUR LES PROS) */}
      {profile.role !== 'client' && (
        <>
          <h2 className="text-3xl font-black text-marron-900 mb-10 tracking-tighter uppercase">Portfolio & Projets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {profile.projects?.map((p: any) => (
              <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-marron-50 group">
                <div className="aspect-video overflow-hidden"><img src={p.image_url || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000'} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /></div>
                <div className="p-8"><h3 className="font-black text-marron-900 text-xl mb-2">{p.title}</h3><p className="text-marron-400 text-sm">{p.description}</p></div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODALE D'AJOUT (Comme avant) */}
    </div>
  );
};

export default Profile;