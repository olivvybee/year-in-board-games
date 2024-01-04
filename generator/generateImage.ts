'use client';

import { MostPlayedGame, Stats } from '@/stats/types';
import { getMonthName } from '@/utils/getMonthName';
import { drawImageFromDataUrl } from '@/utils/drawImageFromDataUrl';
import { loadFont } from '@/utils/loadFont';
import { CropMode, CropSettings } from '@/components/CropSelector';

const BOX_ART_SIZE = 267;

interface GenerateImageParams {
  canvas: HTMLCanvasElement;
  stats: Stats;
  username: string;
  year: string;
  month?: string;
  sortBy: string;
  cropSettings?: CropSettings;
}

export const generateImage = async ({
  canvas,
  stats,
  username,
  year,
  month,
  sortBy,
  cropSettings = {},
}: GenerateImageParams) => {
  canvas.width = 1600;
  canvas.height = 1600;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return '';
  }

  await loadFont();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  ctx.textAlign = 'left';

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
  const usePlayerCount = stats.minutesSpent === 0;

  ctx.font = '140px Atkinson Hyperlegible';
  ctx.fillText(stats.plays.toString(), 245, 530);
  ctx.fillText(stats.newGames.toString(), 615, 530);
  ctx.fillText(
    usePlayerCount ? stats.players.toString() : hours.toString(),
    985,
    530
  );
  ctx.fillText(stats.daysPlayed.toString(), 1355, 530);

  ctx.font = '40px Atkinson Hyperlegible';
  ctx.fillText(stats.plays === 1 ? 'play' : 'plays', 245, 670);
  ctx.fillText(stats.newGames === 1 ? 'new game' : 'new games', 615, 670);
  ctx.fillText(
    usePlayerCount
      ? stats.players === 1
        ? 'other player'
        : 'other players'
      : hours === 1
      ? 'hour'
      : 'hours',
    985,
    670
  );
  ctx.fillText(
    stats.daysPlayed === 1 ? 'day played' : 'days played',
    1355,
    670
  );

  ctx.font = '50px Atkinson Hyperlegible';
  ctx.fillText('Most played games', canvas.width / 2, 830);

  const numMostPlayed = stats.mostPlayedGames.length;
  const rows = Math.ceil(numMostPlayed / 5);
  const topRowCount = rows === 1 ? numMostPlayed : Math.ceil(numMostPlayed / 2);
  const bottomRowCount = numMostPlayed - topRowCount;

  const leftEdge = 100;
  const rightEdge = canvas.width - 100;
  const availableSpace = rightEdge - leftEdge;

  const spacing = (availableSpace - 5 * BOX_ART_SIZE) / 4;

  const topRowWidth =
    topRowCount * BOX_ART_SIZE + Math.max(0, topRowCount - 1) * spacing;
  const topRowStartX = leftEdge + (availableSpace - topRowWidth) / 2;

  const bottomRowWidth =
    bottomRowCount * BOX_ART_SIZE + Math.max(0, bottomRowCount - 1) * spacing;
  const bottomRowStartX = leftEdge + (availableSpace - bottomRowWidth) / 2;

  ctx.font = '36px Atkinson Hyperlegible';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const showPlays = sortBy === 'plays';

  for (let i = 0; i < topRowCount; i++) {
    const game = stats.mostPlayedGames[i];
    const cropMode = cropSettings[game.id] || 'Fit';
    const x = topRowStartX + i * BOX_ART_SIZE + i * spacing;
    await drawMostPlayed(ctx, game, x, 910, showPlays, cropMode);
  }

  for (let i = 0; i < bottomRowCount; i++) {
    const game = stats.mostPlayedGames[i + topRowCount];
    const cropMode = cropSettings[game.id] || 'Fit';
    const x = bottomRowStartX + i * BOX_ART_SIZE + i * spacing;
    await drawMostPlayed(ctx, game, x, 1235, showPlays, cropMode);
  }

  const imageData = canvas.toDataURL('image/png');
  return imageData;
};

const drawMostPlayed = async (
  ctx: CanvasRenderingContext2D,
  game: MostPlayedGame,
  x: number,
  y: number,
  showPlays: boolean,
  cropMode: CropMode
) => {
  ctx.font = '36px Atkinson Hyperlegible';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'white';
  ctx.globalAlpha = 0.2;
  ctx.fillRect(x, y, BOX_ART_SIZE, BOX_ART_SIZE);
  ctx.globalAlpha = 1;

  if (game.image) {
    await drawImageFromDataUrl(ctx, game.image, x, y, BOX_ART_SIZE, cropMode);
  }

  const hours = Math.round(game.minutesPlayed / 60);
  const amount = showPlays
    ? `${game.plays} ${game.plays === 1 ? 'play' : 'plays'}`
    : `${hours} ${hours === 1 ? 'hour' : 'hours'}`;

  const textX = x + BOX_ART_SIZE / 2;
  const { width: textWidth } = ctx.measureText(amount);

  ctx.fillStyle = '#eeeeee';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(
    textX - textWidth / 2 - 16,
    y + BOX_ART_SIZE - 32,
    textWidth + 32,
    58,
    10
  );
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'black';
  ctx.fillText(amount, textX, y + BOX_ART_SIZE);
};
