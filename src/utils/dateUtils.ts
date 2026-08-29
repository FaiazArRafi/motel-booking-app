/**
 * Format a Date or date string to YYYY-MM-DD
 */
export function formatToDateInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  return formatToDateInput(new Date());
}

/**
 * Get tomorrow's date formatted as YYYY-MM-DD
 */
export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatToDateInput(tomorrow);
}

/**
 * Get date N days from today formatted as YYYY-MM-DD
 */
export function getDateNDaysAhead(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatToDateInput(d);
}

/**
 * Calculate the number of nights between check-in and check-out
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Format date for human display (e.g., "Mon, Oct 14, 2026")
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format datetime for human display (e.g., "Oct 14, 2026 at 2:30 PM")
 */
export function formatDisplayDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Check if two date intervals [start1, end1) and [start2, end2) overlap.
 * Booking intervals are half-open: checkIn is included, checkOut is checkout morning.
 * Overlap occurs if and only if (start1 < end2) AND (end1 > start2).
 */
export function doDatesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  return s1 < e2 && e1 > s2;
}

/**
 * Check whether a booking cancellation falls under the 24-hour cutoff rule.
 * Uses exact check-in time (e.g. 14:00 on checkIn date).
 */
export function evaluateCancellationPolicy(
  checkInDate: string,
  checkInTime: string = '14:00',
  finalPrice: number
) {
  // Construct checkIn datetime (e.g., "2026-10-14T14:00:00")
  const checkInDateTime = new Date(`${checkInDate}T${checkInTime || '14:00'}:00`);
  const now = new Date();
  
  const diffMs = checkInDateTime.getTime() - now.getTime();
  const hoursUntilCheckIn = Math.round(diffMs / (1000 * 60 * 60));
  
  const isUnder24Hours = diffMs < (24 * 60 * 60 * 1000);

  if (isUnder24Hours) {
    // Under 24h: 20% cancellation fee, 80% refund
    const cancellationFee = Number((finalPrice * 0.20).toFixed(2));
    const refundAmount = Number((finalPrice - cancellationFee).toFixed(2));
    return {
      isUnder24Hours: true,
      hoursUntilCheckIn: Math.max(0, hoursUntilCheckIn),
      feePercentage: 20,
      cancellationFee,
      refundAmount
    };
  } else {
    // 24h or more: 0% cancellation fee, 100% refund
    return {
      isUnder24Hours: false,
      hoursUntilCheckIn,
      feePercentage: 0,
      cancellationFee: 0,
      refundAmount: finalPrice
    };
  }
}
