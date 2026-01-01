
import { UserRole, Post } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    type: UserRole.PRESTATAIRE,
    name: "Architecte Ibrahim",
    category: "Architecture & Design",
    location: "Cotonou, Fidjrossè",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop",
    description: "Conception moderne alliant tradition et innovation.",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?u=ibrahim"
  },
  {
    id: '2',
    type: UserRole.FOURNISSEUR,
    name: "Quincaillerie Le Sommet",
    category: "Matériaux de Construction",
    location: "Porto-Novo",
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=1000&auto=format&fit=crop",
    description: "Ciment, fer à béton et outillage professionnel.",
    rating: 4.7,
    avatar: "https://i.pravatar.cc/150?u=sommet"
  },
  {
    id: '3',
    type: UserRole.PRESTATAIRE,
    name: "Moussa Maçonnerie",
    category: "Gros Oeuvre",
    location: "Abomey-Calavi",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop",
    description: "Expert en fondations et élévation de murs.",
    rating: 4.5,
    avatar: "https://i.pravatar.cc/150?u=moussa"
  },
  {
    id: '4',
    type: UserRole.FOURNISSEUR,
    name: "Bénin Carrelage",
    category: "Revêtements",
    location: "Cotonou, Akpakpa",
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop",
    description: "Large choix de carreaux importés et locaux.",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?u=carrelage"
  },
  {
    id: '5',
    type: UserRole.PRESTATAIRE,
    name: "Ets Lumière",
    category: "Électricité Bâtiment",
    location: "Parakou",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop",
    description: "Installation électrique aux normes internationales.",
    rating: 4.6,
    avatar: "https://i.pravatar.cc/150?u=lumiere"
  },
  {
    id: '6',
    type: UserRole.FOURNISSEUR,
    name: "Bois du Nord",
    category: "Menuiserie & Bois",
    location: "Djougou",
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
    description: "Bois de charpente de haute qualité.",
    rating: 4.4,
    avatar: "https://i.pravatar.cc/150?u=bois"
  },
  {
    id: '7',
    type: UserRole.PRESTATAIRE,
    name: "Peinture Elite",
    category: "Finition & Déco",
    location: "Cotonou, Haie Vive",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
    description: "Finitions soignées pour vos villas et bureaux.",
    rating: 5.0,
    avatar: "https://i.pravatar.cc/150?u=peinture"
  },
  {
    id: '8',
    type: UserRole.PRESTATAIRE,
    name: "Sébastien Plomberie",
    category: "Sanitaire",
    location: "Ouidah",
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca1f963?q=80&w=1000&auto=format&fit=crop",
    description: "Dépannage et installation de systèmes complexes.",
    rating: 4.7,
    avatar: "https://i.pravatar.cc/150?u=plomberie"
  }
];
