import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Booking } from '../../types/booking';
import { refundService } from '../../services/refundService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { ShieldAlert } from 'lucide-react';

interface RefundRequestModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await refundService.submitRefundRequest(booking.bookingId, reason);
      success('Refund request submitted successfully. The manager will review it shortly.');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || 'Failed to submit refund request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Booking Refund" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Booking Reference:</span>
            <span className="font-bold text-stone-900">{booking.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Original Total Amount:</span>
            <span className="font-bold text-stone-900">{formatCurrency(booking.finalPrice)}</span>
          </div>
          {booking.cancellationFee > 0 && (
            <div className="flex justify-between text-rose-700">
              <span>Cancellation Fee (Late cancellation &lt; 24h):</span>
              <span className="font-bold">-{formatCurrency(booking.cancellationFee)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
            <span>Eligible Refund Amount:</span>
            <span className="text-emerald-700">{formatCurrency(booking.refundAmount || booking.finalPrice)}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            Refunds are reviewed and manually processed back to your original payment method within 1-3 business days.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Reason for refund request (optional)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Flight cancelled, personal emergency, etc."
            className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-bold shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
