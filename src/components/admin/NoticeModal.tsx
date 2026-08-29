import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Notice } from '../../types/notice';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noticeData: Partial<Notice>) => Promise<void>;
  notice?: Notice | null;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  notice
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'information' | 'warning' | 'important'>('information');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setMessage(notice.message);
      setType(notice.type);
      setActive(notice.active);
    } else {
      setTitle('');
      setMessage('');
      setType('information');
      setActive(true);
    }
  }, [notice, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        message,
        type,
        active
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={notice ? 'Edit Notice' : 'Add Guest Notice'} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Notice Headline *</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Express Late Check-In Available"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Notice Type *</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          >
            <option value="information">Information (Standard Amber)</option>
            <option value="warning">Warning (Attention Amber/Yellow)</option>
            <option value="important">Important (High-Priority Rose)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Message Body *</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Detailed announcement text visible to visitors..."
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
          />
        </div>

        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-800">
            <input
              type="checkbox"
              checked={active}
              onChange={e => setActive(e.target.checked)}
              className="w-4 h-4 text-amber-700 rounded focus:ring-amber-700"
            />
            <span>Active on Website Banner</span>
          </label>
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
            {saving ? 'Saving...' : notice ? 'Update Notice' : 'Post Notice'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
