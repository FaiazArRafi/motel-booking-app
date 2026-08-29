import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search, AlertCircle } from 'lucide-react';
import { getTodayDateString, getTomorrowDateString, calculateNights } from '../../utils/dateUtils';

interface SearchBarProps {
  onSearch?: (searchParams: { checkIn: string; checkOut: string; guests: number }) => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  compact = false
}) => {
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || getTodayDateString());
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || getTomorrowDateString());
  const [guests, setGuests] = useState<number>(initialGuests);
  const [dateError, setDateError] = useState<string>('');
  const navigate = useNavigate();

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCheckIn(val);
    if (val >= checkOut) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
    setDateError('');
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val <= checkIn) {
      setDateError('Check-out date must be at least 1 day after check-in.');
    } else {
      setDateError('');
    }
    setCheckOut(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkOut <= checkIn) {
      setDateError('Check-out must be after check-in.');
      return;
    }

    if (onSearch) {
      onSearch({ checkIn, checkOut, guests });
    } else {
      navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    }
  };

  const nights = calculateNights(checkIn, checkOut);

  return (
    <div className={`w-full bg-white rounded-3xl shadow-xl border border-stone-200/80 p-5 sm:p-7 ${compact ? 'max-w-4xl' : 'max-w-5xl'} mx-auto`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Check-In */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-700" />
              Check-In Date
            </label>
            <input
              type="date"
              min={getTodayDateString()}
              value={checkIn}
              onChange={handleCheckInChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 font-medium focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none transition bg-stone-50/50"
            />
          </div>

          {/* Check-Out */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-700" />
              Check-Out Date
            </label>
            <input
              type="date"
              min={checkIn || getTodayDateString()}
              value={checkOut}
              onChange={handleCheckOutChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 font-medium focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none transition bg-stone-50/50"
            />
          </div>

          {/* Guests */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 font-medium focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none transition bg-stone-50/50"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={5}>5+ Guests</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-base shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Rooms</span>
            </button>
          </div>

        </div>

        {/* Nights indicator & error message */}
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <div className="font-semibold text-amber-800">
            {nights > 0 ? `Stay duration: ${nights} ${nights === 1 ? 'Night' : 'Nights'}` : 'Select dates'}
          </div>
          {dateError && (
            <div className="text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{dateError}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
