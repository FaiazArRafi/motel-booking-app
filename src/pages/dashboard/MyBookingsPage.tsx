import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';
import { settingsService } from '../../services/settingsService';
import { Booking } from '../../types/booking';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RefundRequestModal } from '../../components/booking/RefundRequestModal';
import { formatCurrency, getBookingStatusBadge, getPaymentStatusBadge, getRefundStatusBadge } from '../../utils/formatters';
import { formatDisplayDate, evaluateCancellationPolicy } from '../../utils/dateUtils';
import { CalendarDays, Plus, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [refundBooking, setRefundBooking] = useState<Booking | null>(null);
  const [cancellingLoading, setCancellingLoading] = useState(false);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const list = await bookingService.getUserBookings(user.uid);
      setBookings(list);
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    setCancellingLoading(true);
    try {
      const res = await bookingService.cancelBooking(cancellingBooking.bookingId);
      success(`Booking #${cancellingBooking.bookingId} cancelled. Eligible refund: ${formatCurrency(res.refundCalc.refundAmount)}`);
      setCancellingBooking(null);
      await loadBookings();
    } catch (err: any) {
      error(err.message || 'Could not cancel booking.');
    } finally {
      setCancellingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Guest Portal
            </span>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">
              My Reservations
            </h1>
          </div>

          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Book Another Room</span>
          </Link>
        </div>

        {/* Bookings List */}
        {loading ? (
          <LoadingSpinner label="Loading your reservations..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-8 h-8 text-amber-800" />}
            title="You don't have any bookings yet"
            description="When you reserve a room at Pinecrest Motel, your confirmation details will appear right here."
            action={
              <Link
                to="/rooms"
                className="py-2.5 px-5 rounded-xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition"
              >
                Browse Available Rooms
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => {
              const statusBadge = getBookingStatusBadge(booking.status);
              const payBadge = getPaymentStatusBadge(booking.paymentStatus);
              const refundBadge = getRefundStatusBadge(booking.refundStatus);
              const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
              const canRequestRefund = booking.status === 'cancelled' && booking.refundStatus === 'not_requested';

              return (
                <div
                  key={booking.bookingId}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase">Booking #{booking.bookingId}</span>
                      <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                        Room #{booking.roomNumber} - {booking.roomName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`py-1 px-3 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`py-1 px-3 rounded-full text-xs font-bold border ${payBadge.bg}`}>
                        {payBadge.label}
                      </span>
                      {booking.status === 'cancelled' && booking.refundStatus !== 'not_requested' && (
                        <span className={`py-1 px-3 rounded-full text-xs font-bold border ${refundBadge.bg}`}>
                          {refundBadge.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 font-medium block">Check-In</span>
                      <span className="font-bold text-stone-900 text-sm">{formatDisplayDate(booking.checkIn)}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-medium block">Check-Out</span>
                      <span className="font-bold text-stone-900 text-sm">{formatDisplayDate(booking.checkOut)} ({booking.nights} nights)</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-medium block">Guests</span>
                      <span className="font-bold text-stone-900 text-sm">{booking.guests} Guests</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-medium block">Total Price</span>
                      <span className="font-black text-amber-800 text-sm">{formatCurrency(booking.finalPrice)}</span>
                    </div>
                  </div>

                  {/* If cancelled details */}
                  {booking.status === 'cancelled' && (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                      <div className="flex justify-between text-stone-600">
                        <span>Cancellation Fee:</span>
                        <span className="font-bold text-rose-700">{formatCurrency(booking.cancellationFee)}</span>
                      </div>
                      <div className="flex justify-between text-stone-900 font-bold">
                        <span>Eligible Refund Amount:</span>
                        <span className="text-emerald-700">{formatCurrency(booking.refundAmount || booking.finalPrice)}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setCancellingBooking(booking)}
                        className="py-2 px-4 rounded-xl border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition"
                      >
                        Cancel Reservation
                      </button>
                    )}

                    {canRequestRefund && (
                      <button
                        type="button"
                        onClick={() => setRefundBooking(booking)}
                        className="py-2 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Request Refund</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirm Dialog */}
        {cancellingBooking && (
          <ConfirmDialog
            isOpen={Boolean(cancellingBooking)}
            onClose={() => setCancellingBooking(null)}
            onConfirm={handleCancelConfirm}
            title="Cancel This Reservation?"
            message={`Are you sure you want to cancel booking #${cancellingBooking.bookingId}? According to our policy: cancellations made >= 24h prior to check-in receive 100% refund; cancellations made < 24h incur a 20% cancellation fee.`}
            confirmText="Yes, Cancel Booking"
            isDangerous
            isLoading={cancellingLoading}
          />
        )}

        {/* Refund Request Modal */}
        {refundBooking && (
          <RefundRequestModal
            booking={refundBooking}
            isOpen={Boolean(refundBooking)}
            onClose={() => setRefundBooking(null)}
            onSuccess={loadBookings}
          />
        )}

      </div>
    </div>
  );
};
