import React, { useState, useEffect } from 'react';
import { UserOut, MessageOut } from '../types'; // Assure-toi d'avoir ces types

const Messages: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem('token');

  // Charger la liste des contacts
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/messages/inbox', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setContacts(data));
  }, []);

  // Charger la conversation quand on clique sur un contact
  useEffect(() => {
    if (activeContact) {
      fetch(`http://localhost:8000/api/v1/messages/conversation/${activeContact.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMessages(data));
    }
  }, [activeContact]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const response = await fetch('http://localhost:8000/api/v1/messages/', {
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
    <div className="max-w-6xl mx-auto px-4 py-8 h-[80vh] flex gap-6">
      {/* Liste des contacts */}
      <div className="w-1/3 bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-marron-50">
        <div className="p-6 border-b border-marron-50">
          <h2 className="text-2xl font-black text-marron-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={`p-5 flex items-center gap-4 cursor-pointer transition-colors ${activeContact?.id === c.id ? 'bg-marron-50' : 'hover:bg-marron-50/50'}`}
            >
              <img src={c.avatar_url} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="" />
              <div>
                <h4 className="font-bold text-marron-900">{c.shop_name || c.username}</h4>
                <p className="text-xs text-marron-500 truncate w-32">Cliquer pour lire...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fenêtre de chat */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl flex flex-col border border-marron-50 overflow-hidden">
        {activeContact ? (
          <>
            <div className="p-6 border-b border-marron-50 flex items-center gap-4 bg-marron-50/30">
              <img src={activeContact.avatar_url} className="w-10 h-10 rounded-full" alt="" />
              <h3 className="font-bold text-marron-900">{activeContact.shop_name || activeContact.username}</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-marron-50/10">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender_id === activeContact.id ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl shadow-sm ${m.sender_id === activeContact.id ? 'bg-white text-marron-800 rounded-tl-none' : 'bg-rouge text-white rounded-tr-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white border-t border-marron-50 flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-6 py-4 bg-marron-50 rounded-2xl outline-none focus:ring-2 focus:ring-rouge transition-all"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="p-4 bg-rouge text-white rounded-2xl shadow-lg hover:bg-rouge-dark transition-transform active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-marron-300">
            <div className="text-6xl mb-4">💬</div>
            <p className="font-medium">Sélectionnez une conversation pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;