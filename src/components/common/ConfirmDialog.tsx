import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center pt-2">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
            isDangerous ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-stone-900 mb-2">{title}</h4>
        <p className="text-sm text-stone-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-800 hover:bg-amber-900'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
