export interface ImageSize {
  width: number;
  height: number;
}

export interface MostPlayedGame {
  name: string;
  id: number;
  plays: number;
  minutesPlayed: number;
  image?: string;
  isNew: boolean;
}

export interface Stats {
  gamesPlayed: number;
  plays: number;
  newGames: number;
  minutesSpent: number;
  playsWithoutDuration: number;
  daysPlayed: number;
  players: number;
  mostPlayedGames: MostPlayedGame[];
}
