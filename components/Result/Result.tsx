'use client';
import { useEffect, useRef, useState } from 'react';

import { generateImage } from '@/generator/generateImage';
import { Stats } from '@/stats/types';

import styles from './Result.module.css';

interface ResultProps {
  stats: Stats;
}

export const Result = ({ stats }: ResultProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageData, setImageData] = useState<string>();

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      const newImageData = generateImage(canvasRef.current, stats);
      setImageData(newImageData);
    }
  }, [stats]);

  return (
    <div>
      <canvas ref={canvasRef} className={styles.canvas} />
      <img ref={imageRef} src={imageData} className={styles.outputImage} />
    </div>
  );
};
