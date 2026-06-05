'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import styles from './Header.module.css';

export default function Header() {
  const { t, language, toggleLanguage } = useI18n();
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/fixtures/', label: t('nav.fixtures') },
    { href: '/standings/', label: t('nav.standings') },
    { href: '/teams/', label: t('nav.teams') },
    { href: '/media/', label: t('nav.media') },
  ];

  return (
    <header className={styles.header} id="main-header">
      <div className={`container ${styles.headerInner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="header-logo">
          <span className={styles.logoIcon}>⚽</span>
          <span className={styles.logoText}>
            Liga<span className={styles.logoAccent}>Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav} id="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin/" className={`${styles.navLink} ${styles.adminLink}`}>
              {t('nav.admin')}
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className={styles.actions}>
          {/* Language toggle */}
          <button
            className={styles.langToggle}
            onClick={toggleLanguage}
            aria-label="Toggle language"
            id="lang-toggle"
          >
            {language === 'en' ? 'BM' : 'EN'}
          </button>

          {/* Auth-dependent actions */}
          {user ? (
            <>
              <NotificationBell />
              <div className={styles.profileWrapper}>
                <button
                  className={styles.profileBtn}
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Profile menu"
                  id="profile-menu-btn"
                >
                  <span className={styles.profileAvatar}>
                    {user.displayName?.[0]?.toUpperCase() || '?'}
                  </span>
                </button>
                {profileOpen && (
                  <>
                    <div className={styles.profileOverlay} onClick={() => setProfileOpen(false)} />
                    <div className={styles.profileDropdown} id="profile-dropdown">
                      <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{user.displayName}</span>
                        <span className={styles.profileEmail}>{user.email}</span>
                        {isAdmin && <span className="badge badge-accent" style={{ fontSize: '0.6rem' }}>Admin</span>}
                      </div>
                      <hr className="divider" />
                      <Link href="/profile/" className={styles.profileLink} onClick={() => setProfileOpen(false)}>
                        👤 {t('nav.profile')}
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/" className={styles.profileLink} onClick={() => setProfileOpen(false)}>
                          ⚙️ {t('nav.admin')}
                        </Link>
                      )}
                      <button className={styles.profileLink} onClick={() => { logout(); setProfileOpen(false); }}>
                        🚪 {t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link href="/auth/login/" className={`btn btn-primary btn-sm ${styles.loginBtn}`} id="header-login-btn">
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            id="mobile-menu-btn"
          >
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen1 : ''}`} />
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen2 : ''}`} />
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen3 : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}
      <nav className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} id="mobile-menu">
        <div className={styles.mobileMenuHeader}>
          <span className={styles.logoText}>
            Liga<span className={styles.logoAccent}>Hub</span>
          </span>
        </div>
        {user && (
          <div className={styles.mobileUserInfo}>
            <span className={styles.profileAvatar} style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
              {user.displayName?.[0]?.toUpperCase() || '?'}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user.displayName}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{user.email}</div>
            </div>
          </div>
        )}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.mobileNavLink}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link href="/admin/" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
            ⚙️ {t('nav.admin')}
          </Link>
        )}
        <hr className="divider" style={{ margin: '0.75rem 0' }} />
        {user ? (
          <>
            <Link href="/profile/" className={`btn btn-ghost ${styles.mobileLoginBtn}`} onClick={() => setMenuOpen(false)}>
              {t('nav.profile')}
            </Link>
            <button className={`btn btn-ghost ${styles.mobileLoginBtn}`} onClick={() => { logout(); setMenuOpen(false); }} style={{ color: 'var(--color-danger)' }}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login/" className={`btn btn-primary ${styles.mobileLoginBtn}`} onClick={() => setMenuOpen(false)}>
              {t('nav.login')}
            </Link>
            <Link href="/auth/register/" className={`btn btn-ghost ${styles.mobileLoginBtn}`} onClick={() => setMenuOpen(false)}>
              {t('nav.register')}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
