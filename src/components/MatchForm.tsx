
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TimerDuration } from "@/types";
import { Timer } from "lucide-react";
import MatchTimer from "./MatchTimer";

interface MatchFormProps {
  onMatchComplete?: () => void;
}

const MatchForm = ({ onMatchComplete }: MatchFormProps) => {
  const { players, addNewMatch } = useData();
  const [playerOneId, setPlayerOneId] = useState("");
  const [playerTwoId, setPlayerTwoId] = useState("");
  const [playerOneScore, setPlayerOneScore] = useState<number>(0);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);
  const [duration, setDuration] = useState<TimerDuration>(10);
  const [activeTab, setActiveTab] = useState<"setup" | "tracking">("setup");
  const [isMatchActive, setIsMatchActive] = useState(false);

  const handleDurationChange = (value: string) => {
    setDuration(Number(value) as TimerDuration);
  };

  const handleStartMatch = () => {
    if (!playerOneId || !playerTwoId) return;
    
    // Create a new match
    addNewMatch({
      playerOneId,
      playerTwoId,
      playerOneScore: 0,
      playerTwoScore: 0,
      duration,
      date: new Date(),
      complete: false,
    });
    
    setIsMatchActive(true);
    setActiveTab("tracking");
  };

  const handleMatchComplete = () => {
    if (!isMatchActive) return;
    
    // Save the final match result
    addNewMatch({
      playerOneId,
      playerTwoId,
      playerOneScore,
      playerTwoScore,
      duration,
      date: new Date(),
      complete: true,
    });
    
    // Reset the form
    resetForm();
    
    if (onMatchComplete) {
      onMatchComplete();
    }
  };

  const resetForm = () => {
    setPlayerOneId("");
    setPlayerTwoId("");
    setPlayerOneScore(0);
    setPlayerTwoScore(0);
    setDuration(10);
    setIsMatchActive(false);
    setActiveTab("setup");
  };

  // Get player names for display
  const playerOneName = players.find(p => p.id === playerOneId)?.name || "Player 1";
  const playerTwoName = players.find(p => p.id === playerTwoId)?.name || "Player 2";

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "setup" | "tracking")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup" disabled={isMatchActive}>Setup</TabsTrigger>
          <TabsTrigger value="tracking" disabled={!isMatchActive}>Match Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="player-one">Player 1</Label>
              <Select 
                value={playerOneId} 
                onValueChange={setPlayerOneId}
                disabled={isMatchActive}
              >
                <SelectTrigger id="player-one">
                  <SelectValue placeholder="Select player 1" />
                </SelectTrigger>
                <SelectContent>
                  {players
                    .filter(p => p.id !== playerTwoId)
                    .map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="player-two">Player 2</Label>
              <Select 
                value={playerTwoId} 
                onValueChange={setPlayerTwoId}
                disabled={isMatchActive}
              >
                <SelectTrigger id="player-two">
                  <SelectValue placeholder="Select player 2" />
                </SelectTrigger>
                <SelectContent>
                  {players
                    .filter(p => p.id !== playerOneId)
                    .map(player => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Match Duration (minutes)</Label>
            <Select 
              value={duration.toString()} 
              onValueChange={handleDurationChange}
              disabled={isMatchActive}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 minutes</SelectItem>
                <SelectItem value="8">8 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="11">11 minutes</SelectItem>
                <SelectItem value="12">12 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleStartMatch} 
            className="w-full"
            disabled={!playerOneId || !playerTwoId || playerOneId === playerTwoId}
          >
            <Timer className="mr-2 h-4 w-4" />
            Start Match
          </Button>
        </TabsContent>
        
        <TabsContent value="tracking" className="space-y-4">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="text-center w-1/3">
              <div className="text-lg font-semibold mb-2">{playerOneName}</div>
              <div className="flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPlayerOneScore(Math.max(0, playerOneScore - 1))}
                  disabled={playerOneScore <= 0}
                >
                  -
                </Button>
                <div className="mx-4 text-3xl font-bold">{playerOneScore}</div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPlayerOneScore(playerOneScore + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="text-center text-2xl font-bold">vs</div>
            
            <div className="text-center w-1/3">
              <div className="text-lg font-semibold mb-2">{playerTwoName}</div>
              <div className="flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPlayerTwoScore(Math.max(0, playerTwoScore - 1))}
                  disabled={playerTwoScore <= 0}
                >
                  -
                </Button>
                <div className="mx-4 text-3xl font-bold">{playerTwoScore}</div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPlayerTwoScore(playerTwoScore + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-muted/20">
            <MatchTimer 
              duration={duration} 
              onComplete={handleMatchComplete} 
            />
          </div>
          
          <div className="flex justify-between space-x-4">
            <Button 
              variant="outline"
              onClick={resetForm}
              className="flex-1"
            >
              Cancel Match
            </Button>
            <Button 
              onClick={handleMatchComplete}
              className="flex-1"
            >
              End Match & Save
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchForm;
