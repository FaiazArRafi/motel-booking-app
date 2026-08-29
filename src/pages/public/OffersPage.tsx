import React, { useState, useEffect } from 'react';
import { OfferCard } from '../../components/public/OfferCard';
import { offerService } from '../../services/offerService';
import { Offer } from '../../types/offer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Tag } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offerService.getActiveOffers()
      .then(setOffers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Special Deals & Promotions
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Exclusive Motel Offers
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Take advantage of these limited-time promotional deals to save on your upcoming stay.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading current offers..." />
        ) : offers.length === 0 ? (
          <EmptyState
            icon={<Tag className="w-8 h-8 text-amber-800" />}
            title="No active offers at the moment"
            description="Check back soon for seasonal promotions, road trip packages, and weekend specials."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map(offer => (
              <OfferCard key={offer.offerId} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
