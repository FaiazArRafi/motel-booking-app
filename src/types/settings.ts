export interface MotelSettings {
  settingsId: string;
  motelName: string;
  tagline: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  aboutText: string;
  checkInTime: string; // e.g. '14:00' (2:00 PM)
  checkOutTime: string; // e.g. '11:00' (11:00 AM)
  cancellationPolicyText: string;
  googleMapsUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tripadvisor?: string;
  };
  amenitiesList: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  updatedAt: string;
}
