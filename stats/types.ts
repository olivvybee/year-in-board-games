export interface MostPlayedGame {
  name: string;
  id: number;
  plays: number;
  minutesPlayed: number;
  image?: string;
}

export interface Stats {
  gamesPlayed: number;
  plays: number;
  newGames: number;
  minutesSpent: number;
  daysPlayed: number;
  players: number;
  mostPlayedGames: MostPlayedGame[];
}
