export type RoomStatus = 'available' | 'maintenance' | 'inactive';

export interface Room {
  roomId: string;
  roomNumber: string;
  roomName: string;
  roomType: string; // 'Standard Single', 'Deluxe Double', 'Family Suite', 'Executive King', etc.
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFilterOptions {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
}
