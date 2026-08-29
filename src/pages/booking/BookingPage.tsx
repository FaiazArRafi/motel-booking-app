import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { roomService } from '../../services/roomService';
import { offerService } from '../../services/offerService';
import { bookingService } from '../../services/bookingService';
import { Room } from '../../types/room';
import { Offer } from '../../types/offer';
import { BookingSummaryCard } from '../../components/booking/BookingSummaryCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { calculateNights, getTodayDateString, getTomorrowDateString } from '../../utils/dateUtils';
import { calculateStayPrice } from '../../utils/priceUtils';
import { ShieldCheck, User, Phone, Mail, FileText, CheckCircle2, Lock } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn') || getTodayDateString();
  const checkOut = searchParams.get('checkOut') || getTomorrowDateString();
  const guests = Number(searchParams.get('guests')) || 2;

  const { user } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!roomId) {
        navigate('/rooms');
        return;
      }
      try {
        const [r, off] = await Promise.all([
          roomService.getRoomById(roomId),
          offerService.getActiveOffers()
        ]);
        setRoom(r);
        setOffers(off);
        if (off.length > 0) {
          setSelectedOffer(off[0]); // auto-apply best available active offer if available
        }
      } catch (err) {
        console.error('Error loading room for booking:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [roomId, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner label="Preparing your booking summary..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Room Unavailable</h2>
        <p className="text-stone-500 text-sm mb-6">The requested room is not available.</p>
        <Link to="/rooms" className="py-2.5 px-5 bg-amber-800 text-white rounded-xl text-sm font-bold">
          Browse Other Rooms
        </Link>
      </div>
    );
  }

  const nights = calculateNights(checkIn, checkOut);
  const priceResult = calculateStayPrice(room.pricePerNight, nights, selectedOffer);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const found = offers.find(o => o.code?.toUpperCase() === promoInput.trim().toUpperCase());
    if (found) {
      setSelectedOffer(found);
      success(`Promo code '${found.code}' applied!`);
    } else {
      error('Invalid or expired promo code.');
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in before completing your reservation.');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!agreedToPolicy) {
      error('Please agree to the cancellation policy.');
      return;
    }

    setSubmitting(true);
    try {
      const newBooking = await bookingService.createBooking({
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        userEmail: user.email,
        userPhone: phone || user.phoneNumber || '',
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        roomName: room.roomName,
        checkIn,
        checkOut,
        guests,
        nights,
        basePrice: room.pricePerNight,
        discount: priceResult.discount,
        finalPrice: priceResult.finalPrice,
        status: 'confirmed',
        paymentStatus: 'unpaid', // payment handled on arrival or manual processing
        refundStatus: 'not_requested',
        cancellationFee: 0,
        refundAmount: 0,
        specialRequests
      });

      success('Reservation confirmed successfully!');
      navigate(`/booking/success?bookingId=${newBooking.bookingId}`);
    } catch (err: any) {
      error(err.message || 'Could not complete reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Checkout & Confirmation
          </span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Complete Your Reservation
          </h1>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left 2 Cols: Guest info & Form */}
          <div className="lg:col-span-2 space-y-6">
            
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              
              {/* Guest Details */}
              <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-700" />
                  Primary Guest Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 font-bold block mb-1">Guest Name</span>
                    <input
                      type="text"
                      disabled
                      value={user?.displayName || user?.email.split('@')[0] || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-medium"
                    />
                  </div>

                  <div>
                    <span className="text-stone-500 font-bold block mb-1">Email Address</span>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                    Contact Phone Number (For arrival SMS / Keyless Entry) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 382-9900"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 block mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Ground floor preferred, late arrival after 9 PM..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Have a Promotional Code?</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    placeholder="e.g. AUTUMN15, ROADTRIP"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-sm font-mono uppercase focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
                  >
                    Apply Code
                  </button>
                </div>
              </div>

              {/* Payment Terms Disclaimer */}
              <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80 space-y-3 text-xs text-stone-700">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Direct Motel Reservation Terms</span>
                </div>
                <p className="leading-relaxed">
                  Payment is collected securely directly at front desk check-in or via digital invoice link upon arrival. No credit card charge is required right now.
                </p>
                <label className="flex items-start gap-2.5 pt-2 cursor-pointer font-semibold text-stone-900">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={e => setAgreedToPolicy(e.target.checked)}
                    className="w-4 h-4 text-amber-800 rounded focus:ring-amber-700 mt-0.5"
                  />
                  <span>
                    I understand the cancellation policy: 100% full refund if cancelled &ge;24 hours before check-in time (2:00 PM), and 20% fee if cancelled &lt;24 hours.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-base shadow-lg transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{submitting ? 'Confirming Reservation...' : 'Confirm Room Reservation'}</span>
              </button>

            </form>

          </div>

          {/* Right Col: Summary */}
          <div>
            <BookingSummaryCard
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              nights={nights}
              selectedOffer={selectedOffer}
            />
          </div>

        </div>

      </div>
    </div>
  );
};
