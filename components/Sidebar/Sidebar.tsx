import { IoCopyOutline } from 'react-icons/io5';

import { Stats } from '@/stats/types';

import { Button } from '../Button';
import { Expander } from '../Expander';

import styles from './Sidebar.module.css';

interface SidebarProps {
  stats: Stats;
  imageData?: string;
}

export const Sidebar = ({ stats, imageData }: SidebarProps) => {
  const altText = 'Beans';

  return (
    <div className={styles.sidebar}>
      <p className={styles.helpText}>Beans</p>

      <div className={styles.spacer} />

      <div className={styles.altTextTitleWrapper}>
        <div className={styles.altTextTitle}>Suggested alt text</div>
        <Button
          icon={IoCopyOutline}
          // onClick={() => copyToClipboard(altText || '')}
          small={true}>
          {/*!!copiedText ? 'Copied' :*/ 'Copy'}
        </Button>
      </div>

      <Expander
        renderTrigger={(toggle, isExpanded) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}>
            {isExpanded ? 'Hide' : 'Show'} suggested alt text
          </a>
        )}>
        <p className={styles.altText}>{altText}</p>
      </Expander>

      <Expander
        className={styles.altTextExplanation}
        renderTrigger={(toggle) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}>
            What is alt text?
          </a>
        )}>
        <p>
          Alt text is used to describe images for people who can't otherwise
          view them.
        </p>
        <p>
          For example, someone who is partially sighted might use software
          called a screen reader, where the computer reads out what's on the
          screen. Alt text is used by that software to describe the image, since
          computers aren't able to accurately detect the contents of an image
          without help.
        </p>
        <p>
          If you're sharing images on social media, please consider adding alt
          text so that they're accessible to everyone.
        </p>
      </Expander>
    </div>
  );
};
