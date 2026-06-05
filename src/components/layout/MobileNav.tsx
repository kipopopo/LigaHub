'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import styles from './MobileNav.module.css';

const navItems = [
  { href: '/', icon: '🏠', labelKey: 'nav.home' },
  { href: '/fixtures/', icon: '📅', labelKey: 'nav.fixtures' },
  { href: '/standings/', icon: '🏆', labelKey: 'nav.standings' },
  { href: '/teams/', icon: '👥', labelKey: 'nav.teams' },
  { href: '/media/', icon: '🎬', labelKey: 'nav.media' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.mobileNav} id="mobile-bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
          id={`mobile-nav-${item.labelKey.split('.')[1]}`}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          <span className={styles.navLabel}>{t(item.labelKey)}</span>
          {isActive(item.href) && <span className={styles.activeIndicator} />}
        </Link>
      ))}
    </nav>
  );
}
