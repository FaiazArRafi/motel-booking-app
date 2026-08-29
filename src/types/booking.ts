export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partially_refunded';
export type RefundStatus = 'not_requested' | 'requested' | 'approved' | 'rejected' | 'processed';

export interface Booking {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  nights: number;
  basePrice: number;
  discount: number;
  finalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  refundStatus: RefundStatus;
  cancellationFee: number;
  refundAmount: number;
  cancellationReason?: string;
  cancelledAt?: string;
  refundRequestedAt?: string;
  refundProcessedAt?: string;
  adminNote?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCalculation {
  nights: number;
  basePrice: number;
  subtotal: number;
  discount: number;
  finalPrice: number;
  offerApplied?: string;
}

export interface CancellationCalculation {
  isUnder24Hours: boolean;
  hoursUntilCheckIn: number;
  feePercentage: number;
  cancellationFee: number;
  refundAmount: number;
}
