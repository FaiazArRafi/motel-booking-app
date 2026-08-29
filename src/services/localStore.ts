import { SEED_ROOMS, SEED_OFFERS, SEED_NOTICES, SEED_GALLERY } from './seedService';
import { DEFAULT_MOTEL_SETTINGS } from '../config/defaultSettings';

const STORAGE_KEYS = {
  USERS: 'motel_users',
  ROOMS: 'motel_rooms',
  BOOKINGS: 'motel_bookings',
  OFFERS: 'motel_offers',
  NOTICES: 'motel_notices',
  GALLERY: 'motel_gallery',
  SETTINGS: 'motel_settings',
  REFUNDS: 'motel_refunds'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error('Error reading localStorage for key', key, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage for key', key, e);
  }
}

// Initialize seed data if not present
export function initLocalStoreIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    setStored(STORAGE_KEYS.ROOMS, SEED_ROOMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    setStored(STORAGE_KEYS.OFFERS, SEED_OFFERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
    setStored(STORAGE_KEYS.NOTICES, SEED_NOTICES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    setStored(STORAGE_KEYS.GALLERY, SEED_GALLERY);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStored(STORAGE_KEYS.SETTINGS, DEFAULT_MOTEL_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStored(STORAGE_KEYS.USERS, [
      {
        uid: 'demo-admin-uid',
        email: 'admin@pinecrestmotel.com',
        displayName: 'Motel Manager',
        phoneNumber: '+1 (555) 382-9900',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'demo-guest-uid',
        email: 'guest@example.com',
        displayName: 'Alex Traveler',
        phoneNumber: '+1 (555) 777-8899',
        role: 'guest',
        createdAt: new Date().toISOString()
      }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    setStored(STORAGE_KEYS.BOOKINGS, []);
  }
}

export const localStore = {
  getUsers: () => getStored(STORAGE_KEYS.USERS, []),
  setUsers: (val: any) => setStored(STORAGE_KEYS.USERS, val),

  getRooms: () => getStored(STORAGE_KEYS.ROOMS, SEED_ROOMS),
  setRooms: (val: any) => setStored(STORAGE_KEYS.ROOMS, val),

  getBookings: () => getStored(STORAGE_KEYS.BOOKINGS, []),
  setBookings: (val: any) => setStored(STORAGE_KEYS.BOOKINGS, val),

  getOffers: () => getStored(STORAGE_KEYS.OFFERS, SEED_OFFERS),
  setOffers: (val: any) => setStored(STORAGE_KEYS.OFFERS, val),

  getNotices: () => getStored(STORAGE_KEYS.NOTICES, SEED_NOTICES),
  setNotices: (val: any) => setStored(STORAGE_KEYS.NOTICES, val),

  getGallery: () => getStored(STORAGE_KEYS.GALLERY, SEED_GALLERY),
  setGallery: (val: any) => setStored(STORAGE_KEYS.GALLERY, val),

  getSettings: () => getStored(STORAGE_KEYS.SETTINGS, DEFAULT_MOTEL_SETTINGS),
  setSettings: (val: any) => setStored(STORAGE_KEYS.SETTINGS, val),

  resetToDefaultDemoData: () => {
    setStored(STORAGE_KEYS.ROOMS, SEED_ROOMS);
    setStored(STORAGE_KEYS.OFFERS, SEED_OFFERS);
    setStored(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    setStored(STORAGE_KEYS.GALLERY, SEED_GALLERY);
    setStored(STORAGE_KEYS.SETTINGS, DEFAULT_MOTEL_SETTINGS);
  }
};
