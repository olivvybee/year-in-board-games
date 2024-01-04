import { CropMode } from '@/components/CropSelector';

export const drawImageFromDataUrl = async (
  ctx: CanvasRenderingContext2D,
  dataUrl: string,
  x: number,
  y: number,
  w: number,
  h: number,
  cropMode: CropMode
) => {
  const image = new Image();

  return new Promise<void>((resolve) => {
    image.onload = () => {
      const { width, height } = image;

      if (width > height) {
        const ratio = height / width;
        const yOffset = h * (1 - ratio);
        ctx.drawImage(image, x, y + yOffset, w, h * ratio);
      } else if (height > width) {
        const ratio = width / height;
        const xOffset = (w * (1 - ratio)) / 2;
        ctx.drawImage(image, x + xOffset, y, w * ratio, h);
      } else {
        ctx.drawImage(image, x, y, w, h);
      }
      resolve();
    };

    image.src = dataUrl;
  });
};
