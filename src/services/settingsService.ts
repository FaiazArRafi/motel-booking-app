import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { MotelSettings } from '../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../config/defaultSettings';
import { localStore } from './localStore';

export const settingsService = {
  async getSettings(): Promise<MotelSettings> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getSettings() as MotelSettings;
    }

    try {
      const ref = doc(db, 'settings', 'main_settings');
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        return snapshot.data() as MotelSettings;
      }
      return DEFAULT_MOTEL_SETTINGS;
    } catch (error) {
      console.error('Error fetching motel settings:', error);
      return localStore.getSettings() as MotelSettings;
    }
  },

  async updateSettings(updates: Partial<MotelSettings>): Promise<void> {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const current = localStore.getSettings();
      localStore.setSettings({ ...current, ...payload });
      return;
    }

    const ref = doc(db, 'settings', 'main_settings');
    await setDoc(ref, payload, { merge: true });
  }
};
