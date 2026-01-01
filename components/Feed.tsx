import React, { useState, useEffect } from 'react';
import { Post, UserRole } from '../types';
import MessageModal from './MessageModal'; // <-- IMPORT DE LA MODALE

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | UserRole.PRESTATAIRE | UserRole.FOURNISSEUR>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // <-- ÉTAT POUR GÉRER LA MODALE
  const [selectedPro, setSelectedPro] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/feed/');

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

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
    const matchesSearch =
      post.name.toLowerCase().includes(filter.toLowerCase()) ||
      post.category.toLowerCase().includes(filter.toLowerCase()) ||
      post.location.toLowerCase().includes(filter.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rouge"></div>
        <p className="mt-4 text-marron-600 font-medium">Recherche des meilleurs talents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-rouge">
        <p>Erreur : {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-marron-900 underline font-bold"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-marron-900 tracking-tight">Projets & Professionnels</h1>
          <p className="text-marron-600 mt-2">Découvrez les meilleurs talents du BTP au Bénin.</p>
        </div>

        <div className="w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un métier, une ville..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-marron-100 shadow-sm focus:ring-2 focus:ring-marron-500 focus:outline-none transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-marron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-marron-800 text-white shadow-lg transform scale-105' : 'bg-white text-marron-600 border border-marron-100 hover:bg-marron-50'}`}
        >
          Tout voir
        </button>
        <button
          onClick={() => setActiveTab(UserRole.PRESTATAIRE)}
          className={`px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === UserRole.PRESTATAIRE ? 'bg-rouge text-white shadow-lg transform scale-105' : 'bg-white text-marron-600 border border-marron-100 hover:bg-marron-50'}`}
        >
          Prestataires
        </button>
        <button
          onClick={() => setActiveTab(UserRole.FOURNISSEUR)}
          className={`px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === UserRole.FOURNISSEUR ? 'bg-marron-600 text-white shadow-lg transform scale-105' : 'bg-white text-marron-600 border border-marron-100 hover:bg-marron-50'}`}
        >
          Fournisseurs
        </button>
      </div>

      {/* Grid Feed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
        {filteredPosts.map((post, idx) => (
          <div
            key={post.id}
            className="group relative bg-white rounded-3xl overflow-hidden border border-marron-50 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marron-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-5">
              <div className="flex items-center space-x-3 mb-3">
                <img src={post.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                <div>
                  <h3 className="font-bold text-marron-900 group-hover:text-rouge transition-colors truncate w-32">{post.name}</h3>
                  <p className="text-xs text-marron-500">{post.location}</p>
                </div>
                <div className="ml-auto flex items-center bg-champagne/30 px-2 py-1 rounded-lg">
                  <span className="text-yellow-600 text-xs font-bold">★ {post.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-marron-400">{post.category}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${post.type === UserRole.PRESTATAIRE ? 'bg-rouge/10 text-rouge' : 'bg-marron-100 text-marron-800'}`}>
                  {post.type}
                </span>
              </div>
            </div>

            {/* Hover Actions MODIFIÉ ICI */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
               <button
                onClick={() => setSelectedPro({id: post.id, name: post.name})}
                className="bg-white text-marron-900 px-6 py-2 rounded-full font-bold shadow-xl hover:bg-champagne transition-colors"
               >
                 Contacter
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* RENDU CONDITIONNEL DE LA MODALE */}
      {selectedPro && (
        <MessageModal
          proName={selectedPro.name}
          proId={selectedPro.id}
          onClose={() => setSelectedPro(null)}
        />
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <div className="text-marron-200 text-8xl mb-4">📭</div>
          <p className="text-marron-500 text-xl font-medium">Aucun résultat trouvé pour votre recherche.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;