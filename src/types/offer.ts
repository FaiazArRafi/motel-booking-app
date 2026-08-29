export type DiscountType = 'percentage' | 'fixed';

export interface Offer {
  offerId: string;
  title: string;
  code?: string;
  description: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 10 for 10%, or 25 for $25 off
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  image?: string;
  active: boolean;
  minSpend?: number;
  createdAt: string;
  updatedAt: string;
}
