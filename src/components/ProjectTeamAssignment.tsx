
import { useState } from "react";
import { Users, UserCheck, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";

const ProjectTeamAssignment = () => {
  const { getAllProjectsWithStatus, assignProjectToTeams } = useWorkflow();
  const { toast } = useToast();

  const allProjects = getAllProjectsWithStatus();

  const handleTeamAssignment = (projectId: string, teamRole: string, isChecked: boolean) => {
    const project = allProjects.find(p => p.id === projectId);
    const currentTeams = project?.assignedTeams || [];
    
    let newTeams: string[];
    if (isChecked) {
      newTeams = [...currentTeams, teamRole];
    } else {
      newTeams = currentTeams.filter(team => team !== teamRole);
    }
    
    assignProjectToTeams(projectId, newTeams);
    
    toast({
      title: "Project Assignment Updated",
      description: `${project?.name} team assignments have been updated`,
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

  const getTeamColor = (teamRole: string) => {
    const colors: Record<string, string> = {
      "business-analyst": "bg-blue-100 text-blue-800 border-blue-200",
      "designer": "bg-purple-100 text-purple-800 border-purple-200",
      "developer": "bg-green-100 text-green-800 border-green-200",
      "qa-engineer": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[teamRole] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getAssignmentIcon = (assignedTeams: string[] | undefined) => {
    if (assignedTeams && assignedTeams.length > 0) {
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
                      {getAssignmentIcon(project.assignedTeams)}
                      {project.assignedTeams && project.assignedTeams.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {project.assignedTeams.map((team) => (
                            <Badge key={team} className={getTeamColor(team)}>
                              {getTeamLabel(team)}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-500">
                          Unassigned
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600"
                          >
                            Assign Teams
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-600 w-64">
                          {teamOptions.map((option) => (
                            <DropdownMenuItem 
                              key={option.value} 
                              className="text-gray-200 focus:bg-gray-700"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <Checkbox
                                  id={`${project.id}-${option.value}`}
                                  checked={project.assignedTeams?.includes(option.value) || false}
                                  onCheckedChange={(checked) => 
                                    handleTeamAssignment(project.id, option.value, checked as boolean)
                                  }
                                  className="border-gray-400"
                                />
                                <label 
                                  htmlFor={`${project.id}-${option.value}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                >
                                  {option.label}
                                </label>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
