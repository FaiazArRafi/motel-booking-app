import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Room } from '../../types/room';
import { Trash2 } from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: Partial<Room>) => Promise<void>;
  room?: Room | null;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  room
}) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('Standard Queen');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState(70);
  const [capacity, setCapacity] = useState(2);
  const [status, setStatus] = useState<'available' | 'maintenance' | 'inactive'>('available');
  const [featured, setFeatured] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
      setRoomName(room.roomName);
      setRoomType(room.roomType);
      setDescription(room.description);
      setPricePerNight(room.pricePerNight);
      setCapacity(room.capacity);
      setStatus(room.status);
      setFeatured(room.featured);
      setAmenities(room.amenities || []);
      setImages(room.images || []);
    } else {
      setRoomNumber('');
      setRoomName('');
      setRoomType('Standard Queen');
      setDescription('');
      setPricePerNight(70);
      setCapacity(2);
      setStatus('available');
      setFeatured(false);
      setAmenities(['High-Speed WiFi', 'Climate Control AC', '50" Smart TV', 'Mini-Fridge', 'Microwave']);
      setImages(['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']);
    }
  }, [room, isOpen]);

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        roomNumber,
        roomName,
        roomType,
        description,
        pricePerNight: Number(pricePerNight),
        capacity: Number(capacity),
        status,
        featured,
        amenities,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={room ? 'Edit Room' : 'Add New Room'} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Room Number *</label>
            <input
              type="text"
              required
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              placeholder="e.g. 104"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Price / Night ($) *</label>
            <input
              type="number"
              min="1"
              required
              value={pricePerNight}
              onChange={e => setPricePerNight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Max Guests *</label>
            <input
              type="number"
              min="1"
              max="10"
              required
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Room Name *</label>
            <input
              type="text"
              required
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              placeholder="e.g. Deluxe Double Queen"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Room Type *</label>
            <input
              type="text"
              required
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              placeholder="e.g. Deluxe Suite"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Description *</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Room details, bed configurations, view..."
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            >
              <option value="available">Available (Publicly Bookable)</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-700 rounded focus:ring-amber-700"
              />
              <span>Feature on Landing Page</span>
            </label>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold uppercase text-stone-600 block">Amenities</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAmenity}
              onChange={e => setNewAmenity(e.target.value)}
              placeholder="e.g. Sofa Bed, Bathtub, Mountain View"
              className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-sm"
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-4 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {amenities.map((a, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
              >
                <span>{a}</span>
                <button
                  type="button"
                  onClick={() => setAmenities(amenities.filter((_, i) => i !== idx))}
                  className="text-stone-400 hover:text-rose-600"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold uppercase text-stone-600 block">Room Images (URLs)</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-sm"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-700"
            >
              Add URL
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md hover:bg-rose-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-stone-300 text-sm font-semibold hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : room ? 'Update Room' : 'Create Room'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
