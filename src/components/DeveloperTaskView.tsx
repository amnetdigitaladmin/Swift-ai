
import { useState } from "react";
import { Code, Clock, CheckCircle, AlertCircle, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

const DeveloperTaskView = () => {
  const { user } = useUser();
  const { getAssignedArtifacts, updateArtifactStatus } = useWorkflow();
  const { toast } = useToast();
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");

  // Get artifacts assigned to current user (using username as identifier)
  const assignedTasks = getAssignedArtifacts(user?.username || "");

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    updateArtifactStatus(taskId, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Task status updated to ${newStatus}`,
    });
  };

  const handleStorySelection = (storyId: string) => {
    setSelectedStoryId(storyId);
    toast({
      title: "User Story Selected",
      description: "You can now work on this user story",
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
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const statusOptions = [
    { value: "assigned", label: "Assigned" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const selectedStory = assignedTasks.find(task => task.id === selectedStoryId);

  return (
    <div className="space-y-6">
      {/* Story Selector */}
      {assignedTasks.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Select User Story to Work On
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select value={selectedStoryId} onValueChange={handleStorySelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user story to work on..." />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <span>{task.title}</span>
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
                    onValueChange={(value) => handleStatusUpdate(selectedStory.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Tasks List */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" />
            My Assigned Tasks ({assignedTasks.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {assignedTasks.length > 0 ? (
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    task.id === selectedStoryId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {task.type}
                        </span>
                        {task.id === selectedStoryId && (
                          <Badge className="bg-blue-100 text-blue-800">Currently Working</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.content}</p>
                      <div className="text-xs text-gray-400">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        {getStatusBadge(task.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select
                          value={task.status || "assigned"}
                          onValueChange={(value) => handleStatusUpdate(task.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No tasks assigned to you yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Check back later or contact your project manager.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperTaskView;
