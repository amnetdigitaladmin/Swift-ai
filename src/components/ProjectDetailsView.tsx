
import { useState } from "react";
import { ArrowLeft, Users, FileText, UserCheck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailsViewProps {
  project: any;
  onBack: () => void;
}

const ProjectDetailsView = ({ project, onBack }: ProjectDetailsViewProps) => {
  const { assignProjectToTeams, getUserStories, assignArtifactToUser } = useWorkflow();
  const { toast } = useToast();
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("");

  // Get user stories for this specific project
  const projectUserStories = getUserStories().filter(story => story.projectId === project.id);

  // Mock developers - in a real app, this would come from user management
  const developers = [
    { id: "dev1", name: "Alice Johnson", email: "alice@company.com" },
    { id: "dev2", name: "Bob Smith", email: "bob@company.com" },
    { id: "dev3", name: "Carol Davis", email: "carol@company.com" },
    { id: "dev4", name: "David Wilson", email: "david@company.com" },
  ];

  const teamOptions = [
    { value: "business-analyst", label: "Business Analyst Team" },
    { value: "designer", label: "UI/UX Designer Team" },
    { value: "developer", label: "Developer Team" },
    { value: "qa-engineer", label: "QA Engineer Team" },
  ];

  const handleTeamAssignment = (teamRole: string, isChecked: boolean) => {
    const currentTeams = project.assignedTeams || [];
    
    let newTeams: string[];
    if (isChecked) {
      newTeams = [...currentTeams, teamRole];
    } else {
      newTeams = currentTeams.filter(team => team !== teamRole);
    }
    
    assignProjectToTeams(project.id, newTeams);
    
    toast({
      title: "Team Assignment Updated",
      description: `${project.name} team assignments have been updated`,
    });
  };

  const handleUserStoryAssignment = (storyId: string, developerId: string) => {
    const developer = developers.find(dev => dev.id === developerId);
    if (!developer) return;

    assignArtifactToUser(storyId, developerId);
    
    toast({
      title: "User Story Assigned",
      description: `Story assigned to ${developer.name}`,
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

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-gray-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-200">{project.name}</h2>
          <p className="text-gray-400">{project.description}</p>
        </div>
      </div>

      {/* Project Info */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-400">Current Stage</span>
              <p className="text-cyan-400 font-medium">{project.currentStage}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Created</span>
              <p className="text-gray-200">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Last Activity</span>
              <p className="text-gray-200">
                {project.lastActivity ? new Date(project.lastActivity).toLocaleDateString() : "No activity"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Assignment */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-200">
            <Users className="mr-2 h-5 w-5" />
            Team Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.assignedTeams && project.assignedTeams.length > 0 ? (
                project.assignedTeams.map((team: string) => (
                  <Badge key={team} className={getTeamColor(team)}>
                    {getTeamLabel(team)}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-gray-400 border-gray-500">
                  No teams assigned
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
                  <Checkbox
                    id={`team-${option.value}`}
                    checked={project.assignedTeams?.includes(option.value) || false}
                    onCheckedChange={(checked) => 
                      handleTeamAssignment(option.value, checked as boolean)
                    }
                    className="border-gray-400"
                  />
                  <label 
                    htmlFor={`team-${option.value}`}
                    className="text-sm font-medium text-gray-200 cursor-pointer flex-1"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stories */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-200">
            <FileText className="mr-2 h-5 w-5" />
            User Stories ({projectUserStories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projectUserStories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead className="text-gray-300">Story</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Assigned To</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectUserStories.map((story) => (
                  <TableRow key={story.id} className="border-gray-600">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-200">{story.title}</div>
                        <div className="text-sm text-gray-400 line-clamp-2">{story.content}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(story.status)}
                        {getStatusBadge(story.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-300">
                        {getDeveloperName(story.assignedTo)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={selectedDeveloper}
                          onValueChange={(value) => setSelectedDeveloper(value)}
                        >
                          <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-200">
                            <SelectValue placeholder="Select developer" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {developers.map((developer) => (
                              <SelectItem key={developer.id} value={developer.id} className="text-gray-200 focus:bg-gray-700">
                                {developer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleUserStoryAssignment(story.id, selectedDeveloper)}
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
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">No user stories available for this project.</p>
              <p className="text-sm text-gray-500 mt-2">
                User stories will appear here once created by the Business Analyst team.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailsView;
