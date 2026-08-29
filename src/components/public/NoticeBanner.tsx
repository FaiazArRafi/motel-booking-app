import React, { useState, useEffect } from 'react';
import { noticeService } from '../../services/noticeService';
import { Notice } from '../../types/notice';
import { Info, AlertTriangle, AlertCircle, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NoticeBanner: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    noticeService.getActiveNotices().then(setNotices).catch(console.error);
  }, []);

  const activeNotices = notices.filter(n => !dismissed.includes(n.noticeId));
  if (activeNotices.length === 0) return null;

  const currentNotice = activeNotices[0];

  const typeConfig = {
    information: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <Info className="w-5 h-5 text-amber-700 shrink-0" />,
      badge: 'Notice'
    },
    warning: {
      bg: 'bg-amber-100 border-amber-300 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />,
      badge: 'Attention'
    },
    important: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />,
      badge: 'Important'
    }
  };

  const currentConfig = typeConfig[currentNotice.type] || typeConfig.information;

  return (
    <div className={`border-b px-4 py-3 ${currentConfig.bg} transition-all animate-in fade-in`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {currentConfig.icon}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-black/10">
              {currentConfig.badge}
            </span>
            <span className="font-semibold">{currentNotice.title}:</span>
            <span className="text-stone-700 text-xs sm:text-sm line-clamp-1">{currentNotice.message}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/notices"
            className="text-xs font-bold underline flex items-center hover:opacity-80 transition"
          >
            All Notices <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed([...dismissed, currentNotice.noticeId])}
            className="p-1 hover:bg-black/5 rounded-lg transition"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
