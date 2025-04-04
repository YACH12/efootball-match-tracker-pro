
import { useState } from "react";
import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchForm from "@/components/MatchForm";
import MatchesList from "@/components/MatchesList";
import { PlusCircle } from "lucide-react";

const Matches = () => {
  const [activeTab, setActiveTab] = useState<string>("matches");
  
  const handleMatchComplete = () => {
    setActiveTab("matches");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="matches">Match History</TabsTrigger>
            <TabsTrigger value="new">New Match</TabsTrigger>
          </TabsList>
          {activeTab === "matches" && (
            <Button onClick={() => setActiveTab("new")} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Match
            </Button>
          )}
        </div>
        
        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
              <CardDescription>
                View all your recorded matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchesList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Match</CardTitle>
              <CardDescription>
                Set up and track a new match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchForm onMatchComplete={handleMatchComplete} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
