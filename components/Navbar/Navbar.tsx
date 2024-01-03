import Link from 'next/link';

import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContent}>
        <Link href="/" className={styles.homeLink}>
          <span className={styles.siteName}>Board game generator thingy</span>
        </Link>
      </div>
    </header>
  );
};
