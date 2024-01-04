'use client';
import { useContext, useEffect, useRef, useState } from 'react';

import { generateImage } from '@/generator/generateImage';

import styles from './Result.module.css';
import { Sidebar } from '../Sidebar';
import { dataContext } from '@/context/DataContext';
import classNames from 'classnames';

export const Result = () => {
  const data = useContext(dataContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const updating = useRef<boolean>(false);

  const [imageData, setImageData] = useState<string>();

  const updateImageData = async () => {
    updating.current = true;
    const newImageData = await generateImage({
      canvas: canvasRef.current!,
      ...data,
    });
    setImageData(newImageData);
    updating.current = false;
  };

  useEffect(() => {
    if (canvasRef.current && imageRef.current && !updating.current) {
      updateImageData();
    }
  }, [data]);

  return (
    <>
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
