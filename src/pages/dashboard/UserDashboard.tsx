import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';
import { CalendarDays, User, ShieldCheck, Bed, ArrowRight, Clock, PlusCircle } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';
import { getBookingStatusBadge, formatCurrency } from '../../utils/formatters';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      bookingService.getUserBookings(user.uid)
        .then(setBookings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const upcomingStay = activeBookings[0];

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* User Greeting Bar */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-800 text-white flex items-center justify-center font-black text-xl shadow-md">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-stone-900">
                  Welcome, {user?.displayName || user?.email?.split('@')[0]}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/rooms"
              className="py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Stay</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Stays</span>
            <div className="text-3xl font-black text-stone-900">{bookings.length}</div>
            <p className="text-xs text-stone-500">Reservations created on this account</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Upcoming</span>
            <div className="text-3xl font-black text-amber-800">{activeBookings.length}</div>
            <p className="text-xs text-stone-500">Confirmed or pending check-ins</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Past Stays</span>
            <div className="text-3xl font-black text-stone-900">{completedBookings.length}</div>
            <p className="text-xs text-stone-500">Completed lodging stays</p>
          </div>
        </div>

        {/* Upcoming Stay Showcase */}
        {upcomingStay && (
          <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider block">Upcoming Stay</span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">
                  Room #{upcomingStay.roomNumber} - {upcomingStay.roomName}
                </h3>
              </div>
              <span className="py-1 px-3 rounded-full text-xs font-bold bg-white/20 text-amber-100 border border-white/30">
                Ref: #{upcomingStay.bookingId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-amber-100">
              <div>
                <span className="text-stone-300 block font-medium">Check-In:</span>
                <span className="text-white font-bold text-sm">{formatDisplayDate(upcomingStay.checkIn)}</span>
              </div>
              <div>
                <span className="text-stone-300 block font-medium">Check-Out:</span>
                <span className="text-white font-bold text-sm">{formatDisplayDate(upcomingStay.checkOut)} ({upcomingStay.nights} nights)</span>
              </div>
              <div>
                <span className="text-stone-300 block font-medium">Amount Due:</span>
                <span className="text-white font-bold text-sm">{formatCurrency(upcomingStay.finalPrice)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                to="/dashboard/bookings"
                className="py-2.5 px-5 rounded-xl bg-white text-amber-950 font-bold text-xs hover:bg-amber-100 transition shadow-sm flex items-center gap-1.5"
              >
                <span>Manage Reservation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/dashboard/bookings"
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition">My Bookings</h4>
                <p className="text-xs text-stone-500">View stay history, cancel, or request refunds</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-amber-800 transition" />
          </Link>

          <Link
            to="/dashboard/profile"
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition">Profile & Contact</h4>
                <p className="text-xs text-stone-500">Update name, phone number, and preferences</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-amber-800 transition" />
          </Link>
        </div>

      </div>
    </div>
  );
};
