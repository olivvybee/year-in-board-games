import { CropMode } from '@/components/CropSelector';

export const drawImageFromDataUrl = async (
  ctx: CanvasRenderingContext2D,
  dataUrl: string,
  x: number,
  y: number,
  targetSize: number,
  cropMode: CropMode
) => {
  const image = new Image();

  return new Promise<void>((resolve) => {
    image.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = image;

      if (cropMode === 'Fit') {
        if (width > height) {
          const ratio = height / width;
          const yOffset = (targetSize * (1 - ratio)) / 2;
          ctx.drawImage(image, x, y + yOffset, targetSize, targetSize * ratio);
        } else if (height > width) {
          const ratio = width / height;
          const xOffset = (targetSize * (1 - ratio)) / 2;
          ctx.drawImage(image, x + xOffset, y, targetSize * ratio, targetSize);
        } else {
          ctx.drawImage(image, x, y, targetSize, targetSize);
        }
      }

      if (cropMode === 'FillCenter' && height > width) {
        const yStart = (height - width) / 2;
        ctx.drawImage(
          image,
          0,
          yStart,
          width,
          width,
          x,
          y,
          targetSize,
          targetSize
        );
      }

      if (cropMode === 'FillCenter' && width > height) {
        const xStart = (width - height) / 2;
        ctx.drawImage(
          image,
          xStart,
          0,
          height,
          height,
          x,
          y,
          targetSize,
          targetSize
        );
      }

      if (cropMode === 'FillTop') {
        ctx.drawImage(image, 0, 0, width, width, x, y, targetSize, targetSize);
      }

      if (cropMode === 'FillBottom') {
        const yStart = height - width;
        ctx.drawImage(
          image,
          0,
          yStart,
          width,
          width,
          x,
          y,
          targetSize,
          targetSize
        );
      }

      if (cropMode === 'FillLeft') {
        ctx.drawImage(
          image,
          0,
          0,
          height,
          height,
          x,
          y,
          targetSize,
          targetSize
        );
      }

      if (cropMode === 'FillRight') {
        const xStart = width - height;
        ctx.drawImage(
          image,
          xStart,
          0,
          height,
          height,
          x,
          y,
          targetSize,
          targetSize
        );
      }

      resolve();
    };

    image.src = dataUrl;
  });
};
