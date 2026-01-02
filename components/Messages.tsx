import React, { useState, useEffect } from 'react';
import { UserOut, MessageOut } from '../types';

const Messages: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem('token');
  // RÉCUPÉRATION DE TON ID (stocké lors du login)
  const currentUserId = parseInt(localStorage.getItem('current_user_id') || "0");
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Charger l'inbox (liste des gens à qui on a parlé)
  useEffect(() => {
    fetch(`${API_URL}/messages/inbox`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setContacts(data));
  }, [token, API_URL]);

  // 2. Charger la conversation spécifique
  useEffect(() => {
    if (activeContact) {
      fetch(`${API_URL}/messages/conversation/${activeContact.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMessages(data));
    }
  }, [activeContact, token, API_URL]);

  // 3. Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;
    const response = await fetch(`${API_URL}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ receiver_id: activeContact.id, content: newMessage })
    });
    if (response.ok) {
      const msg = await response.json();
      setMessages([...messages, msg]);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[85vh] flex gap-6 animate-fade-in">

      {/* --- LISTE DES CONTACTS (À GAUCHE) --- */}
      <div className="w-1/3 bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-marron-50">
        <div className="p-6 border-b border-marron-50 bg-marron-50/20">
          <h2 className="text-2xl font-black text-marron-900 tracking-tight">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.length > 0 ? (
            contacts.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveContact(c)}
                className={`p-5 flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                  activeContact?.id === c.id ? 'bg-marron-100/50 border-r-4 border-rouge' : 'hover:bg-marron-50'
                }`}
              >
                <img src={c.avatar_url} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="" />
                <div className="flex-1">
                  <h4 className="font-bold text-marron-900">{c.shop_name || c.username}</h4>
                  <p className="text-xs text-marron-400 truncate w-32">Cliquer pour discuter</p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-marron-300 text-sm italic">Aucune conversation</p>
          )}
        </div>
      </div>

      {/* --- FENÊTRE DE CHAT (À DROITE) --- */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl flex flex-col border border-marron-50 overflow-hidden relative">
        {activeContact ? (
          <>
            {/* Header du Chat */}
            <div className="p-5 border-b border-marron-50 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <img src={activeContact.avatar_url} className="w-10 h-10 rounded-full shadow-md" alt="" />
              <div>
                <h3 className="font-black text-marron-900">{activeContact.shop_name || activeContact.username}</h3>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">En ligne</span>
              </div>
            </div>

            {/* Zone des bulles de messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-marron-50/10 flex flex-col">
              {messages.map((m, i) => {
                // LOGIQUE CRUCIALE : On compare l'ID de l'envoyeur avec le nôtre
                const isMe = m.sender_id === currentUserId;

                return (
                  <div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`max-w-[75%] px-5 py-3 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed
                      ${isMe
                        ? 'bg-marron-800 text-white rounded-tr-none' // Style "Moi"
                        : 'bg-white text-marron-900 border border-marron-100 rounded-tl-none' // Style "Lui"
                      }`}
                    >
                      {m.content}
                      <p className={`text-[9px] mt-1 opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barre d'envoi de message */}
            <div className="p-6 bg-white border-t border-marron-50">
              <div className="flex gap-3 bg-marron-50 p-2 rounded-2xl border border-marron-100 focus-within:ring-2 focus-within:ring-rouge/20 transition-all">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-marron-900 placeholder-marron-300"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="p-3 bg-rouge text-white rounded-xl shadow-lg hover:bg-rouge-dark hover:scale-105 active:scale-95 transition-all"
                >
                   <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                   </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* État vide si aucune conversation n'est sélectionnée */
          <div className="flex-1 flex flex-col items-center justify-center text-marron-200">
            <div className="w-20 h-20 bg-marron-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
            <p className="font-bold text-lg text-marron-300">Sélectionnez un contact pour discuter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;