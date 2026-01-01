import React, { useState } from 'react';
import { UserRole } from '../types';

interface RegisterProps {
  onSuccess: (username: string, role: UserRole) => void;
  onNavigate: (page: string) => void;
  initialRole?: UserRole | null;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onNavigate, initialRole }) => {
  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [role, setRole] = useState<UserRole | null>(initialRole || null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    city: 'Cotonou', // Valeur par défaut
    specialty: '',
    shopName: '',
  });

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Préparation du corps de la requête pour correspondre au schéma Python (snake_case)
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: role,
      city: formData.city,
      // On n'envoie les champs que s'ils sont remplis
      specialty: role === UserRole.PRESTATAIRE ? formData.specialty : null,
      shop_name: role === UserRole.FOURNISSEUR ? formData.shopName : null,
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        // Stockage du token
        localStorage.setItem('token', data.access_token);
        // Notification du succès au composant parent (App.tsx)
        onSuccess(data.username, data.role as UserRole);
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Erreur lors de l'inscription");
      }
    } catch (error) {
      alert("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-marron-900 mb-4">Choisissez votre profil</h2>
        <p className="text-marron-600 text-center mb-12">L'aventure BuildConnect commence ici. Quel est votre rôle ?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: UserRole.CLIENT, title: 'Client', desc: 'Je cherche des pros.', icon: '🏗️', color: 'hover:border-marron-500 hover:bg-marron-50' },
            { id: UserRole.PRESTATAIRE, title: 'Prestataire', desc: 'Je propose mes services.', icon: '🛠️', color: 'hover:border-rouge hover:bg-rouge/5' },
            { id: UserRole.FOURNISSEUR, title: 'Fournisseur', desc: 'Je vends des matériaux.', icon: '🚛', color: 'hover:border-marron-800 hover:bg-marron-100' }
          ].map((item) => (
            <div key={item.id} onClick={() => handleRoleSelect(item.id)} className={`p-10 bg-white rounded-3xl border-2 border-transparent shadow-xl cursor-pointer transition-all transform hover:-translate-y-2 text-center group ${item.color}`}>
              <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
              <h3 className="text-2xl font-bold text-marron-900 mb-2">{item.title}</h3>
              <p className="text-marron-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-marron-50 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-marron-900 tracking-tight">Inscription <span className="text-rouge">{role}</span></h2>
          <button onClick={() => setStep(1)} className="text-sm text-marron-400 hover:text-marron-900 transition-colors">← Retour</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-marron-700 mb-2">Pseudo</label>
            <input type="text" required className="w-full px-5 py-4 bg-marron-50/50 border border-marron-100 rounded-2xl focus:ring-2 focus:ring-marron-500 outline-none transition-all" placeholder="Ex: Moussa_Dev"
              value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-marron-700 mb-2">Email</label>
            <input type="email" required className="w-full px-5 py-4 bg-marron-50/50 border border-marron-100 rounded-2xl focus:ring-2 focus:ring-marron-500 outline-none transition-all" placeholder="moussa@example.bj"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-marron-700 mb-2">Ville</label>
            <input type="text" required className="w-full px-5 py-4 bg-marron-50/50 border border-marron-100 rounded-2xl focus:ring-2 focus:ring-marron-500 outline-none transition-all" placeholder="Ex: Cotonou, Parakou..."
              value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-marron-700 mb-2">Mot de passe</label>
            <input type="password" required className="w-full px-5 py-4 bg-marron-50/50 border border-marron-100 rounded-2xl focus:ring-2 focus:ring-marron-500 outline-none transition-all" placeholder="••••••••"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {role === UserRole.PRESTATAIRE && (
            <div className="animate-slide-up">
              <label className="block text-sm font-bold text-rouge mb-2">Votre Spécialité</label>
              <input type="text" required className="w-full px-5 py-4 bg-rouge/5 border border-rouge/20 rounded-2xl focus:ring-2 focus:ring-rouge outline-none" placeholder="Ex: Électricien, Maçon..."
                value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
            </div>
          )}

          {role === UserRole.FOURNISSEUR && (
            <div className="animate-slide-up">
              <label className="block text-sm font-bold text-marron-800 mb-2">Nom de la Boutique</label>
              <input type="text" required className="w-full px-5 py-4 bg-marron-100 border border-marron-200 rounded-2xl focus:ring-2 focus:ring-marron-800 outline-none" placeholder="Ex: Quincaillerie Bénin Top"
                value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})} />
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full py-5 bg-marron-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all transform active:scale-95 shadow-lg disabled:opacity-50">
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;