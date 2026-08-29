import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { Room } from '../../types/room';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { getTodayDateString, getTomorrowDateString, calculateNights } from '../../utils/dateUtils';
import { Users, Wifi, Tv, Wind, Coffee, Refrigerator, ShieldCheck, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';

export const RoomDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(getTodayDateString());
  const [checkOut, setCheckOut] = useState(getTomorrowDateString());
  const [guests, setGuests] = useState(2);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      roomService.getRoomById(roomId)
        .then(setRoom)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Loading room details..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Room Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">The requested room does not exist or is inactive.</p>
        <Link to="/rooms" className="py-2.5 px-5 bg-amber-800 text-white rounded-xl text-sm font-bold">
          Back to Rooms
        </Link>
      </div>
    );
  }

  const nights = calculateNights(checkIn, checkOut);
  const subtotal = room.pricePerNight * nights;

  const handleBookNow = () => {
    navigate(`/booking?roomId=${room.roomId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rooms</span>
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left 2 Cols: Photos & Description */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Showcase */}
            <div className="space-y-3">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-stone-200 border border-stone-200 shadow-md">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={room.roomName}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-[16/10] rounded-2xl overflow-hidden border-2 transition ${
                        activeImageIndex === idx ? 'border-amber-800 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Header Info */}
            <div className="space-y-4 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                    Room #{room.roomNumber} • {room.roomType}
                  </span>
                  <h1 className="text-3xl font-black text-stone-900 tracking-tight mt-1">
                    {room.roomName}
                  </h1>
                </div>

                <div className="flex items-center gap-1.5 py-2 px-3.5 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>Max {room.capacity} Guests</span>
                </div>
              </div>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed pt-2">
                {room.description}
              </p>

              {/* Amenities List */}
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                  Included In-Room Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {room.amenities.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-stone-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Col: Instant Booking Box */}
          <div className="space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xl space-y-6 sticky top-28">
              
              <div>
                <span className="text-xs text-stone-400 font-medium block">Direct Booking Rate</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-stone-900">{formatCurrency(room.pricePerNight)}</span>
                  <span className="text-xs text-stone-500 font-semibold">/ night</span>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-stone-100">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    Check-In
                  </label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    Check-Out
                  </label>
                  <input
                    type="date"
                    min={checkIn || getTodayDateString()}
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-700" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Price Calculation Preview */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{formatCurrency(room.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-bold text-stone-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Direct Booking Discount</span>
                  <span className="font-semibold text-emerald-600">Available at Checkout</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-amber-800 text-base">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-stone-400">
                Free cancellation up to 24h before 2:00 PM check-in date.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
