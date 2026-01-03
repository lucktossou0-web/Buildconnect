import React, { useState, useEffect } from 'react';

const Messages: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const currentUserId = parseInt(localStorage.getItem('current_user_id') || "0");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  // 1. CHARGER L'INBOX (Liste des contacts)
  const fetchInbox = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/messages/inbox`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      // Sécurité : Si data n'est pas un tableau, on force une liste vide pour éviter le crash
      const safeData = Array.isArray(data) ? data : [];
      setContacts(safeData);

      // --- LOGIQUE ADMIN / CONTACT DIRECT ---
      const target = localStorage.getItem('admin_chat_target');
      if (target) {
        try {
          const targetUser = JSON.parse(target);
          setActiveContact(targetUser);
          // On l'ajoute en haut de liste s'il n'y est pas
          if (!safeData.find((c: any) => c.id === targetUser.id)) {
            setContacts(prev => [targetUser, ...prev]);
          }
        } catch (e) { console.error("Format target invalide"); }
        localStorage.removeItem('admin_chat_target');
      }
    } catch (err) {
      console.error("Erreur serveur inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInbox(); }, [token]);

  // 2. CHARGER LA CONVERSATION
  useEffect(() => {
    if (activeContact && token) {
      fetch(`${API_URL}/messages/conversation/${activeContact.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Sécurité : On s'assure que messages est toujours un tableau
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessages([]));
    }
  }, [activeContact, token]);

  // 3. ENVOYER UN MESSAGE
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeContact || !token) return;
    try {
      const res = await fetch(`${API_URL}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiver_id: activeContact.id, content: newMessage })
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => [...prev, msg]);
        setNewMessage("");
      }
    } catch (err) {
      alert("Impossible d'envoyer le message.");
    }
  };

  // Écran de chargement propre
  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rouge"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 h-[82vh] md:h-[85vh] flex gap-4 animate-fade-in overflow-hidden">

      {/* --- LISTE DES CONTACTS (À GAUCHE) --- */}
      <div className={`
        bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl flex flex-col border border-marron-50 overflow-hidden transition-all duration-500
        ${activeContact ? 'hidden md:flex w-1/3' : 'w-full md:w-1/3'}
      `}>
        <div className="p-6 border-b border-marron-50 bg-marron-50/20">
          <h2 className="font-black text-marron-900 text-xl tracking-tighter uppercase">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {contacts.length > 0 ? (
            contacts.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveContact(c)}
                className={`p-4 md:p-5 flex items-center gap-4 cursor-pointer transition-all border-b border-marron-50/50 ${activeContact?.id === c.id ? 'bg-marron-100/50 border-r-4 border-rouge' : 'hover:bg-marron-50'}`}
              >
                <img src={c.avatar_url} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-marron-900 truncate text-sm md:text-base">{c.shop_name || c.username}</h4>
                  <p className="text-[9px] font-bold text-marron-300 uppercase tracking-widest">Voir la discussion</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-marron-300 font-bold uppercase text-[10px] tracking-widest italic">
              Aucune conversation
            </div>
          )}
        </div>
      </div>

      {/* --- FENÊTRE DE CHAT (À DROITE) --- */}
      <div className={`
        bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col border border-marron-50 overflow-hidden transition-all duration-500
        ${!activeContact ? 'hidden md:flex flex-1' : 'w-full md:flex-1'}
      `}>
        {activeContact ? (
          <>
            {/* Header du Chat */}
            <div className="p-4 md:p-5 border-b border-marron-50 flex items-center gap-4 bg-white/80 backdrop-blur-md">
              <button onClick={() => setActiveContact(null)} className="md:hidden p-2 text-marron-400 hover:text-marron-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <img src={activeContact.avatar_url} className="w-10 h-10 rounded-full shadow-md border border-marron-50" alt="" />
              <div>
                <h3 className="font-black text-marron-900 tracking-tighter uppercase text-xs md:text-sm">{activeContact.shop_name || activeContact.username}</h3>
                <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">En ligne</span>
              </div>
            </div>

            {/* Bulles de Messages */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-4 flex flex-col bg-marron-50/10">
              {messages.map((m, i) => {
                const isMe = m.sender_id === currentUserId;
                return (
                  <div key={i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`
                      max-w-[85%] md:max-w-[75%] px-5 py-3 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-[1.8rem] shadow-sm text-xs md:text-sm font-medium leading-relaxed
                      ${isMe ? 'bg-marron-800 text-white rounded-tr-none' : 'bg-white text-marron-900 border border-marron-100 rounded-tl-none'}
                    `}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic text-marron-900">
                  <p>Début de la discussion...</p>
                </div>
              )}
            </div>

            {/* Zone d'envoi */}
            <div className="p-4 md:p-6 bg-white border-t border-marron-50">
              <div className="flex gap-3 bg-marron-50 p-2 rounded-2xl border border-marron-100 focus-within:ring-2 focus-within:ring-rouge/20 transition-all">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez..."
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-marron-900 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="p-4 bg-rouge text-white rounded-xl shadow-lg hover:rotate-6 transition-all active:scale-90 flex items-center justify-center">
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-marron-200 uppercase font-black tracking-widest p-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-marron-50 rounded-full flex items-center justify-center mb-4 text-2xl md:text-3xl">💬</div>
            <p className="text-[10px] md:text-xs">Ouvrez une conversation pour discuter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;