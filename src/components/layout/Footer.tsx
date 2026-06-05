import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="main-footer">
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerTop}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <span className={styles.logoText}>
              Liga<span className={styles.logoAccent}>Hub</span>
            </span>
            <p className={styles.tagline}>
              The premier youth football tournament platform. Connecting teams, players, and fans.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerLinks}>
            <h4 className={styles.linksTitle}>Quick Links</h4>
            <Link href="/fixtures/">Fixtures</Link>
            <Link href="/standings/">Standings</Link>
            <Link href="/teams/">Teams</Link>
            <Link href="/media/">Media Hub</Link>
          </div>

          {/* Info */}
          <div className={styles.footerLinks}>
            <h4 className={styles.linksTitle}>Information</h4>
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>

        <hr className="divider" />

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} LigaHub. All rights reserved.
          </p>
          <p className={styles.powered}>
            Powered by <span className={styles.logoAccent}>LigaHub</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
