import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Offer } from '../../types/offer';
import { getTodayDateString, getDateNDaysAhead } from '../../utils/dateUtils';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offerData: Partial<Offer>) => Promise<void>;
  offer?: Offer | null;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  offer
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getDateNDaysAhead(30));
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (offer) {
      setTitle(offer.title);
      setCode(offer.code || '');
      setDescription(offer.description);
      setDiscountType(offer.discountType);
      setDiscountValue(offer.discountValue);
      setStartDate(offer.startDate || getTodayDateString());
      setEndDate(offer.endDate || getDateNDaysAhead(30));
      setImage(offer.image || '');
      setActive(offer.active);
    } else {
      setTitle('');
      setCode('');
      setDescription('');
      setDiscountType('percentage');
      setDiscountValue(15);
      setStartDate(getTodayDateString());
      setEndDate(getDateNDaysAhead(60));
      setImage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80');
      setActive(true);
    }
  }, [offer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        code: code.trim().toUpperCase() || undefined,
        description,
        discountType,
        discountValue: Number(discountValue),
        startDate,
        endDate,
        image,
        active
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={offer ? 'Edit Offer' : 'Create Special Offer'} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Offer Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Summer Roadtrip Getaway"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Promo Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-mono uppercase focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Discount Type *</label>
            <select
              value={discountType}
              onChange={e => setDiscountType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Dollar ($)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Discount Value *</label>
            <input
              type="number"
              min="1"
              required
              value={discountValue}
              onChange={e => setDiscountValue(Number(e.target.value))}
              placeholder={discountType === 'percentage' ? '15' : '20'}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Description *</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Details on what is included and stay terms..."
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Valid Start Date *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Valid End Date *</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-800">
            <input
              type="checkbox"
              checked={active}
              onChange={e => setActive(e.target.checked)}
              className="w-4 h-4 text-amber-700 rounded focus:ring-amber-700"
            />
            <span>Active & Published Publicly</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-stone-300 text-sm font-semibold hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : offer ? 'Update Offer' : 'Publish Offer'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
