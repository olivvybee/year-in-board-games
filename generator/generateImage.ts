'use client';

import { Stats } from '@/stats/types';

export const generateImage = (canvas: HTMLCanvasElement, stats: Stats) => {
  canvas.width = 1600;
  canvas.height = 1600;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.font = '24px sans-serif';
  ctx.fillText(`${stats.gamesPlayed} games played`, 100, 100);

  const imageData = canvas.toDataURL('image/png');
  return imageData;
};
