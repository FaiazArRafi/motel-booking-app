import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Booking, BookingStatus, PaymentStatus, RefundStatus } from '../../types/booking';
import { formatCurrency, getBookingStatusBadge, getPaymentStatusBadge } from '../../utils/formatters';
import { formatDisplayDate, formatDisplayDateTime } from '../../utils/dateUtils';
import { Calendar, User, DollarSign } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (bookingId: string, updates: any) => Promise<void>;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onUpdate
}) => {
  if (!booking) return null;

  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.paymentStatus);
  const [refundStatus, setRefundStatus] = useState<RefundStatus>(booking.refundStatus);
  const [adminNote, setAdminNote] = useState(booking.adminNote || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(booking.bookingId, {
        status,
        paymentStatus,
        refundStatus,
        adminNote
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = getBookingStatusBadge(booking.status);
  const payBadge = getPaymentStatusBadge(booking.paymentStatus);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking #${booking.bookingId}`} maxWidth="2xl">
      <div className="space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div>
            <span className="text-xs text-stone-500 block">Current Status</span>
            <span className={`inline-block mt-1 py-1 px-3 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
          </div>

          <div>
            <span className="text-xs text-stone-500 block">Payment</span>
            <span className={`inline-block mt-1 py-1 px-3 rounded-full text-xs font-bold border ${payBadge.bg}`}>
              {payBadge.label}
            </span>
          </div>

          <div>
            <span className="text-xs text-stone-500 block">Created On</span>
            <span className="text-xs font-bold text-stone-800 mt-1 block">
              {formatDisplayDateTime(booking.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-stone-200/80 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-700" />
              Guest Information
            </h4>
            <p className="text-stone-700"><strong>Name:</strong> {booking.userName}</p>
            <p className="text-stone-700"><strong>Email:</strong> {booking.userEmail}</p>
            <p className="text-stone-700"><strong>Phone:</strong> {booking.userPhone || 'Not provided'}</p>
          </div>

          <div className="p-4 rounded-2xl border border-stone-200/80 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-700" />
              Stay Information
            </h4>
            <p className="text-stone-700"><strong>Room:</strong> #{booking.roomNumber} - {booking.roomName}</p>
            <p className="text-stone-700"><strong>Check-In:</strong> {formatDisplayDate(booking.checkIn)}</p>
            <p className="text-stone-700"><strong>Check-Out:</strong> {formatDisplayDate(booking.checkOut)} ({booking.nights} nights)</p>
            <p className="text-stone-700"><strong>Guests:</strong> {booking.guests}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-2">
          <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-800" />
            Financial Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div>
              <span className="text-stone-500 block">Base Subtotal:</span>
              <span className="font-bold text-stone-900">{formatCurrency(booking.basePrice * booking.nights)}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Discount Applied:</span>
              <span className="font-bold text-emerald-700">-{formatCurrency(booking.discount)}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Final Total:</span>
              <span className="font-bold text-amber-900 text-sm">{formatCurrency(booking.finalPrice)}</span>
            </div>
            {booking.status === 'cancelled' && (
              <div>
                <span className="text-stone-500 block">Refund / Fee:</span>
                <span className="font-bold text-rose-700">Fee: {formatCurrency(booking.cancellationFee)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 space-y-4">
          <h4 className="font-bold text-stone-900 text-sm">Update Management State</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Booking Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="partially_refunded">Partially Refunded</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Refund Status</label>
              <select
                value={refundStatus}
                onChange={e => setRefundStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold"
              >
                <option value="not_requested">Not Requested</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processed">Processed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Internal Admin Note</label>
            <textarea
              rows={2}
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="e.g. Guest called front desk; paid upon arrival."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-stone-300 text-sm font-semibold hover:bg-stone-50"
          >
            Close
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </Modal>
  );
};
