import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { Booking, BookingStatus, PaymentStatus, RefundStatus } from '../types/booking';
import { doDatesOverlap, evaluateCancellationPolicy } from '../utils/dateUtils';
import { localStore } from './localStore';
import { settingsService } from './settingsService';

export const bookingService = {
  /**
   * Check if a specific room is available for the given date range [checkIn, checkOut)
   * Prevents double bookings by checking against active bookings (pending, confirmed).
   */
  async isRoomAvailable(
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeBookingId?: string
  ): Promise<{ available: boolean; conflictBooking?: Booking }> {
    const allBookings = await this.getAllBookings();

    // Filter active bookings for this room
    const activeRoomBookings = allBookings.filter(b => 
      b.roomId === roomId &&
      (b.status === 'pending' || b.status === 'confirmed') &&
      (!excludeBookingId || b.bookingId !== excludeBookingId)
    );

    // Overlap check
    for (const b of activeRoomBookings) {
      if (doDatesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)) {
        return { available: false, conflictBooking: b };
      }
    }

    return { available: true };
  },

  /**
   * Get all available rooms for a given date range and guest count
   */
  async getAvailableRoomsForDates(
    checkIn: string,
    checkOut: string,
    guestsCount: number = 1
  ) {
    let publicRooms: any[] = [];
    if (!isLiveFirebaseConfigured) {
      publicRooms = (localStore.getRooms() as any[]).filter(r => r.status === 'available');
    } else {
      try {
        const roomsRef = collection(db, 'rooms');
        const q = query(roomsRef, where('status', '==', 'available'));
        const snapshot = await getDocs(q);
        publicRooms = snapshot.docs.map(doc => doc.data());
      } catch (err) {
        console.error('Error getting public rooms for dates:', err);
        publicRooms = (localStore.getRooms() as any[]).filter(r => r.status === 'available');
      }
    }

    const availableRooms = [];
    for (const room of publicRooms) {
      if (room.capacity < guestsCount) continue;
      const check = await this.isRoomAvailable(room.roomId, checkIn, checkOut);
      if (check.available) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  },

  /**
   * Create a new booking
   */
  async createBooking(bookingData: Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    // Availability verification before inserting
    const avail = await this.isRoomAvailable(bookingData.roomId, bookingData.checkIn, bookingData.checkOut);
    if (!avail.available) {
      throw new Error('This room has just been reserved by another guest for the selected dates. Please select another room or change your dates.');
    }

    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      ...bookingData,
      bookingId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const bookings = localStore.getBookings() as Booking[];
      localStore.setBookings([newBooking, ...bookings]);
      return newBooking;
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    await setDoc(bookingRef, newBooking);
    return newBooking;
  },

  /**
   * Get all bookings for a specific authenticated User
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    if (!isLiveFirebaseConfigured) {
      const bookings = localStore.getBookings() as Booking[];
      return bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => doc.data() as Booking);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      const bookings = localStore.getBookings() as Booking[];
      return bookings.filter(b => b.userId === userId);
    }
  },

  /**
   * Get ALL bookings for Admin
   */
  async getAllBookings(): Promise<Booking[]> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getBookings() as Booking[];
    }

    try {
      const bookingsRef = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsRef);
      const list = snapshot.docs.map(doc => doc.data() as Booking);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      return localStore.getBookings() as Booking[];
    }
  },

  /**
   * Get single booking by ID
   */
  async getBookingById(bookingId: string): Promise<Booking | null> {
    if (!isLiveFirebaseConfigured) {
      const bookings = localStore.getBookings() as Booking[];
      return bookings.find(b => b.bookingId === bookingId) || null;
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const snapshot = await getDoc(bookingRef);
      if (snapshot.exists()) {
        return snapshot.data() as Booking;
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking by id:', error);
      const bookings = localStore.getBookings() as Booking[];
      return bookings.find(b => b.bookingId === bookingId) || null;
    }
  },

  /**
   * Cancel booking (User or Admin) with exact 24h cancellation calculation
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<{ booking: Booking; refundCalc: any }> {
    const booking = await this.getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    const settings = await settingsService.getSettings();
    const policyResult = evaluateCancellationPolicy(booking.checkIn, settings.checkInTime, booking.finalPrice);

    const updates: Partial<Booking> = {
      status: 'cancelled',
      cancellationFee: policyResult.cancellationFee,
      refundAmount: policyResult.refundAmount,
      cancellationReason: reason || 'Cancelled by guest',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const bookings = localStore.getBookings() as Booking[];
      const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, ...updates } : b);
      localStore.setBookings(updated);
      const updatedBooking = { ...booking, ...updates };
      return { booking: updatedBooking as Booking, refundCalc: policyResult };
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, updates);
    return { booking: { ...booking, ...updates } as Booking, refundCalc: policyResult };
  },

  /**
   * Update booking status & admin management fields
   */
  async updateBookingStatus(
    bookingId: string,
    updates: {
      status?: BookingStatus;
      paymentStatus?: PaymentStatus;
      refundStatus?: RefundStatus;
      adminNote?: string;
      cancellationReason?: string;
    }
  ): Promise<void> {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const bookings = localStore.getBookings() as Booking[];
      const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, ...payload } : b);
      localStore.setBookings(updated);
      return;
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, payload);
  }
};
