
export enum UserRole {
  CLIENT = 'client',
  PRESTATAIRE = 'prestataire',
  FOURNISSEUR = 'fournisseur'
}

export interface Post {
  id: string;
  type: UserRole;
  name: string;
  category: string;
  location: string;
  imageUrl: string;
  description: string;
  rating: number;
  avatar: string;
}

export interface UserState {
  isLoggedIn: boolean;
  role: UserRole | null;
  username: string | null;
}

export enum UserRole {
  CLIENT = 'client',
  PRESTATAIRE = 'prestataire',
  FOURNISSEUR = 'fournisseur'
}

export interface UserState {
  isLoggedIn: boolean;
  role: UserRole | null;
  username: string | null;
  userId?: number | null;
  isAdmin?: boolean;
}