import { CgSpinner } from 'react-icons/cg';

import styles from './loading.module.css';

const LoadingScreen = () => (
  <div className={styles.loadingPage}>
    <div className={styles.spinnerAndText}>
      <CgSpinner className={styles.spinner} />
      <span className={styles.mainText}>Loading data from BGG...</span>
    </div>

    <span className={styles.secondaryText}>
      This shouldn't take more than a few seconds
    </span>
  </div>
);

export default LoadingScreen;
