import { Room } from '../types/room';
import { Offer } from '../types/offer';
import { Notice } from '../types/notice';
import { GalleryImage } from '../types/gallery';
import { MotelSettings } from '../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../config/defaultSettings';

export const SEED_ROOMS: Room[] = [
  {
    roomId: 'room-101',
    roomNumber: '101',
    roomName: 'Standard Queen Room',
    roomType: 'Standard Queen',
    description: 'A cozy, quiet haven featuring a plush queen-size pillow-top bed, workstation desk, HD smart television, and modern en-suite walk-in shower. Ideal for solo travelers and couples.',
    pricePerNight: 65,
    capacity: 2,
    amenities: ['High-Speed WiFi', 'Climate Control AC', '50" Smart TV', 'Mini-Fridge', 'Microwave', 'Coffee Maker', 'Walk-in Shower'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    roomId: 'room-102',
    roomNumber: '102',
    roomName: 'Deluxe Double Queen',
    roomType: 'Deluxe Double',
    description: 'Spacious guestroom with two premium queen beds, ergonomic desk, sitting area, mini-refrigerator, microwave, and deluxe bath amenities. Perfect for small families or friends.',
    pricePerNight: 85,
    capacity: 4,
    amenities: ['High-Speed WiFi', 'Climate Control AC', '55" Smart TV', 'Mini-Fridge', 'Microwave', 'Coffee Maker', 'Tub & Shower', 'Iron & Board'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    roomId: 'room-201',
    roomNumber: '201',
    roomName: 'Executive King Suite',
    roomType: 'Executive Suite',
    description: 'Our premier suite boasting a king-size bed, separate comfortable sofa lounge, executive desk, high-pressure rainfall shower, and panoramic mountain views from the second floor.',
    pricePerNight: 110,
    capacity: 3,
    amenities: ['High-Speed WiFi', 'Climate Control AC', '65" Smart TV', 'Mini-Fridge', 'Microwave', 'Espresso Machine', 'Rainfall Shower', 'Sofa Bed', 'Mountain View'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    roomId: 'room-202',
    roomNumber: '202',
    roomName: 'Family Two-Bedroom Suite',
    roomType: 'Family Suite',
    description: 'Spacious suite designed for family comfort with one king master bedroom and an adjoining room with twin beds, dining table, kitchenette corner, and dual vanity bathroom.',
    pricePerNight: 135,
    capacity: 5,
    amenities: ['High-Speed WiFi', 'Climate Control AC', 'Dual Smart TVs', 'Full Mini-Kitchenette', 'Dining Table', 'Dual Vanities', 'Free Parking', 'Crib Available'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    roomId: 'room-103',
    roomNumber: '103',
    roomName: 'Accessible Ground Floor King',
    roomType: 'Accessible King',
    description: 'ADA-compliant ground floor room featuring wide door clearances, roll-in shower with safety grab bars, lowered vanity, visual alarm systems, and immediate ramp access.',
    pricePerNight: 75,
    capacity: 2,
    amenities: ['ADA Compliant', 'Roll-in Shower', 'High-Speed WiFi', 'Climate Control AC', '50" Smart TV', 'Microwave', 'Refrigerator', 'Direct Parking Access'],
    images: [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'available',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const SEED_OFFERS: Offer[] = [
  {
    offerId: 'offer-welcome15',
    title: 'Autumn Special Getaway',
    code: 'AUTUMN15',
    description: 'Enjoy 15% off your entire booking on any room type for stays of 2 nights or more this season!',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    offerId: 'offer-roadtrip20',
    title: 'Road Tripper Discount',
    code: 'ROADTRIP',
    description: 'Get an instant $20 flat discount on your stay when booking directly through our website.',
    discountType: 'fixed',
    discountValue: 20,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const SEED_NOTICES: Notice[] = [
  {
    noticeId: 'notice-pool-hours',
    title: 'Heated Courtyard Pool Hours',
    message: 'Our outdoor heated courtyard pool and hot tub are open daily from 8:00 AM to 10:00 PM. Fresh pool towels are available at reception.',
    type: 'information',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    noticeId: 'notice-checkin-express',
    title: 'Express Contactless Check-In Available',
    message: 'Arriving late? You can reply to your booking confirmation SMS or call our front desk for immediate digital door access after 10:00 PM.',
    type: 'information',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const SEED_GALLERY: GalleryImage[] = [
  {
    imageId: 'gal-1',
    title: 'Motel Exterior & Mountain Backdrop',
    category: 'Exterior',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    imageId: 'gal-2',
    title: 'Modern Front Desk & Lobby Lounge',
    category: 'Lobby',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    imageId: 'gal-3',
    title: 'Spacious Deluxe Room Comfort',
    category: 'Rooms',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    imageId: 'gal-4',
    title: 'Clean Sparkling Walk-In Bathrooms',
    category: 'Bathroom',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    imageId: 'gal-5',
    title: 'Secure Vehicle & RV Parking',
    category: 'Parking',
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    imageId: 'gal-6',
    title: 'Complimentary Gourmet Coffee Bar',
    category: 'Amenities',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    createdAt: new Date().toISOString()
  }
];

export async function seedFirestoreInitialData(dbInstance: any) {
  try {
    const { doc, setDoc, getDocs, collection } = await import('firebase/firestore');
    const roomsSnap = await getDocs(collection(dbInstance, 'rooms'));
    if (roomsSnap.empty) {
      console.log('Seeding initial rooms to Firestore...');
      for (const room of SEED_ROOMS) {
        await setDoc(doc(dbInstance, 'rooms', room.roomId), room);
      }
      for (const offer of SEED_OFFERS) {
        await setDoc(doc(dbInstance, 'offers', offer.offerId), offer);
      }
      for (const notice of SEED_NOTICES) {
        await setDoc(doc(dbInstance, 'notices', notice.noticeId), notice);
      }
      for (const img of SEED_GALLERY) {
        await setDoc(doc(dbInstance, 'gallery', img.imageId), img);
      }
      await setDoc(doc(dbInstance, 'settings', 'main_settings'), DEFAULT_MOTEL_SETTINGS);
      console.log('Firestore successfully seeded with initial motel data!');
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err);
  }
}
