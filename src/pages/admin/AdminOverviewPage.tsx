import React, { useState, useEffect } from 'react';
import { StatsCard } from '../../components/admin/StatsCard';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import { offerService } from '../../services/offerService';
import { refundService } from '../../services/refundService';
import { Booking } from '../../types/booking';
import { Room } from '../../types/room';
import { formatCurrency, getBookingStatusBadge } from '../../utils/formatters';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';
import { CalendarDays, BedDouble, Tag, DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminOverviewPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [offersCount, setOffersCount] = useState(0);
  const [pendingRefundsCount, setPendingRefundsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [allBookings, allRooms, allOffers, allRefunds] = await Promise.all([
          bookingService.getAllBookings(),
          roomService.getAllRooms(),
          offerService.getAllOffers(),
          refundService.getAllRefundRequests()
        ]);
        setBookings(allBookings);
        setRooms(allRooms);
        setOffersCount(allOffers.filter(o => o.active).length);
        setPendingRefundsCount(allRefunds.filter(r => r.status === 'requested').length);
      } catch (e) {
        console.error('Error loading admin overview stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard analytics..." />;
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const availableRooms = rooms.filter(r => r.status === 'available');

  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.finalPrice, 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Motel Operations Overview</h1>
          <p className="text-xs text-stone-500 mt-1">Live metrics across guest bookings, room availability, and refund requests.</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value={bookings.length}
          subtitle={`${confirmedBookings.length} confirmed • ${pendingBookings.length} pending`}
          icon={<CalendarDays className="w-5 h-5" />}
          color="amber"
        />

        <StatsCard
          title="Room Occupancy"
          value={`${availableRooms.length} / ${rooms.length}`}
          subtitle="Available for direct booking"
          icon={<BedDouble className="w-5 h-5" />}
          color="emerald"
        />

        <StatsCard
          title="Gross Bookings Value"
          value={formatCurrency(totalRevenue)}
          subtitle="Total confirmed lodging stays"
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
        />

        <StatsCard
          title="Pending Refunds"
          value={pendingRefundsCount}
          subtitle="Guest requests needing review"
          icon={<AlertTriangle className="w-5 h-5" />}
          color={pendingRefundsCount > 0 ? 'rose' : 'purple'}
        />
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Recent Guest Bookings</h3>
            <p className="text-xs text-stone-500">Most recent reservations across all room types</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-6">No bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Ref #</th>
                  <th className="pb-3">Guest Name</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.slice(0, 5).map((b) => {
                  const badge = getBookingStatusBadge(b.status);
                  return (
                    <tr key={b.bookingId} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 font-bold font-mono text-stone-900">#{b.bookingId}</td>
                      <td className="py-3.5 font-medium text-stone-800">{b.userName}</td>
                      <td className="py-3.5 text-stone-600">#{b.roomNumber} - {b.roomName}</td>
                      <td className="py-3.5 text-stone-600">{formatDisplayDate(b.checkIn)} → {formatDisplayDate(b.checkOut)}</td>
                      <td className="py-3.5 font-bold text-stone-900">{formatCurrency(b.finalPrice)}</td>
                      <td className="py-3.5">
                        <span className={`py-0.5 px-2.5 rounded-full font-bold border text-[11px] ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
