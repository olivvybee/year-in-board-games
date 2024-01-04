import { ImageSize } from '@/stats/types';

export const getImageSize = async (dataUrl: string) => {
  const image = new Image();

  return new Promise<ImageSize>((resolve) => {
    image.onload = () => {
      const { width, height } = image;
      resolve({ width, height });
    };

    image.src = dataUrl;
  });
};
