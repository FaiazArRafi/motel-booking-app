export type UserRole = 'guest' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}
