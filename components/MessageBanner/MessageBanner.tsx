import classNames from 'classnames';
import styles from './MessageBanner.module.css';

interface MessageBannerProps {
  children: React.ReactNode;
  severity: 'error' | 'warning';
  className?: string;
}

export const MessageBanner = ({
  children,
  severity,
  className,
}: MessageBannerProps) => (
  <div className={classNames(styles.banner, styles[severity], className)}>
    {children}
  </div>
);
