
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatsOverview from "@/components/StatsOverview";
import { Search, Filter } from "lucide-react";

const Statistics = () => {
  const { players, getPlayerStats } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
      </div>

      <StatsOverview />

      <Card>
        <CardHeader>
          <CardTitle>Individual Player Statistics</CardTitle>
          <CardDescription>
            Detailed statistics for each player
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Players</SelectItem>
                  <SelectItem value="active">Most Active</SelectItem>
                  <SelectItem value="winning">Highest Win %</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Matches</TableHead>
                  <TableHead>Wins</TableHead>
                  <TableHead>Draws</TableHead>
                  <TableHead>Losses</TableHead>
                  <TableHead>Goals Scored</TableHead>
                  <TableHead>Goals Conceded</TableHead>
                  <TableHead>Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => {
                  const stats = getPlayerStats(player.id);
                  
                  if (!stats) return null;
                  
                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{stats.matchesPlayed}</TableCell>
                      <TableCell>{stats.wins}</TableCell>
                      <TableCell>{stats.draws}</TableCell>
                      <TableCell>{stats.losses}</TableCell>
                      <TableCell>{stats.goalsScored}</TableCell>
                      <TableCell>{stats.goalsConceded}</TableCell>
                      <TableCell>{stats.winPercentage.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
                
                {filteredPlayers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No players found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
