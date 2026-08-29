import { Offer } from '../types/offer';
import { BookingCalculation } from '../types/booking';

/**
 * Calculate base subtotal, applicable discount, and final price for a room stay.
 */
export function calculateStayPrice(
  pricePerNight: number,
  nights: number,
  offer?: Offer | null
): BookingCalculation {
  const safeNights = Math.max(0, nights);
  const basePrice = pricePerNight;
  const subtotal = Number((basePrice * safeNights).toFixed(2));
  
  let discount = 0;
  let offerApplied: string | undefined = undefined;

  if (offer && offer.active) {
    // Verify offer date validity
    const today = new Date().toISOString().split('T')[0];
    const isStarted = !offer.startDate || offer.startDate <= today;
    const isNotExpired = !offer.endDate || offer.endDate >= today;

    if (isStarted && isNotExpired) {
      if (offer.discountType === 'percentage') {
        discount = Number(((subtotal * offer.discountValue) / 100).toFixed(2));
        offerApplied = `${offer.title} (${offer.discountValue}% OFF)`;
      } else if (offer.discountType === 'fixed') {
        discount = Math.min(offer.discountValue, subtotal);
        offerApplied = `${offer.title} ($${offer.discountValue} OFF)`;
      }
    }
  }

  const finalPrice = Math.max(0, Number((subtotal - discount).toFixed(2)));

  return {
    nights: safeNights,
    basePrice,
    subtotal,
    discount,
    finalPrice,
    offerApplied
  };
}
