
import { useState } from "react";
import { Users, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserStoryAssignment = () => {
  const { getUserStories, assignArtifactToUser } = useWorkflow();
  const { toast } = useToast();
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("");

  const userStories = getUserStories();

  // Mock developers - in a real app, this would come from user management
  const developers = [
    { id: "dev1", name: "Alice Johnson", email: "alice@company.com" },
    { id: "dev2", name: "Bob Smith", email: "bob@company.com" },
    { id: "dev3", name: "Carol Davis", email: "carol@company.com" },
    { id: "dev4", name: "David Wilson", email: "david@company.com" },
  ];

  const handleAssignment = (storyId: string, developerId: string) => {
    const developer = developers.find(dev => dev.id === developerId);
    if (!developer) return;

    assignArtifactToUser(storyId, developerId);
    
    toast({
      title: "User Story Assigned",
      description: `Story assigned to ${developer.name}`,
    });
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "assigned":
        return <Badge variant="secondary">Assigned</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unassigned</Badge>;
    }
  };

  const getDeveloperName = (developerId: string | undefined) => {
    if (!developerId) return "Unassigned";
    const developer = developers.find(dev => dev.id === developerId);
    return developer?.name || "Unknown Developer";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          User Story Assignments ({userStories.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {userStories.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Story</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{story.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{story.content}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(story.status)}
                        {getStatusBadge(story.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getDeveloperName(story.assignedTo)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={selectedDeveloper}
                          onValueChange={(value) => setSelectedDeveloper(value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select developer" />
                          </SelectTrigger>
                          <SelectContent>
                            {developers.map((developer) => (
                              <SelectItem key={developer.id} value={developer.id}>
                                {developer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleAssignment(story.id, selectedDeveloper)}
                          disabled={!selectedDeveloper}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Assign
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No user stories available for assignment. Create user stories in the Requirements phase first.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStoryAssignment;
