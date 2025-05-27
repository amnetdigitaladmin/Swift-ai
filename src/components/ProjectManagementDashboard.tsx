import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Filter, Search, User, TrendingUp, Plus } from "lucide-react";

const ProjectManagementDashboard = () => {
  const { getAllProjectsWithStatus, createProject, selectProject } = useWorkflow();
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const allProjects = getAllProjectsWithStatus();

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !user) return;

    const project = createProject(newProjectName, newProjectDescription, user.persona);
    selectProject(project);
    setIsCreateDialogOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
    
    toast({
      title: "Project Created",
      description: `${newProjectName} has been created successfully.`,
    });
  };

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.currentStage === statusFilter;
    const matchesRole = roleFilter === "all" || project.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "requirements": "bg-blue-100 text-blue-800 border-blue-200",
      "design": "bg-purple-100 text-purple-800 border-purple-200",
      "development": "bg-green-100 text-green-800 border-green-200",
      "testing": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[stage] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "business-analyst": "bg-blue-50 text-blue-700",
      "designer": "bg-purple-50 text-purple-700",
      "developer": "bg-green-50 text-green-700",
      "qa-engineer": "bg-red-50 text-red-700"
    };
    return colors[role] || "bg-gray-50 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const stageStats = {
    requirements: allProjects.filter(p => p.currentStage === "requirements").length,
    design: allProjects.filter(p => p.currentStage === "design").length,
    development: allProjects.filter(p => p.currentStage === "development").length,
    testing: allProjects.filter(p => p.currentStage === "testing").length,
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Project Management Dashboard
          </h1>
          <p className="text-gray-300 mt-2">
            Overview of all projects and their current stages
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Total Projects: {allProjects.length}</span>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-200">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-200">Project Name</label>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Description</label>
                  <Textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe your project..."
                    rows={3}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-gray-600 text-gray-200 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-200">Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stageStats.requirements}</div>
            <p className="text-xs text-gray-400 mt-1">Active projects</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-200">Design</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stageStats.design}</div>
            <p className="text-xs text-gray-400 mt-1">Active projects</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-200">Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stageStats.development}</div>
            <p className="text-xs text-gray-400 mt-1">Active projects</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-200">Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stageStats.testing}</div>
            <p className="text-xs text-gray-400 mt-1">Active projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-200">All Stages</SelectItem>
                  <SelectItem value="requirements" className="text-gray-200">Requirements</SelectItem>
                  <SelectItem value="design" className="text-gray-200">Design</SelectItem>
                  <SelectItem value="development" className="text-gray-200">Development</SelectItem>
                  <SelectItem value="testing" className="text-gray-200">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-200">All Roles</SelectItem>
                  <SelectItem value="business-analyst" className="text-gray-200">Business Analyst</SelectItem>
                  <SelectItem value="designer" className="text-gray-200">Designer</SelectItem>
                  <SelectItem value="developer" className="text-gray-200">Developer</SelectItem>
                  <SelectItem value="qa-engineer" className="text-gray-200">QA Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">All Projects</CardTitle>
          <CardDescription className="text-gray-400">
            Detailed view of all projects and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Project Name</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Current Stage</TableHead>
                <TableHead className="text-gray-300">Assigned Role</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="border-gray-700">
                  <TableCell className="font-medium text-gray-200">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">
                    {project.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(project.currentStage || "requirements")}>
                      {project.currentStage?.replace('-', ' ') || "Requirements"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(project.role)} variant="outline">
                      <User className="h-3 w-3 mr-1" />
                      {project.role.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(project.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(project.lastActivity || project.createdAt)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No projects found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagementDashboard;
