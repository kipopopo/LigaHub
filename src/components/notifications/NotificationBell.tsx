'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Notification } from '@/types';
import styles from './NotificationBell.module.css';

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'demo',
    type: 'score',
    title: 'Score Update',
    body: 'Harimau Muda FC 2 - 1 Garuda United (FT)',
    fixtureId: 'fixture-u15-grp-a-0-1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'demo',
    type: 'schedule',
    title: 'Match Reminder',
    body: 'Panthera FC vs Badak FC starts in 1 hour',
    fixtureId: 'fixture-u17-grp-a-0-1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'demo',
    type: 'media',
    title: 'New Highlight',
    body: 'Matchday 1 Highlights are now available!',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export default function NotificationBell() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'score': return '⚽';
      case 'schedule': return '📅';
      case 'media': return '🎬';
      default: return '🔔';
    }
  };

  return (
    <div className={styles.bellWrapper}>
      <button
        className={styles.bellBtn}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        id="notification-bell"
      >
        🔔
        {unreadCount > 0 && (
          <span className={styles.bellBadge}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <>
          <div className={styles.bellOverlay} onClick={() => setOpen(false)} />
          <div className={styles.dropdown} id="notification-dropdown">
            <div className={styles.dropdownHeader}>
              <h4 className={styles.dropdownTitle}>{t('notifications.title')}</h4>
              {unreadCount > 0 && (
                <button className={styles.markAllBtn} onClick={markAllRead}>
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>

            <div className={styles.notificationList}>
              {notifications.length === 0 ? (
                <div className={styles.emptyState}>
                  <span style={{ fontSize: '1.5rem' }}>🔕</span>
                  <p>{t('notifications.empty')}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    className={`${styles.notificationItem} ${!notif.read ? styles.unread : ''}`}
                    onClick={() => markRead(notif.id)}
                  >
                    <span className={styles.notifIcon}>{getIcon(notif.type)}</span>
                    <div className={styles.notifContent}>
                      <span className={styles.notifTitle}>{notif.title}</span>
                      <span className={styles.notifBody}>{notif.body}</span>
                      <span className={styles.notifTime}>{getTimeAgo(notif.createdAt)}</span>
                    </div>
                    {!notif.read && <span className={styles.unreadDot} />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
