import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency, getBookingStatusBadge } from '../../utils/formatters';
import { formatDisplayDate } from '../../utils/dateUtils';
import { CheckCircle2, Calendar, MapPin, Phone, ArrowRight, User } from 'lucide-react';

export const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      bookingService.getBookingById(bookingId)
        .then(setBooking)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Loading reservation confirmation..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Reservation Completed</h2>
        <p className="text-stone-500 text-sm mb-6">Your booking reference is #{bookingId}</p>
        <Link to="/dashboard/bookings" className="py-2.5 px-5 bg-amber-800 text-white rounded-xl text-sm font-bold">
          View in My Bookings
        </Link>
      </div>
    );
  }

  const badge = getBookingStatusBadge(booking.status);

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl space-y-8 text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Reservation Confirmed!
          </span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            We Look Forward to Welcoming You!
          </h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            A confirmation receipt has been assigned to your guest account with booking reference <strong className="text-stone-900 font-mono">#{booking.bookingId}</strong>.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200/80 text-left space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <span className="text-stone-400 block font-medium">Room Reserved</span>
              <span className="text-base font-bold text-stone-900">Room #{booking.roomNumber} - {booking.roomName}</span>
            </div>
            <span className={`py-1 px-3 rounded-full font-bold border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-stone-500 font-medium block">Check-In</span>
              <span className="font-bold text-stone-900 text-sm">{formatDisplayDate(booking.checkIn)} (from 2:00 PM)</span>
            </div>
            <div>
              <span className="text-stone-500 font-medium block">Check-Out</span>
              <span className="font-bold text-stone-900 text-sm">{formatDisplayDate(booking.checkOut)} (until 11:00 AM)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
            <div>
              <span className="text-stone-500 font-medium block">Guest Contact</span>
              <span className="font-bold text-stone-900">{booking.userName} ({booking.userPhone})</span>
            </div>
            <div>
              <span className="text-stone-500 font-medium block">Total Price Due</span>
              <span className="font-black text-amber-800 text-base">{formatCurrency(booking.finalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard/bookings"
            className="py-3 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm transition shadow-sm flex items-center gap-2"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="py-3 px-6 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-sm transition"
          >
            Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
};
