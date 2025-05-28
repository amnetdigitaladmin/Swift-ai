
import { useState } from "react";
import { Users, UserCheck, Clock, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkflow } from "@/contexts/WorkflowContext";
import ProjectDetailsView from "@/components/ProjectDetailsView";

const ProjectTeamAssignment = () => {
  const { getAllProjectsWithStatus } = useWorkflow();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const allProjects = getAllProjectsWithStatus();

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

  // If a project is selected, show the detailed view
  if (selectedProject) {
    return (
      <Card className="w-full bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <ProjectDetailsView 
            project={selectedProject} 
            onBack={() => setSelectedProject(null)} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-200">
          <Users className="mr-2 h-5 w-5" />
          Project Team Management ({allProjects.length} projects)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {allProjects.length > 0 ? (
          <div className="space-y-4">
            {allProjects.map((project) => (
              <div key={project.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700/30">
                <div className="flex items-start justify-between">
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
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                      className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400">No projects available for management.</p>
            <p className="text-sm text-gray-500 mt-2">
              Create projects to start managing team assignments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTeamAssignment;
