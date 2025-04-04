
import { Link } from "react-router-dom";
import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MatchForm from "@/components/MatchForm";
import StatsOverview from "@/components/StatsOverview";
import { Timer, Users, CheckSquare, BarChart3, TrophyIcon, ShieldXIcon } from "lucide-react";

const Dashboard = () => {
  const { matches, players, matchesWithPlayers } = useData();
  
  // Calculate some quick stats
  const totalMatches = matches.length;
  const totalPlayers = players.length;
  const completedMatches = matches.filter(match => match.complete).length;
  
  // Find the latest match
  const latestMatch = matchesWithPlayers.length > 0
    ? matchesWithPlayers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
    
  // Calculate who's winning between players
  const calculateWinner = (match: typeof matchesWithPlayers[0]) => {
    if (match.playerOneScore > match.playerTwoScore) {
      return match.playerOne.name;
    } else if (match.playerOneScore < match.playerTwoScore) {
      return match.playerTwo.name;
    } else {
      return "Draw";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedMatches} completed
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/matches">View all matches</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPlayers > 0 ? "Ready to play" : "Add players to get started"}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/players">Manage players</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Match</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestMatch ? (
              <>
                <div className="text-md font-medium">
                  {latestMatch.playerOne.name} vs {latestMatch.playerTwo.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {latestMatch.playerOneScore} - {latestMatch.playerTwoScore} • {latestMatch.complete ? calculateWinner(latestMatch) : "In progress"}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No matches yet</div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/matches">View matches</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statistics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {completedMatches > 0 ? (
                "View detailed player stats"
              ) : (
                "Complete matches to see stats"
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/statistics">View statistics</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Match</CardTitle>
            <CardDescription>Set up and start tracking a new match</CardDescription>
          </CardHeader>
          <CardContent>
            <MatchForm />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Key statistics from recent matches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {completedMatches > 0 ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    <div className="text-sm font-medium">Recent Victories</div>
                  </div>
                  <div className="space-y-2">
                    {matchesWithPlayers
                      .filter(m => m.complete)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 3)
                      .map(match => (
                        <div key={match.id} className="flex justify-between items-center text-sm">
                          <div>
                            {match.playerOneScore > match.playerTwoScore ? (
                              <span className="font-medium">{match.playerOne.name}</span>
                            ) : match.playerTwoScore > match.playerOneScore ? (
                              <span className="font-medium">{match.playerTwo.name}</span>
                            ) : (
                              <span className="font-medium">Draw</span>
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {match.playerOneScore}-{match.playerTwoScore}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ShieldXIcon className="h-5 w-5 mr-2 text-red-500" />
                    <div className="text-sm font-medium">Highest Scoring</div>
                  </div>
                  <div className="space-y-2">
                    {matchesWithPlayers
                      .filter(m => m.complete)
                      .sort((a, b) => (b.playerOneScore + b.playerTwoScore) - (a.playerOneScore + a.playerTwoScore))
                      .slice(0, 3)
                      .map(match => (
                        <div key={match.id} className="flex justify-between items-center text-sm">
                          <div>
                            {match.playerOne.name} vs {match.playerTwo.name}
                          </div>
                          <div className="text-muted-foreground">
                            {match.playerOneScore + match.playerTwoScore} goals
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mb-2 opacity-20" />
                <p>Complete matches to see statistics</p>
                <Button asChild variant="link" className="mt-2">
                  <Link to="/matches">Go to Matches</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {completedMatches > 0 && (
        <StatsOverview />
      )}
    </div>
  );
};

export default Dashboard;
