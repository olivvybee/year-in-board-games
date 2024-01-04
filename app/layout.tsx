import type { Metadata } from 'next';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import './variables.css';
import './fonts.css';
import './globals.css';

import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Year In Board Games',
  description: "Create a summary of the board games you've played this year.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <div className={styles.pageWrapper}>
          <Navbar />
          <div className={styles.content}>{children}</div>
          <div className={styles.spacer} />
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
