
import { useState } from "react";
import { Users, UserCheck, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";

const ProjectTeamAssignment = () => {
  const { getAllProjectsWithStatus, assignProjectToTeam } = useWorkflow();
  const { toast } = useToast();

  const allProjects = getAllProjectsWithStatus();

  const handleTeamAssignment = (projectId: string, teamRole: string) => {
    assignProjectToTeam(projectId, teamRole);
    
    const project = allProjects.find(p => p.id === projectId);
    toast({
      title: "Project Assigned",
      description: `${project?.name} has been assigned to ${getTeamLabel(teamRole)} team`,
    });
  };

  const getTeamLabel = (teamRole: string): string => {
    const labels: Record<string, string> = {
      "business-analyst": "Business Analyst",
      "designer": "UI/UX Designer",
      "developer": "Developer",
      "qa-engineer": "QA Engineer"
    };
    return labels[teamRole] || teamRole;
  };

  const getTeamColor = (teamRole: string | undefined) => {
    const colors: Record<string, string> = {
      "business-analyst": "bg-blue-100 text-blue-800 border-blue-200",
      "designer": "bg-purple-100 text-purple-800 border-purple-200",
      "developer": "bg-green-100 text-green-800 border-green-200",
      "qa-engineer": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[teamRole || ""] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getAssignmentIcon = (assignedTeam: string | undefined) => {
    if (assignedTeam) {
      return <UserCheck className="h-4 w-4 text-green-600" />;
    }
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const teamOptions = [
    { value: "business-analyst", label: "Business Analyst Team" },
    { value: "designer", label: "UI/UX Designer Team" },
    { value: "developer", label: "Developer Team" },
    { value: "qa-engineer", label: "QA Engineer Team" },
  ];

  return (
    <Card className="w-full bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-200">
          <Users className="mr-2 h-5 w-5" />
          Project Team Assignment ({allProjects.length} projects)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {allProjects.length > 0 ? (
          <div className="space-y-4">
            {allProjects.map((project) => (
              <div key={project.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-200">{project.name}</h4>
                      <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                        {project.currentStage}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="flex items-center space-x-2">
                      {getAssignmentIcon(project.assignedTeam)}
                      {project.assignedTeam ? (
                        <Badge className={getTeamColor(project.assignedTeam)}>
                          {getTeamLabel(project.assignedTeam)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-500">
                          Unassigned
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select
                        value={project.assignedTeam || ""}
                        onValueChange={(value) => handleTeamAssignment(project.id, value)}
                      >
                        <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Assign to team..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {teamOptions.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className="text-gray-200 focus:bg-gray-700"
                            >
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
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400">No projects available for assignment.</p>
            <p className="text-sm text-gray-500 mt-2">
              Create projects to start assigning them to teams.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTeamAssignment;
