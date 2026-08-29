import React, { useState, useEffect } from 'react';
import { refundService, RefundRequest } from '../../services/refundService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getRefundStatusBadge } from '../../utils/formatters';
import { formatDisplayDate, formatDisplayDateTime } from '../../utils/dateUtils';
import { DollarSign, CheckCircle2, XCircle, Clock, ShieldAlert, Check } from 'lucide-react';
import { RefundStatus } from '../../types/booking';

export const AdminRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [actionStatus, setActionStatus] = useState<RefundStatus>('approved');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const { success, error } = useToast();

  const loadRefunds = async () => {
    try {
      const list = await refundService.getAllRefundRequests();
      setRefunds(list);
    } catch (e) {
      console.error('Error fetching refunds:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefund) return;
    setProcessing(true);
    try {
      await refundService.updateRefundStatus(
        selectedRefund.refundId,
        selectedRefund.bookingId,
        actionStatus,
        adminNote
      );
      success(`Refund request for booking #${selectedRefund.bookingId} marked as ${actionStatus}!`);
      setSelectedRefund(null);
      await loadRefunds();
    } catch (err: any) {
      error(err.message || 'Failed to update refund status');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Refund Request Manager</h1>
        <p className="text-xs text-stone-500 mt-1">Review guest cancellation refund requests, calculated fees, and mark manual processing statuses.</p>
      </div>

      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> This free-tier workflow handles manual review and status logging. When real payment gateways are connected, processed refunds trigger gateway webhooks automatically.
        </p>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {loading ? (
          <LoadingSpinner label="Loading refund requests..." />
        ) : refunds.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-8">No refund requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Booking Ref</th>
                  <th className="pb-3">Guest Details</th>
                  <th className="pb-3">Total Paid</th>
                  <th className="pb-3">Cancellation Fee</th>
                  <th className="pb-3">Eligible Refund</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {refunds.map(r => {
                  const badge = getRefundStatusBadge(r.status);
                  return (
                    <tr key={r.refundId} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 font-bold font-mono text-stone-900">#{r.bookingId}</td>
                      <td className="py-3.5">
                        <div className="font-bold text-stone-900">{r.userName}</div>
                        <div className="text-[11px] text-stone-400">{r.userEmail}</div>
                      </td>
                      <td className="py-3.5 text-stone-700">{formatCurrency(r.totalPaid)}</td>
                      <td className="py-3.5 text-rose-700 font-bold">{formatCurrency(r.cancellationFee)}</td>
                      <td className="py-3.5 text-emerald-700 font-bold text-sm">{formatCurrency(r.refundAmount)}</td>
                      <td className="py-3.5">
                        <span className={`py-0.5 px-2.5 rounded-full font-bold border text-[11px] ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedRefund(r);
                            setActionStatus(r.status === 'requested' ? 'approved' : r.status);
                            setAdminNote(r.adminNote || '');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedRefund && (
        <Modal isOpen={Boolean(selectedRefund)} onClose={() => setSelectedRefund(null)} title="Process Refund Request" maxWidth="md">
          <form onSubmit={handleProcessRefund} className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Booking Reference:</span>
                <span className="font-bold text-stone-900">#{selectedRefund.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Guest:</span>
                <span className="font-bold text-stone-900">{selectedRefund.userName} ({selectedRefund.userEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Guest Reason:</span>
                <span className="font-medium text-stone-800 italic">{selectedRefund.reason || 'No reason provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cancellation Fee:</span>
                <span className="font-bold text-rose-700">{formatCurrency(selectedRefund.cancellationFee)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm">
                <span>Refund Amount Due:</span>
                <span className="text-emerald-700">{formatCurrency(selectedRefund.refundAmount)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Set Decision Status *</label>
              <select
                value={actionStatus}
                onChange={e => setActionStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold outline-none"
              >
                <option value="approved">Approved (Pending Payout)</option>
                <option value="processed">Processed (Paid Back to Guest)</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Admin Processing Note</label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="e.g. Sent via front desk cash/terminal reversal on 10/14..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRefund(null)}
                className="py-2.5 px-5 rounded-xl border border-stone-300 text-sm font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="py-2.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
