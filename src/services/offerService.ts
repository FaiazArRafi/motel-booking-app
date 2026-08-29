import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { Offer } from '../types/offer';
import { localStore } from './localStore';

export const offerService = {
  async getActiveOffers(): Promise<Offer[]> {
    if (!isLiveFirebaseConfigured) {
      const offers = localStore.getOffers() as Offer[];
      const today = new Date().toISOString().split('T')[0];
      return offers.filter(o => o.active && (!o.endDate || o.endDate >= today));
    }

    try {
      const ref = collection(db, 'offers');
      const q = query(ref, where('active', '==', true));
      const snapshot = await getDocs(q);
      const today = new Date().toISOString().split('T')[0];
      return snapshot.docs
        .map(doc => doc.data() as Offer)
        .filter(o => !o.endDate || o.endDate >= today);
    } catch (error) {
      console.error('Error fetching offers:', error);
      return localStore.getOffers() as Offer[];
    }
  },

  async getAllOffers(): Promise<Offer[]> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getOffers() as Offer[];
    }

    try {
      const ref = collection(db, 'offers');
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => doc.data() as Offer);
    } catch (error) {
      console.error('Error fetching all offers:', error);
      return localStore.getOffers() as Offer[];
    }
  },

  async createOffer(data: Omit<Offer, 'offerId' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
    const offerId = 'offer-' + Date.now();
    const newOffer: Offer = {
      ...data,
      offerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const list = localStore.getOffers() as Offer[];
      localStore.setOffers([newOffer, ...list]);
      return newOffer;
    }

    const ref = doc(db, 'offers', offerId);
    await setDoc(ref, newOffer);
    return newOffer;
  },

  async updateOffer(offerId: string, updates: Partial<Offer>): Promise<void> {
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    if (!isLiveFirebaseConfigured) {
      const list = localStore.getOffers() as Offer[];
      localStore.setOffers(list.map(o => o.offerId === offerId ? { ...o, ...payload } : o));
      return;
    }

    const ref = doc(db, 'offers', offerId);
    await updateDoc(ref, payload);
  },

  async deleteOffer(offerId: string): Promise<void> {
    if (!isLiveFirebaseConfigured) {
      const list = localStore.getOffers() as Offer[];
      localStore.setOffers(list.filter(o => o.offerId !== offerId));
      return;
    }

    const ref = doc(db, 'offers', offerId);
    await deleteDoc(ref);
  }
};
