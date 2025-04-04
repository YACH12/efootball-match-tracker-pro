
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Award, BarChart3 } from "lucide-react";
import { PlayerStats } from "@/types";

type StatsPeriod = "all" | "month" | "year";

const StatsOverview = () => {
  const { getAllPlayersStats } = useData();
  const [period, setPeriod] = useState<StatsPeriod>("all");
  
  const allStats = getAllPlayersStats();
  
  // Sort by win percentage
  const sortedStats = [...allStats].sort((a, b) => b.winPercentage - a.winPercentage);

  // Calculate top scorer (most goals)
  const topScorer = [...allStats].sort((a, b) => b.goalsScored - a.goalsScored)[0];
  
  // Calculate most active player (most matches)
  const mostActivePlayer = [...allStats].sort((a, b) => b.matchesPlayed - a.matchesPlayed)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Statistics</h2>
        <Select value={period} onValueChange={(value) => setPeriod(value as StatsPeriod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Player</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {sortedStats.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{sortedStats[0]?.playerName}</div>
                <p className="text-xs text-muted-foreground">
                  Win rate: {sortedStats[0]?.winPercentage.toFixed(1)}%
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Scorer</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {topScorer ? (
              <>
                <div className="text-2xl font-bold">{topScorer.playerName}</div>
                <p className="text-xs text-muted-foreground">
                  {topScorer.goalsScored} goals in {topScorer.matchesPlayed} matches
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {mostActivePlayer ? (
              <>
                <div className="text-2xl font-bold">{mostActivePlayer.playerName}</div>
                <p className="text-xs text-muted-foreground">
                  {mostActivePlayer.matchesPlayed} matches played
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Rankings</CardTitle>
          <CardDescription>
            Based on win percentage across {period === "all" ? "all time" : period === "month" ? "this month" : "this year"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Played</TableHead>
                  <TableHead>W</TableHead>
                  <TableHead>D</TableHead>
                  <TableHead>L</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStats.map((stats, index) => (
                  <TableRow key={stats.playerId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{stats.playerName}</TableCell>
                    <TableCell>{stats.matchesPlayed}</TableCell>
                    <TableCell>{stats.wins}</TableCell>
                    <TableCell>{stats.draws}</TableCell>
                    <TableCell>{stats.losses}</TableCell>
                    <TableCell>{stats.goalsScored}</TableCell>
                    <TableCell>{stats.winPercentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No player statistics available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
