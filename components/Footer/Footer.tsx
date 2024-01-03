import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <span>
        Board game generator thingy by{' '}
        <a rel="me" href="https://fedi.beehive.gay/@olivvybee">
          olivvybee
        </a>
        . Support her and the site on{' '}
        <a href="https://ko-fi.com/olivvybee">ko-fi</a>. Report issues and
        suggestions on{' '}
        <a href="https://github.com/olivvybee/year-in-board-games">github</a>.
      </span>
    </div>
  </footer>
);
