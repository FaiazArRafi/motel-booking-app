import React, { useState, useEffect } from 'react';
import { noticeService } from '../../services/noticeService';
import { Notice } from '../../types/notice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { NoticeModal } from '../../components/admin/NoticeModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Plus, Edit2, Trash2, Bell, Info } from 'lucide-react';

export const AdminNoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState<string | null>(null);
  const { success, error } = useToast();

  const loadNotices = async () => {
    try {
      const list = await noticeService.getAllNotices();
      setNotices(list);
    } catch (e) {
      console.error('Error loading notices:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleSave = async (data: Partial<Notice>) => {
    try {
      if (editingNotice) {
        await noticeService.updateNotice(editingNotice.noticeId, data);
        success('Notice updated!');
      } else {
        await noticeService.createNotice(data as any);
        success('Notice created!');
      }
      setIsModalOpen(false);
      setEditingNotice(null);
      await loadNotices();
    } catch (err: any) {
      error(err.message || 'Failed to save notice');
    }
  };

  const handleDelete = async () => {
    if (!deletingNoticeId) return;
    try {
      await noticeService.deleteNotice(deletingNoticeId);
      success('Notice deleted.');
      setDeletingNoticeId(null);
      await loadNotices();
    } catch (err: any) {
      error(err.message || 'Failed to delete notice');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Guest Notices & Bulletins</h1>
          <p className="text-xs text-stone-500 mt-1">Post updates regarding check-in procedures, facility closures, or seasonal announcements.</p>
        </div>

        <button
          onClick={() => { setEditingNotice(null); setIsModalOpen(true); }}
          className="py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Notice</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading notices..." />
      ) : (
        <div className="space-y-4">
          {notices.map(notice => (
            <div
              key={notice.noticeId}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    notice.type === 'important' ? 'bg-rose-100 text-rose-800' :
                    notice.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notice.type}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    notice.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {notice.active ? 'Active on banner' : 'Inactive'}
                  </span>
                  <span className="text-xs text-stone-400">{formatDisplayDate(notice.createdAt)}</span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-1">{notice.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{notice.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setEditingNotice(notice); setIsModalOpen(true); }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingNoticeId(notice.noticeId)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <NoticeModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingNotice(null); }}
          onSave={handleSave}
          notice={editingNotice}
        />
      )}

      {deletingNoticeId && (
        <ConfirmDialog
          isOpen={Boolean(deletingNoticeId)}
          onClose={() => setDeletingNoticeId(null)}
          onConfirm={handleDelete}
          title="Delete Notice"
          message="Are you sure you want to delete this notice bulletin?"
          confirmText="Yes, Delete"
          isDangerous
        />
      )}

    </div>
  );
};
