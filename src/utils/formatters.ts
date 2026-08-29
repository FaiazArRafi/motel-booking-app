/**
 * Format a number as USD currency ($120.00)
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Get visual styling badge class for booking status
 */
export function getBookingStatusBadge(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'confirmed':
      return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700', label: 'Confirmed' };
    case 'pending':
      return { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700', label: 'Pending Approval' };
    case 'completed':
      return { bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-700', label: 'Completed' };
    case 'cancelled':
      return { bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'text-rose-700', label: 'Cancelled' };
    default:
      return { bg: 'bg-stone-100 text-stone-800 border-stone-200', text: 'text-stone-700', label: status };
  }
}

/**
 * Get visual styling badge class for payment status
 */
export function getPaymentStatusBadge(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'paid':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-600', label: 'Paid' };
    case 'unpaid':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-600', label: 'Unpaid' };
    case 'refunded':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-600', label: 'Refunded' };
    case 'partially_refunded':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-600', label: 'Partially Refunded' };
    default:
      return { bg: 'bg-stone-50 text-stone-700 border-stone-200', text: 'text-stone-600', label: status };
  }
}

/**
 * Get visual styling badge class for refund status
 */
export function getRefundStatusBadge(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'requested':
      return { bg: 'bg-orange-100 text-orange-800 border-orange-200', text: 'text-orange-700', label: 'Refund Requested' };
    case 'approved':
      return { bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', text: 'text-cyan-700', label: 'Refund Approved' };
    case 'processed':
      return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700', label: 'Refund Processed' };
    case 'rejected':
      return { bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'text-rose-700', label: 'Refund Rejected' };
    default:
      return { bg: 'bg-stone-100 text-stone-600 border-stone-200', text: 'text-stone-500', label: 'No Refund' };
  }
}
