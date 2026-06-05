'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/lib/i18n';
import styles from './layout.module.css';

const adminNavItems = [
  { href: '/admin/', icon: '📊', label: 'Dashboard' },
  { href: '/admin/fixtures/', icon: '📅', label: 'Fixtures & Scores' },
  { href: '/admin/teams/', icon: '👥', label: 'Teams' },
  { href: '/admin/media/', icon: '🎬', label: 'Media' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
        <div className="loading-shimmer" style={{ width: '200px', height: '40px', margin: '0 auto', borderRadius: 'var(--radius-md)' }} />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className={styles.adminLayout} id="admin-layout">
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.adminBadge}>⚙️ Admin Panel</span>
        </div>
        <nav className={styles.sidebarNav}>
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.sidebarLink}>
            <span>🏠</span>
            <span>{t('nav.home')}</span>
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className={styles.adminContent}>
        {children}
      </main>
    </div>
  );
}
