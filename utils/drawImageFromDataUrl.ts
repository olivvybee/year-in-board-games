export const drawImageFromDataUrl = async (
  ctx: CanvasRenderingContext2D,
  dataUrl: string,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const image = new Image();

  return new Promise<void>((resolve) => {
    image.onload = () => {
      ctx.drawImage(image, x, y, w, h);
      resolve();
    };

    image.src = dataUrl;
  });
};
