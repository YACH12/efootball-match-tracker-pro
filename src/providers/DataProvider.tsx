
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { Match, Player, PlayerStats, MatchWithPlayers } from "@/types";
import {
  getPlayers,
  getMatches,
  addPlayer,
  updatePlayer,
  deletePlayer,
  addMatch,
  updateMatch,
  deleteMatch,
  calculatePlayerStats,
  calculateAllPlayersStats,
  getCurrentMonthMatches,
  getCurrentYearMatches,
  getMatchesByMonth,
} from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

type DataContextType = {
  players: Player[];
  matches: Match[];
  matchesWithPlayers: MatchWithPlayers[];
  addNewPlayer: (name: string) => Player;
  updateExistingPlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  addNewMatch: (match: Omit<Match, 'id'>) => Match;
  updateExistingMatch: (match: Match) => void;
  removeMatch: (id: string) => void;
  getPlayerStats: (playerId: string) => PlayerStats | null;
  getAllPlayersStats: () => PlayerStats[];
  getMonthlyMatches: () => Match[];
  getYearlyMatches: () => Match[];
  getPlayerById: (id: string) => Player | undefined;
  getMatchesByMonthForYear: (year: number) => Record<number, Match[]>;
  refreshData: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const refreshData = () => {
    setPlayers(getPlayers());
    setMatches(getMatches());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Combine matches with player data
  const matchesWithPlayers: MatchWithPlayers[] = matches.map(match => {
    const playerOne = players.find(p => p.id === match.playerOneId);
    const playerTwo = players.find(p => p.id === match.playerTwoId);
    
    return {
      ...match,
      playerOne: playerOne || { id: 'unknown', name: 'Unknown Player', createdAt: new Date() },
      playerTwo: playerTwo || { id: 'unknown', name: 'Unknown Player', createdAt: new Date() }
    };
  });

  const addNewPlayer = (name: string) => {
    try {
      const player = addPlayer(name);
      refreshData();
      toast({
        title: "Player Added",
        description: `${name} has been added successfully.`
      });
      return player;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add player.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateExistingPlayer = (player: Player) => {
    try {
      updatePlayer(player);
      refreshData();
      toast({
        title: "Player Updated",
        description: `${player.name} has been updated.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update player.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removePlayer = (id: string) => {
    try {
      const playerToDelete = players.find(p => p.id === id);
      if (playerToDelete) {
        deletePlayer(id);
        refreshData();
        toast({
          title: "Player Deleted",
          description: `${playerToDelete.name} has been removed.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete player.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addNewMatch = (match: Omit<Match, 'id'>) => {
    try {
      const newMatch = addMatch(match);
      refreshData();
      toast({
        title: "Match Added",
        description: "Match has been recorded successfully."
      });
      return newMatch;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add match.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateExistingMatch = (match: Match) => {
    try {
      updateMatch(match);
      refreshData();
      toast({
        title: "Match Updated",
        description: "Match has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update match.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeMatch = (id: string) => {
    try {
      deleteMatch(id);
      refreshData();
      toast({
        title: "Match Deleted",
        description: "Match has been removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete match.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getPlayerStats = (playerId: string) => {
    return calculatePlayerStats(playerId);
  };

  const getAllPlayersStats = () => {
    return calculateAllPlayersStats();
  };

  const getMonthlyMatches = () => {
    return getCurrentMonthMatches();
  };

  const getYearlyMatches = () => {
    return getCurrentYearMatches();
  };

  const getPlayerById = (id: string) => {
    return players.find(player => player.id === id);
  };

  const getMatchesByMonthForYear = (year: number) => {
    return getMatchesByMonth(year);
  };

  const value = {
    players,
    matches,
    matchesWithPlayers,
    addNewPlayer,
    updateExistingPlayer,
    removePlayer,
    addNewMatch,
    updateExistingMatch,
    removeMatch,
    getPlayerStats,
    getAllPlayersStats,
    getMonthlyMatches,
    getYearlyMatches,
    getPlayerById,
    getMatchesByMonthForYear,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
