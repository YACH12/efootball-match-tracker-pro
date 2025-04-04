
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerForm from "@/components/PlayerForm";
import PlayersList from "@/components/PlayersList";

const Players = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  
  const handlePlayerAdded = () => {
    setActiveTab("list");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Players List</TabsTrigger>
          <TabsTrigger value="add">Add Player</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>
                Manage your player roster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayersList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Player</CardTitle>
              <CardDescription>
                Add a new player to your roster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerForm onSuccess={handlePlayerAdded} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Players;
