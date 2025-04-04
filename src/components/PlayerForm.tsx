
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface PlayerFormProps {
  onSuccess?: () => void;
}

const PlayerForm = ({ onSuccess }: PlayerFormProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNewPlayer } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addNewPlayer(name);
      setName("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding player:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="player-name">Player Name</Label>
        <Input
          id="player-name"
          placeholder="Enter player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !name.trim()}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Player
      </Button>
    </form>
  );
};

export default PlayerForm;
