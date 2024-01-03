'use client';
import { useEffect, useRef, useState } from 'react';

import { generateImage } from '@/generator/generateImage';
import { Stats } from '@/stats/types';

import styles from './Result.module.css';
import { Sidebar } from '../Sidebar';

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
    <>
      <div className={styles.wrapper}>
        <img ref={imageRef} src={imageData} className={styles.outputImage} />

        <Sidebar imageData={imageData} stats={stats} />
      </div>

      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
