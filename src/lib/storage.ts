
import { Match, Player, PlayerStats } from "@/types";

// Local Storage Keys
const PLAYERS_KEY = "efootball-tracker-players";
const MATCHES_KEY = "efootball-tracker-matches";

// Helper functions for localStorage
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  
  const item = localStorage.getItem(key);
  if (item === null) return defaultValue;
  
  try {
    const parsed = JSON.parse(item);
    
    // Parse date strings back to Date objects if they look like dates
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        if (item && item.date) {
          item.date = new Date(item.date);
        }
        if (item && item.createdAt) {
          item.createdAt = new Date(item.createdAt);
        }
        return item;
      }) as T;
    }
    
    return parsed as T;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Player functions
export const getPlayers = (): Player[] => {
  return getLocalStorageItem<Player[]>(PLAYERS_KEY, []);
};

export const addPlayer = (name: string): Player => {
  const players = getPlayers();
  
  const newPlayer: Player = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
  };
  
  players.push(newPlayer);
  setLocalStorageItem(PLAYERS_KEY, players);
  
  return newPlayer;
};

export const updatePlayer = (player: Player): void => {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === player.id);
  
  if (index !== -1) {
    players[index] = player;
    setLocalStorageItem(PLAYERS_KEY, players);
  }
};

export const deletePlayer = (id: string): void => {
  const players = getPlayers();
  const filteredPlayers = players.filter(player => player.id !== id);
  setLocalStorageItem(PLAYERS_KEY, filteredPlayers);
};

// Match functions
export const getMatches = (): Match[] => {
  return getLocalStorageItem<Match[]>(MATCHES_KEY, []);
};

export const addMatch = (match: Omit<Match, 'id'>): Match => {
  const matches = getMatches();
  
  const newMatch: Match = {
    ...match,
    id: crypto.randomUUID()
  };
  
  matches.push(newMatch);
  setLocalStorageItem(MATCHES_KEY, matches);
  
  return newMatch;
};

export const updateMatch = (match: Match): void => {
  const matches = getMatches();
  const index = matches.findIndex(m => m.id === match.id);
  
  if (index !== -1) {
    matches[index] = match;
    setLocalStorageItem(MATCHES_KEY, matches);
  }
};

export const deleteMatch = (id: string): void => {
  const matches = getMatches();
  const filteredMatches = matches.filter(match => match.id !== id);
  setLocalStorageItem(MATCHES_KEY, filteredMatches);
};

// Statistics functions
export const calculatePlayerStats = (playerId: string): PlayerStats | null => {
  const players = getPlayers();
  const player = players.find(p => p.id === playerId);
  
  if (!player) return null;
  
  const matches = getMatches();
  const playerMatches = matches.filter(
    m => (m.playerOneId === playerId || m.playerTwoId === playerId) && m.complete
  );
  
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let goalsScored = 0;
  let goalsConceded = 0;
  
  playerMatches.forEach(match => {
    const isPlayerOne = match.playerOneId === playerId;
    const playerScore = isPlayerOne ? match.playerOneScore : match.playerTwoScore;
    const opponentScore = isPlayerOne ? match.playerTwoScore : match.playerOneScore;
    
    goalsScored += playerScore;
    goalsConceded += opponentScore;
    
    if (playerScore > opponentScore) {
      wins++;
    } else if (playerScore < opponentScore) {
      losses++;
    } else {
      draws++;
    }
  });
  
  const matchesPlayed = playerMatches.length;
  const winPercentage = matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0;
  
  return {
    playerId,
    playerName: player.name,
    matchesPlayed,
    wins,
    losses,
    draws,
    goalsScored,
    goalsConceded,
    winPercentage
  };
};

export const calculateAllPlayersStats = (): PlayerStats[] => {
  const players = getPlayers();
  return players.map(player => calculatePlayerStats(player.id)!).filter(Boolean);
};

// Filter matches by date range
export const getMatchesByDateRange = (startDate: Date, endDate: Date): Match[] => {
  const matches = getMatches();
  return matches.filter(match => {
    const matchDate = new Date(match.date);
    return matchDate >= startDate && matchDate <= endDate;
  });
};

// Get matches for the current month
export const getCurrentMonthMatches = (): Match[] => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  return getMatchesByDateRange(startDate, endDate);
};

// Get matches for the current year
export const getCurrentYearMatches = (): Match[] => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  
  return getMatchesByDateRange(startDate, endDate);
};

// Get matches grouped by month for a specific year
export const getMatchesByMonth = (year: number): Record<number, Match[]> => {
  const matches = getMatches();
  const matchesByMonth: Record<number, Match[]> = {};
  
  // Initialize all months
  for (let month = 0; month < 12; month++) {
    matchesByMonth[month] = [];
  }
  
  matches.forEach(match => {
    const matchDate = new Date(match.date);
    if (matchDate.getFullYear() === year) {
      const month = matchDate.getMonth();
      if (!matchesByMonth[month]) {
        matchesByMonth[month] = [];
      }
      matchesByMonth[month].push(match);
    }
  });
  
  return matchesByMonth;
};
