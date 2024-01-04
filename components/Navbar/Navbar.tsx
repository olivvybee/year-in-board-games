import Link from 'next/link';

import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContent}>
        <Link href="/" className={styles.homeLink}>
          <span className={styles.siteName}>Year In Board Games</span>
        </Link>
      </div>
    </header>
  );
};
