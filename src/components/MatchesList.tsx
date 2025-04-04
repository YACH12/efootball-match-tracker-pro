
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { format } from "date-fns";
import { Search, MoreVertical, Trash2, Calendar } from "lucide-react";

const MatchesList = () => {
  const { matchesWithPlayers, removeMatch } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  // Sort matches by date (newest first)
  const sortedMatches = [...matchesWithPlayers].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter matches based on search term
  const filteredMatches = sortedMatches.filter(
    match =>
      match.playerOne.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.playerTwo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete match
  const handleDelete = (id: string) => {
    removeMatch(id);
  };

  // Get match result as string
  const getMatchResult = (match: typeof matchesWithPlayers[0]) => {
    if (match.playerOneScore > match.playerTwoScore) {
      return `${match.playerOne.name} won`;
    } else if (match.playerOneScore < match.playerTwoScore) {
      return `${match.playerTwo.name} won`;
    } else {
      return "Draw";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No matches found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {matchesWithPlayers.length === 0 
              ? "Record your first match to get started" 
              : "Try a different search term"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(match.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {match.playerOne.name} vs {match.playerTwo.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {match.playerOneScore} - {match.playerTwoScore}
                  </TableCell>
                  <TableCell>
                    {match.duration} min
                  </TableCell>
                  <TableCell>
                    <span className={match.complete ? "" : "text-muted-foreground italic"}>
                      {match.complete ? getMatchResult(match) : "In progress"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Match</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this match? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(match.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default MatchesList;
