export interface MostPlayedGame {
  name: string;
  id: number;
  plays: number;
  minutesPlayed: number;
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
