
import { useState } from "react";
import { Plus, FolderOpen, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface ProjectSelectorProps {
  onProjectSelected: () => void;
}

const ProjectSelector = ({ onProjectSelected }: ProjectSelectorProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const { createProject, selectProject, getProjectsByRole, currentProject } = useWorkflow();
  const { user } = useUser();
  const { toast } = useToast();

  const userProjects = user ? getProjectsByRole(user.persona) : [];

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !user) return;

    const project = createProject(newProjectName, newProjectDescription, user.persona);
    selectProject(project);
    setIsCreateDialogOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
    onProjectSelected();
    
    toast({
      title: "Project Created",
      description: `${newProjectName} has been created successfully.`,
    });
  };

  const handleSelectProject = (project: any) => {
    selectProject(project);
    onProjectSelected();
    toast({
      title: "Project Selected",
      description: `Now working on ${project.name}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "business-analyst": "bg-blue-100 text-blue-800",
      "designer": "bg-purple-100 text-purple-800",
      "developer": "bg-green-100 text-green-800",
      "qa-engineer": "bg-red-100 text-red-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (currentProject) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{currentProject.name}</h3>
            <p className="text-gray-600 text-sm">{currentProject.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getRoleColor(currentProject.role)}>
                {currentProject.role.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Created {formatDate(currentProject.createdAt)}
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => selectProject(null as any)}
            size="sm"
          >
            Switch Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select or Create a Project</h2>
        <p className="text-gray-600">Choose an existing project or create a new one to get started</p>
      </div>

      <div className="flex justify-center">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                >
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {userProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />
            Your Projects ({user?.persona.replace('-', ' ')})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectProject(project)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getRoleColor(project.role)}>
                      <User className="h-3 w-3 mr-1" />
                      {project.role.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
