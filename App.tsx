import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';
import Register from './components/Register';
import Profile from './components/Profile';
import Messages from './components/Messages';
import { UserRole } from './types';

// Hook de gestion de l'historique pour supporter le bouton Retour et Alt+<-
const useNavigation = (initialPage = 'home') => {
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    // Gestion du bouton retour navigateur (popstate)
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setPage(event.state.page);
      } else {
        setPage(initialPage);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialPage]);

  const navigate = (newPage: string) => {
    window.history.pushState({ page: newPage }, '', `#${newPage}`);
    setPage(newPage);
  };

  return { page, navigate };
};

/** 
 * COMPOSANT HOMEPAGE
 */
const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videos = [
    {
      title: 'BuildConnect',
      subtitle: "L'écosystème béninois du BTP",
      description: 'Connectez-vous avec les meilleurs professionnels de la construction.',
      videoSrc: '/video1.mp4'
    },
    {
      title: 'Trouvez',
      subtitle: "Des milliers de professionnels",
      description: 'Architectes, maçons, électriciens et plus, vérifiés pour vous.',
      videoSrc: '/video2.mp4'
    },
    {
      title: 'Construisez',
      subtitle: "Vos projets en toute confiance",
      description: 'De la conception à la réalisation, un suivi digitalisé.',
      videoSrc: '/video3.mp4'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 600);
    }, 8000);
    return () => clearInterval(timer);
  }, [videos.length]);

  return (
    <div className="bg-white font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-30px); } }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .fade-out { animation: fadeOut 0.6s ease-out forwards; }
        .video-overlay { background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 70%); }
        .progress-circle { width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); transition: all 0.3s ease; }
        .progress-circle.active { background: white; width: 32px; border-radius: 4px; }
        .text-reveal { opacity: 0; animation: fadeIn 1s ease-out forwards; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
      `}</style>

      {/* HERO SECTION */}
      <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-black">
        <video
          key={currentVideo}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}
        >
          <source src={videos[currentVideo].videoSrc} type="video/mp4" />
        </video>

        <div className="absolute inset-0 video-overlay z-10"></div>

        <div className="absolute inset-0 flex items-center z-20">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-16">
            <div className="max-w-2xl">
              <div className={`mb-8 ${isTransitioning ? 'fade-out' : 'text-reveal delay-1'}`}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/80 font-bold">
                  {videos[currentVideo].subtitle}
                </p>
              </div>

              <div className={`mb-6 ${isTransitioning ? 'fade-out' : 'text-reveal delay-2'}`}>
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-light text-white tracking-tight">
                  {videos[currentVideo].title.split('Connect')[0]}
                  <span className="font-bold text-red-600">
                    {videos[currentVideo].title.includes('Connect') ? 'Connect' : ''}
                  </span>
                </h1>
              </div>

              <div className={`mb-12 ${isTransitioning ? 'fade-out' : 'text-reveal delay-3'}`}>
                <p className="text-xl text-white/90 font-light max-w-lg leading-relaxed">
                  {videos[currentVideo].description}
                </p>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-10 py-4 bg-white text-gray-900 text-sm uppercase tracking-widest font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Démarrer
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-10 py-4 border-2 border-white text-white text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-8 lg:left-16 flex gap-3 z-30">
          {videos.map((_, index) => (
            <div key={index} className={`progress-circle ${currentVideo === index ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      {/* SECTION STATS */}
      <div className="py-32 px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-widest text-red-600 font-bold">À propos de nous</p>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Révolutionner le BTP<br />au Bénin
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-xl">
                BuildConnect est la première plateforme digitale qui connecte les professionnels
                du bâtiment et les clients, en apportant transparence, qualité et rapidité à vos chantiers.
              </p>
              <div className="pt-6">
                <button
                  onClick={() => onNavigate('feed')}
                  className="px-8 py-3 bg-white border-2 border-red-600 text-red-600 text-sm uppercase tracking-widest font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Voir les professionnels
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-12">
                <div><div className="text-4xl font-light">25K</div><div className="text-[10px] uppercase text-gray-500">Entreprises</div></div>
                <div><div className="text-4xl font-light">80K+</div><div className="text-[10px] uppercase text-gray-500">Artisans</div></div>
                <div><div className="text-4xl font-light">400K</div><div className="text-[10px] uppercase text-gray-500">Projets/an</div></div>
              </div>
            </div>
            <div className="bg-gray-100 aspect-video rounded-2xl overflow-hidden relative shadow-2xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video4.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION MÉTIERS */}
      <div className="py-32 px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-light text-gray-900">Tous les métiers <span className="font-bold text-red-600">du BTP</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 shadow-sm">
            {[
              { title: 'Gros Œuvre', items: ['Maçons', 'Terrassiers', 'Charpentiers', 'Coffreurs'] },
              { title: 'Second Œuvre', items: ['Électriciens', 'Plombiers', 'Carreleurs', 'Peintres'] },
              { title: 'Finitions', items: ['Architectes d\'intérieur', 'Décorateurs', 'Menuisiers', 'Paysagistes'] },
              { title: 'Conception', items: ['Architectes', 'Bureaux d\'études', 'Géomètres', 'Designers 3D'] }
            ].map((category, idx) => (
              <div key={idx} className="bg-white p-10 hover:bg-red-50 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-3">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 font-light">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPOSANT PRINCIPAL (App)
 */
const App = () => {
  const { page, navigate } = useNavigation('home');
  const [user, setUser] = useState<{ isLoggedIn: boolean; username: string | null; role: UserRole | null; id: number | null; isAdmin: boolean }>({ isLoggedIn: false, username: null, role: null, id: null, isAdmin: false });
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ isLoggedIn: true, username: loginCredentials.username, role: UserRole.PRESTATAIRE, id: 1, isAdmin: false });
    navigate('feed');
  };

  const handleRegisterSuccess = (username: string, role: any, id: any, isAdmin: boolean) => {
    setUser({ isLoggedIn: true, username, role, id, isAdmin });
    navigate('feed');
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, username: null, role: null, id: null, isAdmin: false });
    navigate('home');
  };

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={navigate} />;

      case 'login':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-12 shadow-2xl border border-gray-100 rounded-3xl">
              <h2 className="text-4xl font-light mb-8 text-center text-gray-900">Build<span className="font-bold text-red-600">Connect</span></h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input
                  type="text" placeholder="Nom d'utilisateur"
                  className="w-full border-b py-3 outline-none focus:border-red-600 transition-colors bg-transparent border-gray-300"
                  value={loginCredentials.username}
                  onChange={e => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                />
                <input
                  type="password" placeholder="Mot de passe"
                  className="w-full border-b py-3 outline-none focus:border-red-600 transition-colors bg-transparent border-gray-300"
                  value={loginCredentials.password}
                  onChange={e => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                />
                <button className="w-full bg-gray-900 text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-black transition-all rounded-xl shadow-lg mt-8">
                  Connexion
                </button>
              </form>
              <button onClick={() => navigate('home')} className="w-full text-center mt-8 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">← Retour à l'accueil</button>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="min-h-screen bg-[#F0F0F0]">
            <Register
              onSuccess={handleRegisterSuccess}
              onNavigate={navigate}
              initialRole={null}
            />
          </div>
        );

      case 'feed':
        return (
          <div className="min-h-screen bg-[#FAFAFA]">
            <Feed onViewProfile={(id) => { setSelectedProfileId(id); navigate('profile'); }} />
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-[#FAFAFA]">
            <Profile
              userId={selectedProfileId}
              isMe={user.isLoggedIn && Number(user.id) === selectedProfileId}
              onBack={() => navigate('feed')}
            />
          </div>
        );

      case 'messages':
        return <Messages />;

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <Layout user={user as any} onLogout={handleLogout} onNavigate={navigate}>
      {renderContent()}
    </Layout>
  );
};

export default App;