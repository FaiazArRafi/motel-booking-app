import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';
import { GalleryImage } from '../types/gallery';
import { localStore } from './localStore';

export const galleryService = {
  async getGallery(): Promise<GalleryImage[]> {
    if (!isLiveFirebaseConfigured) {
      return localStore.getGallery() as GalleryImage[];
    }

    try {
      const ref = collection(db, 'gallery');
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => doc.data() as GalleryImage);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return localStore.getGallery() as GalleryImage[];
    }
  },

  async addImage(data: Omit<GalleryImage, 'imageId' | 'createdAt'>): Promise<GalleryImage> {
    const imageId = 'gal-' + Date.now();
    const newImage: GalleryImage = {
      ...data,
      imageId,
      createdAt: new Date().toISOString()
    };

    if (!isLiveFirebaseConfigured) {
      const list = localStore.getGallery() as GalleryImage[];
      localStore.setGallery([newImage, ...list]);
      return newImage;
    }

    const ref = doc(db, 'gallery', imageId);
    await setDoc(ref, newImage);
    return newImage;
  },

  async deleteImage(imageId: string): Promise<void> {
    if (!isLiveFirebaseConfigured) {
      const list = localStore.getGallery() as GalleryImage[];
      localStore.setGallery(list.filter(g => g.imageId !== imageId));
      return;
    }

    const ref = doc(db, 'gallery', imageId);
    await deleteDoc(ref);
  }
};
