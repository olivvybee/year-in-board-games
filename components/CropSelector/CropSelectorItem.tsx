import { useEffect, useRef, useState } from 'react';

import { CropMode } from './CropSelector';

import styles from './CropSelectorItem.module.css';
import { ImageSize } from '@/stats/types';
import { getImageSize } from '@/utils/getImageSize';
import { Dropdown, Option } from '../Dropdown';
import { drawImageFromDataUrl } from '@/utils/drawImageFromDataUrl';
import classNames from 'classnames';

const ALL_OPTIONS: Option<CropMode>[] = [
  { value: 'Fit', label: 'Scale to fit' },
  { value: 'FillTop', label: 'Crop to top' },
  { value: 'FillLeft', label: 'Crop to left' },
  { value: 'FillCenter', label: 'Crop to center' },
  { value: 'FillBottom', label: 'Crop to bottom' },
  { value: 'FillRight', label: 'Crop to right' },
];

interface CropSelectorItemProps {
  gameId: number;
  gameName: string;
  imageUrl: string;
  mode: CropMode;
  onChange: (mode: CropMode) => void;
}

export const CropSelectorItem = ({
  gameId,
  gameName,
  imageUrl,
  mode,
  onChange,
}: CropSelectorItemProps) => {
  const [imageSize, setImageSize] = useState<ImageSize>();

  const updateImageSize = async () => {
    const size = await getImageSize(imageUrl);
    setImageSize(size);
  };

  useEffect(() => {
    updateImageSize();
    updatePreview();
  }, [imageUrl, mode]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const updatePreview = async () => {
    if (!canvasRef.current || !imageRef.current) {
      console.log('beans');
      return;
    }

    const canvas = canvasRef.current;

    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    await drawImageFromDataUrl(ctx, imageUrl, 0, 0, 64, mode);

    const previewData = canvas.toDataURL();
    imageRef.current.src = previewData;
  };

  const isSquare =
    imageSize && Math.abs(imageSize.height - imageSize.width) <= 10;
  const isVertical = imageSize && imageSize.height > imageSize.width;

  const validModes: CropMode[] = isVertical
    ? ['Fit', 'FillTop', 'FillCenter', 'FillBottom']
    : ['Fit', 'FillLeft', 'FillCenter', 'FillRight'];

  const options = ALL_OPTIONS.filter((option) =>
    validModes.includes(option.value)
  );

  return (
    <>
      <div
        className={classNames(styles.wrapper, { [styles.hidden]: isSquare })}>
        <div className={styles.previewWrapper}>
          <img className={styles.preview} ref={imageRef} />
        </div>

        <div className={styles.input}>
          <label className={styles.gameName} htmlFor={`crop-mode-${gameId}`}>
            {gameName}
          </label>

          <Dropdown options={options} value={mode} onChange={onChange} />
        </div>
      </div>

      <canvas className={styles.canvas} ref={canvasRef} />
    </>
  );
};
