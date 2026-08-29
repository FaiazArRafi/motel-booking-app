import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import { Room } from '../../types/room';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { RoomModal } from '../../components/admin/RoomModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, Users, Sparkles, BedDouble } from 'lucide-react';

export const AdminRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const { success, error } = useToast();

  const loadRooms = async () => {
    try {
      const list = await roomService.getAllRooms();
      setRooms(list);
    } catch (e) {
      console.error('Error fetching admin rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSaveRoom = async (roomData: Partial<Room>) => {
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.roomId, roomData);
        success(`Room #${roomData.roomNumber} updated!`);
      } else {
        await roomService.createRoom(roomData as any);
        success(`New Room #${roomData.roomNumber} created!`);
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      await loadRooms();
    } catch (err: any) {
      error(err.message || 'Failed to save room.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoomId) return;
    try {
      await roomService.deleteRoom(deletingRoomId);
      success('Room deleted.');
      setDeletingRoomId(null);
      await loadRooms();
    } catch (err: any) {
      error(err.message || 'Failed to delete room.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Room Management</h1>
          <p className="text-xs text-stone-500 mt-1">Add new rooms, update nightly pricing, assign amenities, and upload photos.</p>
        </div>

        <button
          onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}
          className="py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <LoadingSpinner label="Loading rooms inventory..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div
              key={room.roomId}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between p-6 space-y-4"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                    alt={room.roomName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 py-1 px-2.5 rounded-lg bg-black/70 text-white text-xs font-bold">
                    Room #{room.roomNumber}
                  </div>
                  {room.featured && (
                    <div className="absolute top-3 right-3 py-1 px-2.5 rounded-lg bg-amber-800 text-amber-100 text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900">{room.roomName}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      room.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 font-medium">{room.roomType} • Max {room.capacity} Guests</p>
                </div>

                <div className="text-lg font-black text-stone-900">
                  {formatCurrency(room.pricePerNight)} <span className="text-xs font-normal text-stone-400">/ night</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  onClick={() => { setEditingRoom(room); setIsModalOpen(true); }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  title="Edit Room"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingRoomId(room.roomId)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                  title="Delete Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Modal */}
      {isModalOpen && (
        <RoomModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingRoom(null); }}
          onSave={handleSaveRoom}
          room={editingRoom}
        />
      )}

      {/* Delete Confirm */}
      {deletingRoomId && (
        <ConfirmDialog
          isOpen={Boolean(deletingRoomId)}
          onClose={() => setDeletingRoomId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Room"
          message="Are you sure you want to remove this room from the database? This action cannot be undone."
          confirmText="Yes, Delete"
          isDangerous
        />
      )}

    </div>
  );
};
