import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { Booking, BookingStatus } from '../../types/booking';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BookingDetailModal } from '../../components/admin/BookingDetailModal';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getBookingStatusBadge, getPaymentStatusBadge, getRefundStatusBadge } from '../../utils/formatters';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Search, Filter, CalendarDays, Eye } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { success, error } = useToast();

  const loadBookings = async () => {
    try {
      const list = await bookingService.getAllBookings();
      setBookings(list);
    } catch (e) {
      console.error('Error fetching admin bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateBooking = async (bookingId: string, updates: any) => {
    try {
      await bookingService.updateBookingStatus(bookingId, updates);
      success(`Booking #${bookingId} updated successfully!`);
      await loadBookings();
    } catch (err: any) {
      error(err.message || 'Failed to update booking status');
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch =
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Booking Management</h1>
        <p className="text-xs text-stone-500 mt-1">Review reservations, confirm arrivals, update payment, and process refunds.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Booking Ref, Guest Name, Email or Room #..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 outline-none w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {loading ? (
          <LoadingSpinner label="Loading bookings..." />
        ) : filtered.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-8">No bookings matched your filter criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Ref #</th>
                  <th className="pb-3">Guest & Contact</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Stay Dates</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(b => {
                  const statusBadge = getBookingStatusBadge(b.status);
                  const payBadge = getPaymentStatusBadge(b.paymentStatus);
                  return (
                    <tr key={b.bookingId} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 font-bold font-mono text-stone-900">#{b.bookingId}</td>
                      <td className="py-3.5">
                        <div className="font-bold text-stone-900">{b.userName}</div>
                        <div className="text-[11px] text-stone-400">{b.userEmail}</div>
                      </td>
                      <td className="py-3.5 font-medium text-stone-700">Room #{b.roomNumber}</td>
                      <td className="py-3.5 text-stone-600">
                        {formatDisplayDate(b.checkIn)} → {formatDisplayDate(b.checkOut)}
                        <span className="text-[10px] text-stone-400 block">({b.nights} nights)</span>
                      </td>
                      <td className="py-3.5 font-bold text-stone-900">{formatCurrency(b.finalPrice)}</td>
                      <td className="py-3.5">
                        <span className={`py-0.5 px-2.5 rounded-full font-bold border text-[11px] ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`py-0.5 px-2 rounded-md font-semibold border text-[10px] ${payBadge.bg}`}>
                          {payBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}

    </div>
  );
};
