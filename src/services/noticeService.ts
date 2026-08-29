import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { Notice } from '../types/notice';
import { localStore } from './localStore';

export const noticeService = {
  async getActiveNotices(): Promise<Notice[]> {
    if (!isLiveFirebaseConfigured) {
      const notices = localStore.getNotices() as Notice[];
      return notices.filter(n => n.active);
    }

    try {
      const ref = collection(db, 'notices');
      const q = query(ref, where('active', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Notice);
    } catch (error) {
      console.error('Error fetching notices:', error);
      return localStore.getNotices() as Notice[];
    }
  },

  async getAllNotices(): Promise<Notice[]> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getNotices() as Notice[];
    }

    try {
      const ref = collection(db, 'notices');
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => doc.data() as Notice);
    } catch (error) {
      console.error('Error fetching all notices:', error);
      return localStore.getNotices() as Notice[];
    }
  },

  async createNotice(data: Omit<Notice, 'noticeId' | 'createdAt' | 'updatedAt'>): Promise<Notice> {
    const noticeId = 'notice-' + Date.now();
    const newNotice: Notice = {
      ...data,
      noticeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const list = localStore.getNotices() as Notice[];
      localStore.setNotices([newNotice, ...list]);
      return newNotice;
    }

    const ref = doc(db, 'notices', noticeId);
    await setDoc(ref, newNotice);
    return newNotice;
  },

  async updateNotice(noticeId: string, updates: Partial<Notice>): Promise<void> {
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    if (!isLiveFirebaseConfigured) {
      const list = localStore.getNotices() as Notice[];
      localStore.setNotices(list.map(n => n.noticeId === noticeId ? { ...n, ...payload } : n));
      return;
    }

    const ref = doc(db, 'notices', noticeId);
    await updateDoc(ref, payload);
  },

  async deleteNotice(noticeId: string): Promise<void> {
    if (!isLiveFirebaseConfigured) {
      const list = localStore.getNotices() as Notice[];
      localStore.setNotices(list.filter(n => n.noticeId !== noticeId));
      return;
    }

    const ref = doc(db, 'notices', noticeId);
    await deleteDoc(ref);
  }
};
