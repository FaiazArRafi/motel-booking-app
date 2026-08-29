import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { bookingService } from '../../services/bookingService';
import { UserProfile } from '../../types/auth';
import { Booking } from '../../types/booking';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [u, b] = await Promise.all([
          authService.getAllUsers(),
          bookingService.getAllBookings()
        ]);
        setUsers(u);
        setBookings(b);
      } catch (e) {
        console.error('Error fetching registered users:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Registered Users</h1>
        <p className="text-xs text-stone-500 mt-1">View guest accounts, administrator assignments, and reservation counts.</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {loading ? (
          <LoadingSpinner label="Loading user accounts..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Registered Date</th>
                  <th className="pb-3">Bookings Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map(u => {
                  const userBookingsCount = bookings.filter(b => b.userId === u.uid).length;
                  return (
                    <tr key={u.uid} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5">
                        <div className="font-bold text-stone-900">{u.displayName || 'Guest User'}</div>
                        <div className="text-[11px] text-stone-400">{u.email}</div>
                      </td>
                      <td className="py-3.5">
                        <span className={`py-0.5 px-2.5 rounded-full font-bold uppercase text-[10px] ${
                          u.role === 'admin' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 text-stone-600">{u.phoneNumber || '—'}</td>
                      <td className="py-3.5 text-stone-500">{u.createdAt ? formatDisplayDate(u.createdAt) : '—'}</td>
                      <td className="py-3.5 font-bold text-stone-900">{userBookingsCount} Stays</td>
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
