
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, AlertCircle, CheckCircle, User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";

interface UserStorySectionProps {
  selectedStoryId: string;
  onStorySelection: (storyId: string) => void;
  onStatusUpdate: (storyId: string, newStatus: string) => void;
}

const UserStorySection = ({ selectedStoryId, onStorySelection, onStatusUpdate }: UserStorySectionProps) => {
  const { user } = useUser();
  const { currentProject, getAssignedArtifacts } = useWorkflow();

  const assignedStories = currentProject 
    ? getAssignedArtifacts(user?.username || "").filter(task => 
        task.projectId === currentProject.id && task.type === "User Story"
      )
    : [];

  const selectedStory = assignedStories.find(story => story.id === selectedStoryId);

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
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (assignedStories.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Select User Story to Work On
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select value={selectedStoryId} onValueChange={onStorySelection}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user story to work on..." />
              </SelectTrigger>
              <SelectContent>
                {assignedStories.map((story) => (
                  <SelectItem key={story.id} value={story.id}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(story.status)}
                      <span>{story.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedStory && (
            <div className="flex items-center space-x-2">
              {getStatusIcon(selectedStory.status)}
              {getStatusBadge(selectedStory.status)}
            </div>
          )}
        </div>
        
        {selectedStory && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
            <h4 className="font-medium text-blue-900 mb-2">Currently Working On:</h4>
            <h5 className="font-semibold">{selectedStory.title}</h5>
            <p className="text-sm text-gray-600 mt-1">{selectedStory.content}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                Created: {new Date(selectedStory.createdAt).toLocaleDateString()}
              </span>
              <Select
                value={selectedStory.status || "assigned"}
                onValueChange={(value) => onStatusUpdate(selectedStory.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStorySection;
