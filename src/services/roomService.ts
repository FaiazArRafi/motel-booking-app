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
import { Room, RoomFilterOptions } from '../types/room';
import { localStore } from './localStore';

export const roomService = {
  /**
   * Get all active & available rooms for the public website
   */
  async getPublicRooms(): Promise<Room[]> {
    if (!isLiveFirebaseConfigured) {
      const rooms = localStore.getRooms() as Room[];
      return rooms.filter(r => r.status === 'available');
    }

    try {
      const roomsRef = collection(db, 'rooms');
      const q = query(roomsRef, where('status', '==', 'available'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Room);
    } catch (error) {
      console.error('Error fetching public rooms from Firestore:', error);
      const rooms = localStore.getRooms() as Room[];
      return rooms.filter(r => r.status === 'available');
    }
  },

  /**
   * Get ALL rooms (including maintenance and inactive) for Admin
   */
  async getAllRooms(): Promise<Room[]> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getRooms() as Room[];
    }

    try {
      const roomsRef = collection(db, 'rooms');
      const snapshot = await getDocs(roomsRef);
      return snapshot.docs.map(doc => doc.data() as Room);
    } catch (error) {
      console.error('Error fetching all rooms:', error);
      return localStore.getRooms() as Room[];
    }
  },

  /**
   * Get Single Room by ID
   */
  async getRoomById(roomId: string): Promise<Room | null> {
    if (!isLiveFirebaseConfigured) {
      const rooms = localStore.getRooms() as Room[];
      return rooms.find(r => r.roomId === roomId) || null;
    }

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const snapshot = await getDoc(roomRef);
      if (snapshot.exists()) {
        return snapshot.data() as Room;
      }
      return null;
    } catch (error) {
      console.error('Error fetching room by id:', error);
      const rooms = localStore.getRooms() as Room[];
      return rooms.find(r => r.roomId === roomId) || null;
    }
  },

  /**
   * Create a new room (Admin only)
   */
  async createRoom(roomData: Omit<Room, 'roomId' | 'createdAt' | 'updatedAt'>): Promise<Room> {
    const roomId = 'room-' + Date.now();
    const newRoom: Room = {
      ...roomData,
      roomId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const rooms = localStore.getRooms() as Room[];
      localStore.setRooms([newRoom, ...rooms]);
      return newRoom;
    }

    const roomRef = doc(db, 'rooms', roomId);
    await setDoc(roomRef, newRoom);
    return newRoom;
  },

  /**
   * Update an existing room (Admin only)
   */
  async updateRoom(roomId: string, updates: Partial<Room>): Promise<void> {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const rooms = localStore.getRooms() as Room[];
      const updated = rooms.map(r => r.roomId === roomId ? { ...r, ...payload } : r);
      localStore.setRooms(updated);
      return;
    }

    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, payload);
  },

  /**
   * Delete a room (Admin only)
   */
  async deleteRoom(roomId: string): Promise<void> {
    if (!isLiveFirebaseConfigured) {
      const rooms = localStore.getRooms() as Room[];
      localStore.setRooms(rooms.filter(r => r.roomId !== roomId));
      return;
    }

    const roomRef = doc(db, 'rooms', roomId);
    await deleteDoc(roomRef);
  }
};
