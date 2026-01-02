import React, { useState } from 'react';

interface MessageModalProps {
  proName: string;
  proId: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ proName, proId, onClose }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // 1. RÉCUPÉRATION DE L'URL DYNAMIQUE
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    const token = localStorage.getItem('token');

    // Vérification de sécurité avant l'envoi
    if (!token) {
      alert("Vous devez être connecté pour envoyer un message.");
      setSending(false);
      return;
    }

    try {
      // 2. UTILISATION DE L'URL DYNAMIQUE ICI
      const response = await fetch(`${API_URL}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token d'authentification
        },
        body: JSON.stringify({
          receiver_id: parseInt(proId),
          content: message
        }),
      });

      if (response.ok) {
        alert("Message envoyé avec succès !");
        onClose();
      } else {
        // 3. DEBUGGING : Afficher le code d'erreur exact
        const errorData = await response.json().catch(() => ({}));
        alert(`Erreur ${response.status} : ${errorData.detail || "Échec de l'envoi"}`);

        if (response.status === 401) {
          alert("Votre session a expiré. Veuillez vous reconnecter.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau : Impossible de contacter le serveur Render.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-marron-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-in border border-marron-50">
        <h3 className="text-2xl font-black text-marron-900 mb-2">Contacter {proName}</h3>
        <p className="text-marron-500 mb-6 text-sm">Posez vos questions ou demandez un devis directement.</p>

        <textarea
          className="w-full h-40 p-5 bg-marron-50 rounded-2xl border-none focus:ring-2 focus:ring-rouge transition-all outline-none resize-none"
          placeholder="Bonjour, je souhaiterais en savoir plus sur vos services..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 py-4 text-marron-400 font-bold hover:bg-marron-50 rounded-2xl transition-colors">Annuler</button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 py-4 bg-rouge text-white font-bold rounded-2xl shadow-lg hover:bg-rouge-dark transition-all transform active:scale-95 disabled:opacity-50"
          >
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;