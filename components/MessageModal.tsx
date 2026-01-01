import React, { useState } from 'react';

interface MessageModalProps {
  proName: string;
  proId: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ proName, proId, onClose }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        alert("Erreur lors de l'envoi.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-marron-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-in">
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