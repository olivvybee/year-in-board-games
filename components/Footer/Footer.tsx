import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <span>
        YIBG was created by{' '}
        <a rel="me" href="https://anarres.family/@olivvybee">
          olivvybee
        </a>
        . Help keep the site running by{' '}
        <a href="https://ko-fi.com/olivvybee">donating on ko-fi</a>. Report
        issues and suggestions on{' '}
        <a href="https://github.com/olivvybee/year-in-board-games">github</a>.
        Data provided by <a href="https://boardgamegeek.com">BoardGameGeek</a>.
      </span>
    </div>
  </footer>
);
