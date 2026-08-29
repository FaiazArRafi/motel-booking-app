import React, { useState, useEffect } from 'react';
import { noticeService } from '../../services/noticeService';
import { Notice } from '../../types/notice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Bell, Info, AlertTriangle, AlertCircle, Calendar } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticeService.getActiveNotices()
      .then(setNotices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const typeConfig = {
    information: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <Info className="w-6 h-6 text-amber-700 shrink-0" />,
      badge: 'Information'
    },
    warning: {
      bg: 'bg-amber-100 border-amber-300 text-amber-950',
      icon: <AlertTriangle className="w-6 h-6 text-amber-800 shrink-0" />,
      badge: 'Attention'
    },
    important: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-6 h-6 text-rose-700 shrink-0" />,
      badge: 'Important Announcement'
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Guest Bulletins & Updates
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Motel Notices & News
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Stay informed about facility hours, express check-in guidelines, and seasonal updates.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading guest notices..." />
        ) : notices.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8 text-amber-800" />}
            title="No notices available"
            description="There are currently no active announcements or advisories posted."
          />
        ) : (
          <div className="space-y-4">
            {notices.map(notice => {
              const cfg = typeConfig[notice.type] || typeConfig.information;
              return (
                <div
                  key={notice.noticeId}
                  className={`p-6 rounded-3xl border shadow-sm ${cfg.bg} space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {cfg.icon}
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/10">
                          {cfg.badge}
                        </span>
                        <h3 className="text-lg font-bold text-stone-900 mt-1">{notice.title}</h3>
                      </div>
                    </div>
                    {notice.createdAt && (
                      <span className="text-xs text-stone-500 font-medium shrink-0">
                        {formatDisplayDate(notice.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pl-9">
                    {notice.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
