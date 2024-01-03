'use client';
import { useEffect, useRef, useState } from 'react';

import { generateImage } from '@/generator/generateImage';
import { Stats } from '@/stats/types';

import styles from './Result.module.css';
import { Sidebar } from '../Sidebar';

interface ResultProps {
  stats: Stats;
  username: string;
  year: string;
  month?: string;
  sortBy: string;
}

const updateImageData = async (
  props: ResultProps,
  canvas: HTMLCanvasElement,
  setImageData: (imageData: string) => void
) => {
  const newImageData = await generateImage({
    canvas: canvas,
    ...props,
  });
  setImageData(newImageData);
};

export const Result = ({ stats, ...props }: ResultProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageData, setImageData] = useState<string>();

  const updateImageData = async () => {
    const newImageData = await generateImage({
      canvas: canvasRef.current!,
      stats,
      ...props,
    });
    setImageData(newImageData);
  };

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      updateImageData();
    }
  }, [stats]);

  return (
    <>
      <div className={styles.wrapper}>
        <img ref={imageRef} src={imageData} className={styles.outputImage} />

        <Sidebar imageData={imageData} stats={stats} {...props} />
      </div>

      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
