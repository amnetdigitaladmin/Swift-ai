
import { useState } from "react";
import { Code, Clock, CheckCircle, AlertCircle, User } from "lucide-react";
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

  // Get artifacts assigned to current user (using username as identifier)
  const assignedTasks = getAssignedArtifacts(user?.username || "");

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    updateArtifactStatus(taskId, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Task status updated to ${newStatus}`,
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

  return (
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
              <div key={task.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {task.type}
                      </span>
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
  );
};

export default DeveloperTaskView;
