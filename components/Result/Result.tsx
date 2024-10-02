'use client';
import { useContext, useEffect, useRef, useState } from 'react';

import { generateImage } from '@/generator/generateImage';

import styles from './Result.module.css';
import { Sidebar } from '../Sidebar';
import { dataContext } from '@/context/DataContext';
import classNames from 'classnames';
import { MessageBanner } from '../MessageBanner';

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

  const showHoursWarning =
    data.stats.playsWithoutDuration > data.stats.plays * 0.4;

  return (
    <>
      {showHoursWarning && (
        <MessageBanner severity="warning" className={styles.banner}>
          A large number of your plays don't have the duration saved. The number
          of hours in your image will be inaccurate.
        </MessageBanner>
      )}

      <div className={styles.wrapper}>
        <img
          ref={imageRef}
          src={imageData || '/placeholder.jpg'}
          className={styles.outputImage}
        />
        <Sidebar imageData={imageData} />
      </div>

      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
