import React from 'react';
import { Link } from 'react-router-dom';
import { Offer } from '../../types/offer';
import { Tag, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';

interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-amber-200/70 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full bg-white/20 text-amber-100 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Special Deal</span>
          </div>

          <div className="text-3xl font-black tracking-tight text-white mb-1">
            {offer.discountType === 'percentage'
              ? `${offer.discountValue}% OFF`
              : `$${offer.discountValue} OFF`}
          </div>

          <h3 className="text-lg font-bold text-amber-100">{offer.title}</h3>
        </div>

        <Tag className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-sm text-stone-600 leading-relaxed">
          {offer.description}
        </p>

        <div className="space-y-3 pt-2">
          {offer.code && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-900">
              <span className="text-stone-500 font-sans font-medium">Promo Code:</span>
              <span className="bg-white py-1 px-2.5 rounded-lg border border-amber-300 tracking-wider">
                {offer.code}
              </span>
            </div>
          )}

          {offer.endDate && (
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Valid through {formatDisplayDate(offer.endDate)}</span>
            </div>
          )}

          <Link
            to="/rooms"
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm text-center transition flex items-center justify-center gap-1.5 shadow-sm mt-2"
          >
            <span>Claim Offer & Book</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
