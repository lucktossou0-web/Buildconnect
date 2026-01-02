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
  const [error, setError] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/feed/`);
        if (!response.ok) throw new Error('Erreur serveur');
        const data = await response.json();

        const formattedPosts: Post[] = data.map((user: any) => ({
          id: user.id.toString(),
          type: user.role,
          name: user.role === UserRole.FOURNISSEUR ? user.shop_name : user.username,
          category: user.category || user.specialty || 'BTP',
          location: user.city,
          imageUrl: user.avatar_url,
          description: user.description || '',
          rating: user.rating,
          avatar: user.avatar_url
        }));
        setPosts(formattedPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTalents();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesTab = activeTab === 'all' || post.type === activeTab;
    const matchesSearch = post.name.toLowerCase().includes(filter.toLowerCase()) ||
                         post.category.toLowerCase().includes(filter.toLowerCase()) ||
                         post.location.toLowerCase().includes(filter.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rouge"></div>
      <p className="mt-4 text-marron-600 font-medium tracking-tight font-black">Recherche des meilleurs talents...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-marron-900 tracking-tighter">Projets & Professionnels</h1>
          <p className="text-marron-600 mt-2 font-medium">Découvrez les meilleurs talents du BTP au Bénin.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <input type="text" placeholder="Rechercher un métier, une ville..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-marron-100 shadow-sm focus:ring-2 focus:ring-marron-500 outline-none transition-all" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-marron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['all', UserRole.PRESTATAIRE, UserRole.FOURNISSEUR].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-marron-800 text-white shadow-lg transform scale-105' : 'bg-white text-marron-600 border border-marron-100 hover:bg-marron-50'}`}>
            {tab === 'all' ? 'Tout voir' : tab + 's'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
        {filteredPosts.map((post, idx) => (
          <div key={post.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-marron-50 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="aspect-[4/5] overflow-hidden">
              <img src={post.imageUrl} alt={post.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-marron-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-3 mb-3">
                <img src={post.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-marron-900 group-hover:text-rouge transition-colors truncate">{post.name}</h3>
                  <p className="text-[10px] text-marron-500 font-bold uppercase">{post.location}</p>
                </div>
                <div className="flex items-center bg-champagne/30 px-2 py-1 rounded-lg"><span className="text-yellow-600 text-[10px] font-black">★ {post.rating}</span></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-marron-400">{post.category}</span>
                <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${post.type === UserRole.PRESTATAIRE ? 'bg-rouge/10 text-rouge' : 'bg-marron-100 text-marron-800'}`}>{post.type}</span>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-[85%] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
               <button onClick={() => onViewProfile(parseInt(post.id))} className="bg-white text-marron-900 py-3 rounded-full font-black text-xs shadow-xl hover:bg-black hover:text-white transition-all uppercase tracking-widest">Voir Réalisations</button>
               <button onClick={() => setSelectedPro({id: post.id, name: post.name})} className="bg-rouge text-white py-3 rounded-full font-black text-xs shadow-xl hover:bg-rouge-dark transition-all uppercase tracking-widest">Contacter</button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <div className="text-marron-200 text-8xl mb-4 animate-bounce">📭</div>
          <p className="text-marron-500 text-xl font-bold tracking-tight">Aucun résultat trouvé.</p>
        </div>
      )}

      {selectedPro && <MessageModal proName={selectedPro.name} proId={selectedPro.id} onClose={() => setSelectedPro(null)} />}
    </div>
  );
};

export default Feed;;