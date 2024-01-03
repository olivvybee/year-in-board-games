'use client';

import { Stats } from '@/stats/types';
import { getMonthName } from '@/utils/getMonthName';

interface GenerateImageParams {
  canvas: HTMLCanvasElement;
  stats: Stats;
  username: string;
  year: string;
  month?: string;
  sortBy: string;
}

export const generateImage = ({
  canvas,
  stats,
  username,
  year,
  month,
  sortBy,
}: GenerateImageParams) => {
  canvas.width = 1600;
  canvas.height = 1600;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#e7504b');
  gradient.addColorStop(0.2, '#ed9456');
  gradient.addColorStop(0.4, '#e4c15c');
  gradient.addColorStop(0.6, '#6bb58b');
  gradient.addColorStop(0.8, '#6897df');
  gradient.addColorStop(1, '#8b73ed');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.globalAlpha = 0.2;
  ctx.fillRect(100, 475, 290, 290);
  ctx.fillRect(470, 475, 290, 290);
  ctx.fillRect(840, 475, 290, 290);
  ctx.fillRect(1210, 475, 290, 290);

  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'top';

  ctx.font = '80px Atkinson Hyperlegible';
  ctx.fillText(`${username}'s`, 100, 100);

  if (!!month) {
    ctx.font = '80px Atkinson Hyperlegible';
    ctx.fillText('Month in board games', 100, 240);
    ctx.fillText(`${getMonthName(month)} ${year}`, 100, 340);
  } else {
    ctx.font = '120px Atkinson Hyperlegible';
    ctx.fillText('Year in board', 100, 190);
    ctx.fillText(`games ${year}`, 100, 310);
  }

  ctx.textAlign = 'center';

  ctx.font = '320px Atkinson Hyperlegible';
  const { width: countWidth } = ctx.measureText(stats.gamesPlayed.toString());
  ctx.font = '65px Atkinson Hyperlegible';
  const { width: textWidth } = ctx.measureText('games played');

  const midpoint = canvas.width - 100 - Math.max(textWidth, countWidth) / 2;

  ctx.font = '320px Atkinson Hyperlegible';
  ctx.fillText(stats.gamesPlayed.toString(), midpoint, 65);
  ctx.font = '65px Atkinson Hyperlegible';
  ctx.fillText('games played', midpoint, 350);

  const hours = Math.round(stats.minutesSpent / 60);

  ctx.font = '140px Atkinson Hyperlegible';
  ctx.fillText(stats.plays.toString(), 245, 530);
  ctx.fillText(stats.newGames.toString(), 615, 530);
  ctx.fillText(hours.toString(), 985, 530);
  ctx.fillText(stats.daysPlayed.toString(), 1355, 530);

  ctx.font = '40px Atkinson Hyperlegible';
  ctx.fillText('Plays', 245, 670);
  ctx.fillText('New games', 615, 670);
  ctx.fillText('Hours', 985, 670);
  ctx.fillText('Days played', 1355, 670);

  ctx.font = '50px Atkinson Hyperlegible';
  ctx.fillText('Most played games', canvas.width / 2, 850);

  const imageData = canvas.toDataURL('image/png');
  return imageData;
};
