import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { RefundStatus } from '../types/booking';
import { bookingService } from './bookingService';

export interface RefundRequest {
  refundId: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  roomName: string;
  totalPaid: number;
  cancellationFee: number;
  refundAmount: number;
  reason?: string;
  status: RefundStatus; // 'requested' | 'approved' | 'rejected' | 'processed'
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export const refundService = {
  async submitRefundRequest(bookingId: string, reason: string = ''): Promise<RefundRequest> {
    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'cancelled') throw new Error('Booking must be cancelled before requesting a refund');

    const refundId = 'ref-' + Date.now();
    const newRequest: RefundRequest = {
      refundId,
      bookingId,
      userId: booking.userId,
      userName: booking.userName,
      userEmail: booking.userEmail,
      roomName: booking.roomName,
      totalPaid: booking.finalPrice,
      cancellationFee: booking.cancellationFee || 0,
      refundAmount: booking.refundAmount || booking.finalPrice,
      reason,
      status: 'requested',
      requestedAt: new Date().toISOString()
    };

    // Update booking refund status
    await bookingService.updateBookingStatus(bookingId, {
      refundStatus: 'requested'
    });

    if (!isLiveFirebaseConfigured) {
      const list: RefundRequest[] = JSON.parse(localStorage.getItem('motel_refunds') || '[]');
      localStorage.setItem('motel_refunds', JSON.stringify([newRequest, ...list]));
      return newRequest;
    }

    const ref = doc(db, 'refundRequests', refundId);
    await setDoc(ref, newRequest);
    return newRequest;
  },

  async getAllRefundRequests(): Promise<RefundRequest[]> {
    if (!isLiveFirebaseConfigured) {
      return JSON.parse(localStorage.getItem('motel_refunds') || '[]');
    }

    try {
      const ref = collection(db, 'refundRequests');
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => doc.data() as RefundRequest);
    } catch (error) {
      console.error('Error getting refund requests:', error);
      return JSON.parse(localStorage.getItem('motel_refunds') || '[]');
    }
  },

  async updateRefundStatus(
    refundId: string,
    bookingId: string,
    status: RefundStatus,
    adminNote?: string
  ): Promise<void> {
    const payload = {
      status,
      adminNote,
      processedAt: new Date().toISOString()
    };

    // Also sync with the booking's refundStatus
    await bookingService.updateBookingStatus(bookingId, {
      refundStatus: status,
      adminNote,
      paymentStatus: status === 'processed' ? 'refunded' : undefined
    });

    if (!isLiveFirebaseConfigured) {
      const list: RefundRequest[] = JSON.parse(localStorage.getItem('motel_refunds') || '[]');
      const updated = list.map(r => r.refundId === refundId ? { ...r, ...payload } : r);
      localStorage.setItem('motel_refunds', JSON.stringify(updated));
      return;
    }

    const ref = doc(db, 'refundRequests', refundId);
    await updateDoc(ref, payload);
  }
};
