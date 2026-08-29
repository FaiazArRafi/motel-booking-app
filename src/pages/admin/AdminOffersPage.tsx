import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/offerService';
import { Offer } from '../../types/offer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { OfferModal } from '../../components/admin/OfferModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Plus, Edit2, Trash2, Tag, Calendar } from 'lucide-react';

export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);
  const { success, error } = useToast();

  const loadOffers = async () => {
    try {
      const list = await offerService.getAllOffers();
      setOffers(list);
    } catch (e) {
      console.error('Error fetching admin offers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleSave = async (data: Partial<Offer>) => {
    try {
      if (editingOffer) {
        await offerService.updateOffer(editingOffer.offerId, data);
        success('Offer updated successfully!');
      } else {
        await offerService.createOffer(data as any);
        success('Special offer created!');
      }
      setIsModalOpen(false);
      setEditingOffer(null);
      await loadOffers();
    } catch (err: any) {
      error(err.message || 'Failed to save offer');
    }
  };

  const handleDelete = async () => {
    if (!deletingOfferId) return;
    try {
      await offerService.deleteOffer(deletingOfferId);
      success('Offer deleted.');
      setDeletingOfferId(null);
      await loadOffers();
    } catch (err: any) {
      error(err.message || 'Failed to delete offer');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Promotions & Offers</h1>
          <p className="text-xs text-stone-500 mt-1">Manage seasonal discounts, promo codes, and special direct-booking rates.</p>
        </div>

        <button
          onClick={() => { setEditingOffer(null); setIsModalOpen(true); }}
          className="py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Offer</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading offers..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div
              key={offer.offerId}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-amber-800">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `$${offer.discountValue} OFF`}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    offer.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {offer.active ? 'Active' : 'Paused'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">{offer.title}</h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{offer.description}</p>

                {offer.code && (
                  <div className="inline-block font-mono font-bold text-xs bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg">
                    Code: {offer.code}
                  </div>
                )}

                <div className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Valid: {formatDisplayDate(offer.startDate)} → {formatDisplayDate(offer.endDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  onClick={() => { setEditingOffer(offer); setIsModalOpen(true); }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingOfferId(offer.offerId)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <OfferModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingOffer(null); }}
          onSave={handleSave}
          offer={editingOffer}
        />
      )}

      {deletingOfferId && (
        <ConfirmDialog
          isOpen={Boolean(deletingOfferId)}
          onClose={() => setDeletingOfferId(null)}
          onConfirm={handleDelete}
          title="Delete Offer"
          message="Are you sure you want to delete this promotional offer?"
          confirmText="Yes, Delete"
          isDangerous
        />
      )}

    </div>
  );
};
