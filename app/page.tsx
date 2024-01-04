import { SetupForm } from '@/components/SetupForm';

import styles from './page.module.css';

const Homepage = async () => (
  <>
    <div className={styles.intro}>
      <p>
        Use your logged plays on BoardGameGeek to generate an image summarising
        your year (or month) in board games.
      </p>
      <p>
        Simply enter your BGG username, choose a year or month, and choose
        whether to sort by play count or time spent when calculating your most
        played games. Then an image will automatically be generated which you
        can download or share.
      </p>
      <p>
        YIBG doesn't store any of your data and doesn't require your BGG
        password. All the data being used is already publicly available on BGG.
      </p>
    </div>

    <SetupForm />
  </>
);

export default Homepage;
