import styles from './ErrorBanner.module.css';

interface ErrorBannerProps {
  children: React.ReactNode;
}

export const ErrorBanner = ({ children }: ErrorBannerProps) => (
  <div className={styles.errorBanner}>{children}</div>
);
