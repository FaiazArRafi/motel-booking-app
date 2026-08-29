import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import { GalleryImage } from '../../types/gallery';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Exterior' | 'Lobby' | 'Rooms' | 'Bathroom' | 'Amenities' | 'Parking' | 'General'>('Exterior');
  const [url, setUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const loadGallery = async () => {
    try {
      const list = await galleryService.getGallery();
      setImages(list);
    } catch (e) {
      console.error('Error loading gallery:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await galleryService.addImage({ title, category, url, featured });
      success('Image added to gallery!');
      setIsModalOpen(false);
      setTitle('');
      setUrl('');
      await loadGallery();
    } catch (err: any) {
      error(err.message || 'Failed to add image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingImageId) return;
    try {
      await galleryService.deleteImage(deletingImageId);
      success('Image deleted.');
      setDeletingImageId(null);
      await loadGallery();
    } catch (err: any) {
      error(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Photo Gallery Manager</h1>
          <p className="text-xs text-stone-500 mt-1">Add and curate photos for the public gallery showcase.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading photo gallery..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <div
              key={img.imageId}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group"
            >
              <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 py-1 px-2 rounded-md bg-black/70 text-white text-[10px] font-bold">
                  {img.category}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 truncate mr-2">{img.title}</span>
                <button
                  onClick={() => setDeletingImageId(img.imageId)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Gallery Image" maxWidth="md">
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Image Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Clean Bathrooms"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none"
            >
              <option value="Exterior">Exterior</option>
              <option value="Lobby">Lobby</option>
              <option value="Rooms">Rooms</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Amenities">Amenities</option>
              <option value="Parking">Parking</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-5 rounded-xl border border-stone-300 text-sm font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Image'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      {deletingImageId && (
        <ConfirmDialog
          isOpen={Boolean(deletingImageId)}
          onClose={() => setDeletingImageId(null)}
          onConfirm={handleDelete}
          title="Delete Image"
          message="Are you sure you want to delete this photo from the gallery?"
          confirmText="Yes, Delete"
          isDangerous
        />
      )}

    </div>
  );
};
