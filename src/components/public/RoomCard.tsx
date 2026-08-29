import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types/room';
import { Users, Wifi, Tv, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface RoomCardProps {
  room: Room;
  searchDates?: { checkIn: string; checkOut: string; guests: number };
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, searchDates }) => {
  const primaryImage = room.images && room.images.length > 0
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  const bookingUrl = searchDates
    ? `/booking?roomId=${room.roomId}&checkIn=${searchDates.checkIn}&checkOut=${searchDates.checkOut}&guests=${searchDates.guests}`
    : `/rooms/${room.roomId}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={room.roomName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {room.featured && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-1 py-1 px-3 rounded-full bg-amber-800 text-amber-50 text-xs font-bold tracking-wide shadow-md">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Featured</span>
          </div>
        )}

        {/* Room Type Tag */}
        <div className="absolute bottom-4 left-4 py-1 px-3 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
          {room.roomType}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Header & Capacity */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Room #{room.roomNumber}
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 group-hover:text-amber-800 transition">
                {room.roomName}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-stone-600 bg-stone-100 py-1.5 px-2.5 rounded-lg shrink-0">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>Up to {room.capacity}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {room.description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium py-1 px-2 rounded-md bg-stone-50 border border-stone-200/60 text-stone-600"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-[11px] font-semibold text-stone-400 py-1 px-1.5">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price & CTA */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Nightly Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-stone-900">
                {formatCurrency(room.pricePerNight)}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ night</span>
            </div>
          </div>

          <Link
            to={bookingUrl}
            className="py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm transition shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};
