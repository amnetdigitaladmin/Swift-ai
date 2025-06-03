import { useState } from "react";
import {
  FileText,
  Palette,
  Code,
  CheckCircle,
  ArrowRight,
  Eye,
  LogOut,
  Plus,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PhaseCard from "@/components/PhaseCard";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ProcessOverview from "@/components/ProcessOverview";
import ProjectSelector from "@/components/ProjectSelector";
import ProjectManagementDashboard from "@/components/ProjectManagementDashboard";
import UserStoryAssignment from "@/components/UserStoryAssignment";
import DeveloperTaskView from "@/components/DeveloperTaskView";
import ProjectTeamAssignment from "@/components/ProjectTeamAssignment";
import ArchitectWorkspace from "@/components/ArchitectWorkspace";
import RequirementsPhase from "./RequirementsPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import TestingPhase from "./TestingPhase";

const Index = () => {
  const { user, logout } = useUser();
  const { currentProject, createProject, selectProject, projects } =
    useWorkflow();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showProcessOverview, setShowProcessOverview] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const allPhases = [
    {
      id: "requirements",
      title: "Requirements Analysis",
      description:
        "Gather and analyze business requirements with AI-powered agents for comprehensive documentation.",
      icon: FileText,
      agentCount: 8,
      estimatedTime: "2-3 days",
    },
    {
      id: "design",
      title: "Design & Architecture",
      description:
        "Create user interfaces, system architecture, and technical designs with intelligent assistance.",
      icon: Palette,
      agentCount: 8,
      estimatedTime: "3-5 days",
    },
    {
      id: "development",
      title: "Development & Implementation",
      description:
        "Build and implement your solution with AI-powered coding agents and best practices.",
      icon: Code,
      agentCount: 8,
      estimatedTime: "1-4 weeks",
    },
    {
      id: "testing",
      title: "Testing & Quality Assurance",
      description:
        "Ensure quality with comprehensive testing strategies and automated quality checks.",
      icon: CheckCircle,
      agentCount: 8,
      estimatedTime: "1-2 weeks",
    },
  ];

  // Filter phases based on user's persona
  const allowedPhases = allPhases.filter((phase) =>
    user?.allowedPhases.includes(phase.id)
  );

  const getPersonaTitle = (persona: string): string => {
    const titles: Record<string, string> = {
      "business-analyst": "Business Analyst",
      designer: "UI/UX Designer",
      developer: "Developer",
      "qa-engineer": "QA Engineer",
      "project-manager": "Project Manager",
      architect: "Architect",
      admin: "Administrator",
    };
    return titles[persona] || persona;
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case "requirements":
        return <RequirementsPhase />;
      case "design":
        return <DesignPhase />;
      case "development":
        return <DevelopmentPhase />;
      case "testing":
        return <TestingPhase />;
      default:
        return null;
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !user) return;

    const project = createProject(
      newProjectName,
      newProjectDescription,
      user.persona
    );
    selectProject(project);
    setIsCreateDialogOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");

    toast({
      title: "Project Created",
      description: `${newProjectName} has been created successfully.`,
    });
  };

  const handleSelectProject = (project: any) => {
    selectProject(project);
    toast({
      title: "Project Selected",
      description: `Now working on ${project.name}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show architect workspace for architects (only after project is selected)
  if (user?.persona === "architect" && currentProject) {
    return (
      <div className="min-h-screen bg-custom-bg">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => selectProject(null as any)}
                size="sm"
                className="border-gray-600 text-gray-200 hover:bg-gray-800"
              >
                ← Back to Projects
              </Button>
              <div className="text-left">
                <span className="text-sm text-gray-300">
                  Welcome, {user?.username} (
                  {getPersonaTitle(user?.persona || "")})
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <FolderOpen className="h-4 w-4 text-cyan-400" />
                  <span className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent font-medium">
                    {currentProject.name}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <ArchitectWorkspace />
        </div>
      </div>
    );
  }

  // Show project management dashboard for project managers (only after project is selected)
  if (user?.persona === "project-manager" && currentProject) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-sm text-gray-300">
                Welcome, {user?.username} (
                {getPersonaTitle(user?.persona || "")})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="space-y-6">
            <ProjectManagementDashboard />
            <ProjectTeamAssignment />
            <UserStoryAssignment />
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentPhase(null)}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              ← Back to Overview
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {user?.username} (
                {getPersonaTitle(user?.persona || "")})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-gray-600 text-gray-200 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          {renderPhaseContent()}
        </div>
      </div>
    );
  }

  // Show project selector if no project is selected (for all roles except architect)
  if (!currentProject && user?.persona !== "architect") {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Welcome, {user?.username}
              </h1>
              <p className="text-gray-300">
                Role: {getPersonaTitle(user?.persona || "")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <ProjectSelector onProjectSelected={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  // Enhanced project selection interface for architects
  if (!currentProject && user?.persona === "architect") {
    return (
      <div className="min-h-screen bg-custom-bg">
        <Header />
        <div className="container mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent">
                Welcome, {user?.username}
              </h1>
              <p className="text-white/50">
                Role: {getPersonaTitle(user?.persona || "")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-200 mb-4">
                Select or Create Architecture Project
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Access all AI agents across requirements, development, and QA
                phases. Choose an existing project or create a new one to get
                started.
              </p>
            </div>

            {/* Always show Create New Project button */}
            <div className="flex justify-center mb-8">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to hover:from-cyan-700 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200">
                      Create Architecture Project
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-200">
                        Project Name
                      </label>
                      <Input
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name..."
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200">
                        Description
                      </label>
                      <Textarea
                        value={newProjectDescription}
                        onChange={(e) =>
                          setNewProjectDescription(e.target.value)
                        }
                        placeholder="Describe your architecture project..."
                        rows={3}
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="border-gray-600 text-gray-200 hover:bg-gray-700"
                      >
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

            {/* Show existing projects if any */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 mr-2" />
                  Existing Projects ({projects.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:shadow-lg transition-all bg-custom-bg border-gray-700 hover:border-gray-600"
                      onClick={() => handleSelectProject(project)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-200">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-gray-400">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Created {formatDate(project.createdAt)}
                            </span>
                            <span className="text-xs bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent hover:opacity-90 transition-colors">
                              Click to open
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Capability overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <FileText className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Requirements
                </h3>
                <p className="text-gray-400 text-sm">
                  8 specialized agents for business analysis, stakeholder
                  mapping, and requirement gathering
                </p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <Code className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Development
                </h3>
                <p className="text-gray-400 text-sm">
                  8 development agents covering frontend, backend, DevOps, and
                  security implementation
                </p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <CheckCircle className="h-8 w-8 text-red-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Testing
                </h3>
                <p className="text-gray-400 text-sm">
                  8 testing agents for automated testing, security audits, and
                  quality assurance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="container mx-auto px-6 py-16">
        {/* User Info and Logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Welcome, {user?.username}
            </h1>
            <p className="text-gray-300">
              Role: {getPersonaTitle(user?.persona || "")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="border-gray-600 text-gray-200 hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Developer Task View */}
        {user?.persona === "developer" && (
          <div className="mb-8">
            <DeveloperTaskView />
          </div>
        )}

        {/* SDLC Phases Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Your SDLC Workspace
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Access your specialized AI agents for the{" "}
              {getPersonaTitle(user?.persona || "")} role. Click on any phase to
              explore the agents and capabilities available to you.
            </p>

            {/* Only show Process Overview and Architecture Diagram for architect role */}
            {user?.persona === "architect" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center mx-auto group transition-colors"
                  onClick={() => setShowProcessOverview(!showProcessOverview)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showProcessOverview
                    ? "Hide Process Overview"
                    : "View Process Overview"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center mx-auto group transition-colors"
                  onClick={() => setShowArchitecture(!showArchitecture)}
                >
                  {showArchitecture
                    ? "Hide Architecture Diagram"
                    : "View Architecture Diagram"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {user?.persona === "architect" && showProcessOverview && (
              <div className="my-12 p-8 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700">
                <ProcessOverview />
              </div>
            )}

            {user?.persona === "architect" && showArchitecture && (
              <div className="my-12 p-8 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700">
                <ArchitectureDiagram />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allowedPhases.map((phase) => (
              <PhaseCard
                key={phase.id}
                title={phase.title}
                description={phase.description}
                icon={phase.icon}
                agentCount={phase.agentCount}
                estimatedTime={phase.estimatedTime}
                onClick={() => setCurrentPhase(phase.id)}
                isCompleted={completedPhases.includes(phase.id)}
                isActive={currentPhase === phase.id}
              />
            ))}
          </div>

          {allowedPhases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No phases available for your current role.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
