export interface GalleryImage {
  imageId: string;
  title: string;
  category: 'Exterior' | 'Lobby' | 'Rooms' | 'Bathroom' | 'Amenities' | 'Parking' | 'General';
  url: string;
  featured?: boolean;
  createdAt: string;
}
