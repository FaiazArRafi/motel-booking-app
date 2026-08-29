import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db, isLiveFirebaseConfigured } from '../config/firebase';
import { UserProfile, UserRole } from '../types/auth';
import { localStore } from './localStore';

export const authService = {
  /**
   * Fetch User Profile and Role from Firestore (/users/{uid})
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!isLiveFirebaseConfigured) {
      const users = localStore.getUsers() as UserProfile[];
      return users.find(u => u.uid === uid) || null;
    }

    try {
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile from Firestore:', error);
      return null;
    }
  },

  /**
   * Create or sync user profile document in Firestore
   */
  async syncUserProfile(user: FirebaseUser, fallbackRole: UserRole = 'guest', customData?: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.getUserProfile(user.uid);
    if (existing) {
      return existing;
    }

    const isAdminEmail = Boolean(
      user.email && (
        user.email.toLowerCase() === 'admin@pinecrestmotel.com' ||
        user.email.toLowerCase().startsWith('admin@')
      )
    );

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || customData?.displayName || user.email?.split('@')[0] || 'Manager',
      phoneNumber: user.phoneNumber || customData?.phoneNumber || '',
      role: isAdminEmail ? 'admin' : fallbackRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const users = localStore.getUsers() as UserProfile[];
      localStore.setUsers([...users.filter(u => u.uid !== user.uid), newProfile]);
      return newProfile;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error saving user profile to Firestore:', error);
      return newProfile;
    }
  },

  /**
   * Sign in with Email and Password
   */
  async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    if (!isLiveFirebaseConfigured) {
      const users = localStore.getUsers() as UserProfile[];
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        localStorage.setItem('motel_current_user', JSON.stringify(found));
        return found;
      }
      // If demo user doesn't exist, create guest
      const newGuest: UserProfile = {
        uid: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'guest',
        createdAt: new Date().toISOString()
      };
      localStore.setUsers([...users, newGuest]);
      localStorage.setItem('motel_current_user', JSON.stringify(newGuest));
      return newGuest;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    let profile = await this.getUserProfile(userCredential.user.uid);
    if (!profile) {
      profile = await this.syncUserProfile(userCredential.user, 'guest');
    }
    return profile;
  },

  /**
   * Sign up with Email, Password & details
   */
  async registerWithEmail(email: string, password: string, displayName: string, phoneNumber?: string): Promise<UserProfile> {
    if (!isLiveFirebaseConfigured) {
      const users = localStore.getUsers() as UserProfile[];
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }
      const newGuest: UserProfile = {
        uid: 'user-' + Date.now(),
        email,
        displayName,
        phoneNumber: phoneNumber || '',
        role: 'guest', // Guests NEVER select admin at signup
        createdAt: new Date().toISOString()
      };
      localStore.setUsers([...users, newGuest]);
      localStorage.setItem('motel_current_user', JSON.stringify(newGuest));
      return newGuest;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { displayName });
    }
    const profile = await this.syncUserProfile(userCredential.user, 'guest', { displayName, phoneNumber });
    return profile;
  },

  /**
   * Google Sign-In
   */
  async loginWithGoogle(): Promise<UserProfile> {
    if (!isLiveFirebaseConfigured) {
      const googleUser: UserProfile = {
        uid: 'google-user-' + Date.now(),
        email: 'traveler.google@example.com',
        displayName: 'Google Guest',
        role: 'guest',
        createdAt: new Date().toISOString()
      };
      const users = localStore.getUsers() as UserProfile[];
      localStore.setUsers([...users.filter(u => u.uid !== googleUser.uid), googleUser]);
      localStorage.setItem('motel_current_user', JSON.stringify(googleUser));
      return googleUser;
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    let profile = await this.getUserProfile(result.user.uid);
    if (!profile) {
      profile = await this.syncUserProfile(result.user, 'guest');
    }
    return profile;
  },

  /**
   * Log out
   */
  async logout(): Promise<void> {
    localStorage.removeItem('motel_current_user');
    if (isLiveFirebaseConfigured) {
      await firebaseSignOut(auth);
    }
  },

  /**
   * Update Profile Info
   */
  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!isLiveFirebaseConfigured) {
      const users = localStore.getUsers() as UserProfile[];
      const updatedUsers = users.map(u => u.uid === uid ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u);
      localStore.setUsers(updatedUsers);
      const current = localStorage.getItem('motel_current_user');
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.uid === uid) {
          localStorage.setItem('motel_current_user', JSON.stringify({ ...parsed, ...updates }));
        }
      }
      return;
    }

    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Fetch all registered users for Admin view
   */
  async getAllUsers(): Promise<UserProfile[]> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getUsers() as UserProfile[];
    }

    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }
};
