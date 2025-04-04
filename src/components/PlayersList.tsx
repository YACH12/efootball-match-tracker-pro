
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Edit, Trash2, UserRoundX } from "lucide-react";

const PlayersList = () => {
  const { players, updateExistingPlayer, removePlayer } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState("");

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Start editing a player
  const handleEdit = (id: string, name: string) => {
    setEditingPlayer({ id, name });
    setNewName(name);
  };

  // Save edited player
  const handleSave = () => {
    if (editingPlayer && newName.trim()) {
      const playerToUpdate = players.find(p => p.id === editingPlayer.id);
      if (playerToUpdate) {
        updateExistingPlayer({
          ...playerToUpdate,
          name: newName
        });
        setEditingPlayer(null);
        setNewName("");
      }
    }
  };

  // Delete player
  const handleDelete = (id: string) => {
    removePlayer(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <UserRoundX className="h-16 w-16 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No players found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {players.length === 0 
              ? "Add your first player to get started" 
              : "Try a different search term"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="outline" onClick={() => handleEdit(player.id, player.name)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Player</DialogTitle>
                            <DialogDescription>
                              Update the player's name below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                autoFocus
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSave} type="submit">Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Player</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {player.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(player.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PlayersList;
