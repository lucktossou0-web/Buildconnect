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

  const [formData, setFormData] = useState({
    username: '', password: '', email: '', city: 'Cotonou', specialty: '', shopName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: role,
      city: formData.city,
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
        // On appelle onSuccess avec TOUS les paramètres
        onSuccess(data.username, data.role as UserRole, data.user_id, data.is_admin);
      } else {
        alert(data.detail || "Erreur lors de l'inscription");
      }
    } catch (error) {
      // On ne met plus d'alerte ici si ça a marché en fond
      console.error("Erreur réseau ou parsing:", error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center text-marron-900 mb-12 uppercase tracking-widest">Choisissez votre profil</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: UserRole.CLIENT, title: 'Client', icon: '🏗️', color: 'hover:border-marron-500' },
            { id: UserRole.PRESTATAIRE, title: 'Prestataire', icon: '🛠️', color: 'hover:border-rouge' },
            { id: UserRole.FOURNISSEUR, title: 'Fournisseur', icon: '🚛', color: 'hover:border-marron-800' }
          ].map((item) => (
            <div key={item.id} onClick={() => { setRole(item.id); setStep(2); }} className={`p-10 bg-white rounded-[2.5rem] border-2 border-transparent shadow-xl cursor-pointer transition-all transform hover:-translate-y-2 text-center ${item.color}`}>
              <div className="text-6xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-black text-marron-900">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-marron-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-marron-900">Inscription <span className="text-rouge">{role}</span></h2>
          <button onClick={() => setStep(1)} className="text-xs font-bold text-marron-300 uppercase underline">Retour</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Pseudo" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold"
            value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="text" placeholder="Ville" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold"
            value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
          <input type="password" placeholder="Mot de passe" required className="w-full px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold"
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

          {role === UserRole.PRESTATAIRE && (
            <input type="text" placeholder="Spécialité (ex: Maçon)" required className="w-full px-6 py-4 bg-rouge/5 border border-rouge/10 rounded-2xl outline-none focus:ring-2 focus:ring-rouge font-bold"
              value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
          )}
          {role === UserRole.FOURNISSEUR && (
            <input type="text" placeholder="Nom de la boutique" required className="w-full px-6 py-4 bg-marron-100/50 rounded-2xl outline-none focus:ring-2 focus:ring-marron-800 font-bold"
              value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})} />
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