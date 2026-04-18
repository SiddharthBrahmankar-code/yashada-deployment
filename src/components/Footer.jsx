import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={`${styles.footer} section--dark`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.brandName}>
              Yashada<span> Enterprises</span>
            </div>
            <p>
              Converters of self-adhesive tapes and distributors of industrial
              electrical components. Serving the industry from Nashik since 2005.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Plot No-28 B-14, Flatted Building,<br />
              MIDC Satpur, Nashik - 422010
            </p>
          </div>

          <div>
            <h4 className={styles.colTitle}>Products</h4>
            <div className={styles.links}>
              <Link href="/products#self-adhesive-tapes">Adhesive Tapes</Link>
              <Link href="/products#electrical-insulation-tapes">Insulation Tapes</Link>
              <Link href="/products#nylon-cable-ties">Cable Ties</Link>
              <Link href="/products#brass-cable-glands">Cable Glands</Link>
              <Link href="/products#busbar-support">Busbar Systems</Link>
              <Link href="/products#cable-tray">Channels & Hardware</Link>
            </div>
          </div>

          <div>
            <h4 className={styles.colTitle}>Brands</h4>
            <div className={styles.links}>
              <Link href="/brands">Surelock</Link>
              <Link href="/brands">Woer</Link>
              <Link href="/brands">Premium</Link>
              <Link href="/brands">Steelgrip</Link>
              <Link href="/brands">Haria</Link>
              <Link href="/brands">Jainson</Link>
            </div>
          </div>

          <div>
            <h4 className={styles.colTitle}>Contact</h4>
            <div className={styles.links}>
              <a href="tel:02536602234">0253-6602234</a>
              <a href="tel:8208997234">+91 82089 97234</a>
              <a href="mailto:yashadaenterprises@gmail.com">yashadaenterprises@gmail.com</a>
              <a
                href="https://wa.me/918208997234?text=Hello%20Yashada%20Enterprises%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Yashada Enterprises. All rights reserved.</span>
          <span>Nashik, Maharashtra, India</span>
        </div>
      </div>
    </footer>
  );
}
