'use client';
import { useContext, useEffect, useRef, useState } from 'react';

import { generateImage } from '@/generator/generateImage';
import { Stats } from '@/stats/types';

import styles from './Result.module.css';
import { Sidebar } from '../Sidebar';
import { dataContext } from '@/context/DataContext';

export const Result = () => {
  const data = useContext(dataContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageData, setImageData] = useState<string>();

  const updateImageData = async () => {
    const newImageData = await generateImage({
      canvas: canvasRef.current!,
      ...data,
    });
    setImageData(newImageData);
  };

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      updateImageData();
    }
  }, [data]);

  return (
    <>
      <div className={styles.wrapper}>
        <img ref={imageRef} src={imageData} className={styles.outputImage} />

        <Sidebar imageData={imageData} />
      </div>

      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
