import React from 'react';
import { Room } from '../../types/room';
import { Offer } from '../../types/offer';
import { calculateStayPrice } from '../../utils/priceUtils';
import { formatCurrency } from '../../utils/formatters';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Calendar, Users, ShieldCheck, Tag } from 'lucide-react';

interface BookingSummaryCardProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  selectedOffer?: Offer | null;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  room,
  checkIn,
  checkOut,
  guests,
  nights,
  selectedOffer
}) => {
  const priceDetails = calculateStayPrice(room.pricePerNight, nights, selectedOffer);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-lg p-6 space-y-6">
      
      <div className="flex items-center gap-4 pb-5 border-b border-stone-100">
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
          alt={room.roomName}
          className="w-20 h-20 rounded-2xl object-cover shrink-0"
        />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Room #{room.roomNumber}</span>
          <h3 className="text-lg font-bold text-stone-900 leading-snug">{room.roomName}</h3>
          <p className="text-xs text-stone-500">{room.roomType}</p>
        </div>
      </div>

      <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-stone-500 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            Check-In:
          </span>
          <span className="font-bold text-stone-900">{formatDisplayDate(checkIn)} (from 2:00 PM)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-500 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            Check-Out:
          </span>
          <span className="font-bold text-stone-900">{formatDisplayDate(checkOut)} (until 11:00 AM)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-500 flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            Guests:
          </span>
          <span className="font-bold text-stone-900">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
        </div>
      </div>

      <div className="space-y-2.5 pt-1 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>{formatCurrency(room.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
          <span className="font-medium text-stone-900">{formatCurrency(priceDetails.subtotal)}</span>
        </div>

        {priceDetails.discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount ({selectedOffer?.title})</span>
            </span>
            <span>-{formatCurrency(priceDetails.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-stone-600 text-xs">
          <span>Taxes & Environmental Surcharges</span>
          <span className="font-semibold text-emerald-600">Included (0.00)</span>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
          <div>
            <span className="text-base font-extrabold text-stone-900 block">Total Due</span>
            <span className="text-[11px] text-stone-400">Guaranteed direct motel rate</span>
          </div>
          <span className="text-2xl font-black text-amber-800">
            {formatCurrency(priceDetails.finalPrice)}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Clear Cancellation Guarantee</span>
        </div>
        <p className="text-[11px] text-stone-600 leading-relaxed">
          Free 100% full refund if cancelled at least 24 hours prior to check-in (2:00 PM on arrival date). Cancellations made within 24 hours incur a 20% fee (80% refunded).
        </p>
      </div>

    </div>
  );
};
