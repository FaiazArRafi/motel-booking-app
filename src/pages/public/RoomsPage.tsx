import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RoomCard } from '../../components/public/RoomCard';
import { SearchBar } from '../../components/public/SearchBar';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import { Room } from '../../types/room';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { BedDouble, Filter } from 'lucide-react';
import { getTodayDateString, getTomorrowDateString } from '../../utils/dateUtils';

export const RoomsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const checkInParam = searchParams.get('checkIn') || getTodayDateString();
  const checkOutParam = searchParams.get('checkOut') || getTomorrowDateString();
  const guestsParam = Number(searchParams.get('guests')) || 1;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(200);

  const [searchDates, setSearchDates] = useState({
    checkIn: checkInParam,
    checkOut: checkOutParam,
    guests: guestsParam
  });

  const loadRooms = async (dates: { checkIn: string; checkOut: string; guests: number }) => {
    setLoading(true);
    try {
      // Fetch available rooms matching the date range & capacity
      const available = await bookingService.getAvailableRoomsForDates(dates.checkIn, dates.checkOut, dates.guests);
      setRooms(available as Room[]);
    } catch (e) {
      console.error('Error fetching available rooms:', e);
      const all = await roomService.getPublicRooms();
      setRooms(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms(searchDates);
  }, []);

  const handleSearch = (newParams: { checkIn: string; checkOut: string; guests: number }) => {
    setSearchDates(newParams);
    loadRooms(newParams);
  };

  // Filter types
  const roomTypes = ['all', ...Array.from(new Set(rooms.map(r => r.roomType)))];

  const filteredRooms = rooms.filter(r => {
    const matchesType = selectedType === 'all' || r.roomType === selectedType;
    const matchesPrice = r.pricePerNight <= maxPrice;
    return matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Accommodations
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Our Rooms & Availability
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Spotlessly cleaned, well-appointed motel rooms with modern conveniences and fair transparent pricing.
          </p>
        </div>

        {/* Search / Filter Bar */}
        <SearchBar
          compact
          initialCheckIn={searchDates.checkIn}
          initialCheckOut={searchDates.checkOut}
          initialGuests={searchDates.guests}
          onSearch={handleSearch}
        />

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <span className="font-bold text-stone-700">Filter by Type:</span>
            <div className="flex flex-wrap gap-1.5">
              {roomTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                    selectedType === t
                      ? 'bg-amber-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-700">Max Nightly Rate: ${maxPrice}</span>
            <input
              type="range"
              min="50"
              max="250"
              step="5"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="accent-amber-800"
            />
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <LoadingSpinner label="Checking room availability for your dates..." />
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            icon={<BedDouble className="w-8 h-8 text-amber-800" />}
            title="No rooms available for these dates"
            description="All rooms of this type are currently booked for the selected date range. Try adjusting your dates or guest count."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map(room => (
              <RoomCard
                key={room.roomId}
                room={room}
                searchDates={searchDates}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
