import { useState, useEffect } from 'react';
import { api } from '../api';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  onNavigate: (tab: string, param?: string) => void;
}

export default function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState<string>('');

  const tabs = ['all', 'teammates', 'upvotes', 'comments', 'grants'];

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(activeTab);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [activeTab]);

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    try {
      const res = await api.handleNotificationAction(id, action);
      setActionMessage(res.message);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, action_status: action, is_read: true } : n))
      );
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Campus Notification Center
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time updates on teammate inquiries, upvotes, and faculty seed grants.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 mb-4 rounded-xl bg-secondary-container/30 text-secondary text-xs font-semibold border border-secondary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-3 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-container-lowest rounded-2xl border border-surface-container animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">notifications_none</span>
          <h3 className="text-base font-bold text-on-surface">No updates in this tab</h3>
          <p className="text-xs text-on-surface-variant mt-1">You are all caught up on campus notifications!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all ${
                notif.is_read
                  ? 'bg-surface-container-lowest border-surface-container'
                  : 'bg-surface-container-low border-primary/20 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {notif.type === 'teammates'
                        ? 'person_add'
                        : notif.type === 'upvotes'
                        ? 'thumb_up'
                        : notif.type === 'grants'
                        ? 'military_tech'
                        : 'chat'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-on-surface">{notif.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{notif.message}</p>
                    {notif.action_link && (
                      <button
                        onClick={() => {
                          const parts = notif.action_link.split('/');
                          onNavigate(parts[1] || 'explore', parts[2]);
                        }}
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>

                {!notif.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </div>

              {/* Actionable Teammate Application Buttons */}
              {notif.is_actionable && notif.action_status === 'pending' && (
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleAction(notif.id, 'decline')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-error border border-error/20 hover:bg-error/5 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAction(notif.id, 'accept')}
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-secondary text-on-secondary shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Accept Candidate
                  </button>
                </div>
              )}

              {notif.action_status === 'accepted' && (
                <div className="mt-3 text-xs font-semibold text-secondary flex items-center gap-1 justify-end">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Candidate Accepted to Team</span>
                </div>
              )}

              {notif.action_status === 'declined' && (
                <div className="mt-3 text-xs font-semibold text-error flex items-center gap-1 justify-end">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  <span>Candidate Declined</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
