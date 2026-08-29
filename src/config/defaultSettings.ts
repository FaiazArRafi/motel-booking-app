import { MotelSettings } from '../types/settings';

export const DEFAULT_MOTEL_SETTINGS: MotelSettings = {
  settingsId: 'main_settings',
  motelName: 'Pinecrest Motel & Suites',
  tagline: 'Your Peaceful, Comfortable & Affordable Getaway',
  phone: '+1 (555) 382-9900',
  email: 'stay@pinecrestmotel.com',
  address: '1420 Scenic Mountain Highway, Pine Valley, CA 90210',
  aboutText: 'Pinecrest Motel offers modern amenities, cozy rooms, and exceptional hospitality tailored for solo travelers, families, and road trippers. Located just minutes away from scenic trails and downtown attractions, we provide peaceful, stress-free lodging with spotless comfort at unbeatable rates.',
  checkInTime: '14:00', // 2:00 PM
  checkOutTime: '11:00', // 11:00 AM
  cancellationPolicyText: 'Cancellations made 24 hours or more prior to the scheduled check-in time (2:00 PM on arrival date) are eligible for a 100% full refund with zero fees. Cancellations made less than 24 hours before check-in incur a 20% cancellation fee, and 80% is refunded upon approval.',
  googleMapsUrl: 'https://maps.google.com',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tripadvisor: 'https://tripadvisor.com'
  },
  amenitiesList: [
    { id: 'wifi', name: 'High-Speed Free WiFi', icon: 'Wifi', description: 'Ultra-fast fiber internet in all rooms and outdoor areas.' },
    { id: 'parking', name: 'Free Parking', icon: 'Car', description: 'Spacious on-site parking directly in front of your room for cars and RVs.' },
    { id: 'ac', name: 'Climate Control AC & Heat', icon: 'Wind', description: 'Whisper-quiet, individually controlled air conditioning and heating.' },
    { id: 'tv', name: '50" Smart 4K TV', icon: 'Tv', description: 'Loaded with streaming channels, cable, and casting capabilities.' },
    { id: 'reception', name: '24/7 Front Desk', icon: 'Clock', description: 'Round-the-clock friendly concierge and secure express check-in.' },
    { id: 'coffee', name: 'Morning Fresh Coffee & Tea', icon: 'Coffee', description: 'Complimentary gourmet coffee and artisan teas served daily.' },
    { id: 'fridge', name: 'Mini-Fridge & Microwave', icon: 'Refrigerator', description: 'Every room equipped with a fresh refrigerator and microwave.' },
    { id: 'security', name: '24/7 Security & CCTV', icon: 'ShieldCheck', description: 'Well-lit corridors, electronic keycards, and constant perimeter security.' }
  ],
  updatedAt: new Date().toISOString()
};
