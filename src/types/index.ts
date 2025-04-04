
export interface Player {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  playerOneScore: number;
  playerTwoScore: number;
  duration: number; // in minutes
  date: Date;
  complete: boolean;
}

export interface MatchWithPlayers extends Match {
  playerOne: Player;
  playerTwo: Player;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceded: number;
  winPercentage: number;
}

export type TimerDuration = 6 | 8 | 10 | 11 | 12 | 15;
