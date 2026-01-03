import React, { useState, useEffect } from 'react';
import { Post, UserRole } from '../types';
import MessageModal from './MessageModal';

interface FeedProps {
  onViewProfile: (id: number) => void;
}

const Feed: React.FC<FeedProps> = ({ onViewProfile }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | UserRole.PRESTATAIRE | UserRole.FOURNISSEUR>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPro, setSelectedPro] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${API_URL}/feed/`);
        if (!response.ok) throw new Error('Erreur');
        const data = await response.json();
        setPosts(data.map((u: any) => ({
          id: u.id.toString(), type: u.role, name: u.shop_name || u.username,
          category: u.category || u.specialty || 'BTP', location: u.city,
          imageUrl: u.avatar_url, rating: u.rating, avatar: u.avatar_url
        })));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchTalents();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesTab = activeTab === 'all' || post.type === activeTab;
    const matchesSearch = post.name.toLowerCase().includes(filter.toLowerCase()) ||
                         post.location.toLowerCase().includes(filter.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rouge"></div>
      <p className="mt-4 text-marron-400 text-[10px] font-black uppercase tracking-widest">Chargement...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-8 py-6 md:py-12">

      {/* --- EN-TÊTE ADAPTATIF --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-6">
        <div>
          <h1 className="text-2xl md:text-5xl font-black text-marron-900 tracking-tighter leading-tight">
            Projets & <br className="md:hidden" /> Professionels
          </h1>
          <p className="text-marron-400 mt-1 uppercase text-[8px] md:text-[10px] font-bold tracking-[0.2em]">L'excellence au Bénin</p>
        </div>
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Métier, ville..."
            className="w-full px-4 py-3 md:px-6 md:py-4 bg-white border border-marron-100 rounded-xl md:rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-marron-500 text-xs md:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* --- FILTRES SCROLLABLES --- */}
      <div className="flex space-x-2 md:space-x-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {['all', UserRole.PRESTATAIRE, UserRole.FOURNISSEUR].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 md:px-8 py-2 md:py-3 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-marron-800 text-white shadow-lg' : 'bg-white text-marron-600 border border-marron-100'}`}
          >
            {tab === 'all' ? 'Tout voir' : tab + 's'}
          </button>
        ))}
      </div>

      {/* --- GRILLE : 2 COLONNES SUR MOBILE, 4 SUR DESKTOP --- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
        {filteredPosts.map((post, idx) => (
          <div key={post.id} className="group relative bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-marron-50 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer">

            {/* Image Section */}
            <div className="aspect-[4/5] overflow-hidden">
              <img src={post.imageUrl} alt={post.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-marron-900/90 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Infos Section (Compacte) */}
            <div className="p-3 md:p-5">
              <div className="flex items-center space-x-2 mb-2">
                <img src={post.avatar} alt="" className="w-6 h-6 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-marron-900 text-[11px] md:text-sm truncate leading-tight">{post.name}</h3>
                  <p className="text-[7px] md:text-[9px] text-marron-500 font-bold uppercase truncate">{post.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 md:mt-4">
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-marron-300 truncate flex-1 mr-1">{post.category}</span>
                <div className="flex items-center bg-champagne/30 px-1.5 py-0.5 rounded text-yellow-600">
                  <span className="text-[8px] md:text-[10px] font-black">★ {post.rating}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS : Overlay sur Desktop / Toujours dispo au touch sur mobile */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all bg-marron-900/40 backdrop-blur-[2px] md:backdrop-blur-none">
               <button
                onClick={(e) => { e.stopPropagation(); onViewProfile(parseInt(post.id)); }}
                className="bg-white text-marron-900 px-4 md:px-6 py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase shadow-xl hover:bg-black hover:text-white transition-all tracking-tighter"
               >
                 Réalisations
               </button>
               <button
                onClick={(e) => { e.stopPropagation(); setSelectedPro({id: post.id, name: post.name}); }}
                className="bg-rouge text-white px-4 md:px-6 py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase shadow-xl hover:bg-rouge-dark transition-all tracking-tighter"
               >
                 Contacter
               </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <div className="text-marron-200 text-6xl mb-4 animate-bounce">📭</div>
          <p className="text-marron-500 text-sm font-black uppercase tracking-widest">Aucun résultat</p>
        </div>
      )}

      {selectedPro && <MessageModal proName={selectedPro.name} proId={selectedPro.id} onClose={() => setSelectedPro(null)} />}
    </div>
  );
};

export default Feed;