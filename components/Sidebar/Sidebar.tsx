import { IoCopyOutline, IoSaveOutline, IoShareOutline } from 'react-icons/io5';
import saveAs from 'file-saver';

import { Stats } from '@/stats/types';
import { useCopyToClipboard } from '@/utils/useCopyToClipboard';
import { useNativeShare } from '@/utils/useNativeShare';
import { createFileFromDataURL } from '@/utils/createFileFromDataUrl';

import { Button } from '../Button';
import { Expander } from '../Expander';

import styles from './Sidebar.module.css';
import { useMediaQuery } from '@/utils/useMediaQuery';
import Link from 'next/link';
import { generateAltText } from './generateAltText';

const FILENAME = 'year-in-review';

interface SidebarProps {
  stats: Stats;
  username: string;
  year: string;
  month?: string;
  sortBy: string;
  imageData?: string;
}

export const Sidebar = ({
  imageData,
  stats,
  username,
  year,
  month,
  sortBy,
}: SidebarProps) => {
  const isTouchDevice = useMediaQuery('(pointer: coarse)');

  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const { isSharingSupported, share } = useNativeShare('image/png');
  const shareImage = () => {
    if (imageData) {
      const shareData = {
        file: createFileFromDataURL(imageData, FILENAME),
      };
      share({ data: shareData });
    }
  };

  const downloadImage = () => {
    if (imageData) {
      saveAs(imageData, `${FILENAME}.png`);
    }
  };

  const altText = generateAltText({ stats, username, year, month, sortBy });

  return (
    <div className={styles.sidebar}>
      <div className={styles.helpText}>
        <p>
          Use the {isSharingSupported ? 'buttons' : 'button'} below to share
          your result, or {isTouchDevice ? 'tap and hold' : 'right click'} on
          the image to copy or save it.
        </p>
        <p>
          Want to change some of the options? <Link href="/">Go back</Link> and
          generate another image.
        </p>
      </div>

      <div className={styles.shareSection}>
        {isSharingSupported && (
          <Button
            className={styles.button}
            icon={IoShareOutline}
            onClick={shareImage}
            disabled={!imageData}>
            Share result
          </Button>
        )}
        <Button
          className={styles.button}
          icon={IoSaveOutline}
          onClick={downloadImage}
          disabled={!imageData}>
          Save result
        </Button>
      </div>

      <div className={styles.spacer} />

      <div className={styles.altTextTitleWrapper}>
        <div className={styles.altTextTitle}>Suggested alt text</div>
        <Button
          icon={IoCopyOutline}
          onClick={() => copyToClipboard(altText)}
          small={true}>
          {!!copiedText ? 'Copied' : 'Copy'}
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
