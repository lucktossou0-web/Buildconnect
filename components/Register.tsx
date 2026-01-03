import React, { useState } from 'react';
import { UserRole } from '../types';

interface RegisterProps {
  onSuccess: (username: string, role: UserRole, userId: number, isAdmin: boolean) => void;
  onNavigate: (page: string) => void;
  initialRole?: UserRole | null;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onNavigate, initialRole }) => {
  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [role, setRole] = useState<UserRole | null>(initialRole || null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', city: 'Cotonou', specialty: '', shopName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      username: formData.username, email: formData.email, password: formData.password,
      role: role, city: formData.city,
      specialty: role === UserRole.PRESTATAIRE ? formData.specialty : null,
      shop_name: role === UserRole.FOURNISSEUR ? formData.shopName : null,
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('current_user_id', data.user_id.toString());
        onSuccess(data.username, data.role as UserRole, data.user_id, data.is_admin);
      } else {
        alert(data.detail || "Erreur d'inscription");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-black text-center text-marron-900 mb-12 uppercase tracking-tighter">Votre profil</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: UserRole.CLIENT, title: 'Client', icon: '🏗️', desc: 'Je cherche des experts.' },
          { id: UserRole.PRESTATAIRE, title: 'Prestataire', icon: '🛠️', desc: 'Je propose mes services.' },
          { id: UserRole.FOURNISSEUR, title: 'Fournisseur', icon: '🚛', desc: 'Je vends du matériel.' }
        ].map(r => (
          <div key={r.id} onClick={() => {setRole(r.id); setStep(2);}} className="p-10 bg-white rounded-[2.5rem] shadow-xl cursor-pointer hover:scale-105 transition-all text-center border-2 border-transparent hover:border-rouge group">
            <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">{r.icon}</div>
            <h3 className="text-xl font-black text-marron-900 uppercase">{r.title}</h3>
            <p className="mt-2 text-marron-400 text-sm font-bold">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-marron-50">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-black text-marron-900 uppercase">Inscription <span className="text-rouge">{role}</span></h2>
           <button onClick={() => setStep(1)} className="text-[10px] font-black text-marron-300 uppercase underline">Retour</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input placeholder="Pseudo" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold" onChange={e => setFormData({...formData, username: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input placeholder="Ville" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold" onChange={e => setFormData({...formData, city: e.target.value})} />
          <input type="password" placeholder="Mot de passe" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold" onChange={e => setFormData({...formData, password: e.target.value})} />
          {role === UserRole.PRESTATAIRE && <input placeholder="Spécialité (ex: Plomberie)" required className="w-full px-6 py-4 bg-rouge/5 border border-rouge/20 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, specialty: e.target.value})} />}
          {role === UserRole.FOURNISSEUR && <input placeholder="Nom de la Boutique" required className="w-full px-6 py-4 bg-marron-100 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, shopName: e.target.value})} />}

          {role !== UserRole.CLIENT && (
            <div className="p-5 bg-marron-50 rounded-3xl border border-marron-100 text-[10px] text-marron-500 font-bold leading-relaxed shadow-inner">
              <label className="flex gap-4 cursor-pointer">
                <input type="checkbox" required className="mt-1 accent-rouge h-4 w-4" />
                <span>
                  J'ACCEPTE LA CLAUSE D'HEBERGEMENT : Je m'engage à payer <strong>500 FCFA / mois</strong>. Un retard entraînera une restriction après 3 semaines d'avertissement.
                </span>
              </label>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-5 bg-marron-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;