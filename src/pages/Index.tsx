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
  MessageSquare,
  Star,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Footer from "@/components/Footer";
import CreateProjectStepper from "@/components/CreateProjectStepper";
import CreateProjectStepperSimple from "@/components/CreateProjectStepperSimple";

const Index = () => {
  const { user } = useUser();
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

  // create Project fields
  const [newProjectCode, setNewProjectCode] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [currentFormPage, setCurrentFormPage] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [projectStatus, setProjectStatus] = useState("planning");
  const [projectManager, setProjectManager] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectLocation, setProjectLocation] = useState("");

  // Feedback dialog states
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");

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

  const handleCreateProject = (formData: any) => {
    if (!formData.projectName.trim() || !user) return;
    // console.log(formData);
    const project = createProject(
      formData.projectName,
      formData.description,
      user.persona,
      {
        projectCode: formData.projectCode,
        startDate: formData.startDate,
        endDate: formData.endDate,

      }
    );
    selectProject(project);

    toast({
      title: "Project Created",
      description: `${formData.projectName} has been created successfully.`,
    });
  };

  const handleSelectProject = (project: any) => {
    selectProject(project);
    toast({
      title: "Project Selected",
      description: `Now working on ${project.name}.`,
    });
  };

  const handleSubmitFeedback = () => {
    if (
      !feedbackType ||
      !feedbackSubject.trim() ||
      !feedbackDescription.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the feedback to your backend
    // console.log("Feedback submitted:", {
    //   type: feedbackType,
    //   subject: feedbackSubject,
    //   description: feedbackDescription,
    //   rating: feedbackRating,
    //   email: feedbackEmail,
    //   user: user?.username,
    //   project: currentProject?.name,
    //   timestamp: new Date().toISOString(),
    // });

    // Reset form and close dialog
    setFeedbackType("");
    setFeedbackSubject("");
    setFeedbackDescription("");
    setFeedbackRating("");
    setFeedbackEmail("");
    setIsFeedbackDialogOpen(false);

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it shortly.",
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => selectProject(null as any)}
                size="sm"
                className="bg-custom-nav-bg text-gray-200 hover:bg-gray-800"
              >
                ← Back to Projects
              </Button>

              {/* <div className="text-left">
                <span className="text-sm text-gray-300">
                  Welcome, {user?.username} (
                  {getPersonaTitle(user?.persona || "")})
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <FolderOpen className="h-4 w-4 text-ready-txt" />
                  <span className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent generate-button-text text-base">
                    {currentProject.name}
                  </span>
                </div>
              </div> */}

              <div className="flex justify-between items-center ">
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent">
                    Welcome {user?.username}
                  </h1>
                  <p className="text-white/50">
                    Role: {getPersonaTitle(user?.persona || "")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ArchitectWorkspace />
          <Footer />
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
          </div>
          <div className="space-y-6">
            <ProjectManagementDashboard />
            <ProjectTeamAssignment />
            <UserStoryAssignment />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPhase) {
    return (
      <div className="min-h-screen bg-custom-bg">
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
            </div>
          </div>
          {renderPhaseContent()}
        </div>
        <Footer />
      </div>
    );
  }

  // Show project selector if no project is selected (for all roles except architect)
  if (!currentProject && user?.persona !== "architect") {
    return (
      <div className="min-h-screen bg-custom-bg">
        <Header />
        <div className="container mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent">
                Welcome {user?.username}
              </h1>
              <p className="text-gray-300">
                Role: {getPersonaTitle(user?.persona || "")}
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <ProjectSelector onProjectSelected={() => {}} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Enhanced project selection interface for architects
  if (!currentProject && user?.persona === "architect") {
    return (
      <>
        <div className="min-h-screen bg-custom-bg relative flex flex-col">
          <div>
            <Header />
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent">
                    Welcome {user?.username}
                  </h1>
                  <p className="text-white/50">
                    Role: {getPersonaTitle(user?.persona || "")}
                  </p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-b mb-4 bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent">
                    Swift AI Project Hub
                  </h2>
                  <p className="text-lg text-gray-400 mb-8">
                    Accelerate projects with AI-powered Swift Agents that plan,
                    build, and deliver in unison.
                  </p>
                </div>

                {/* Always show Create New Project button */}
                <div className="flex justify-between mb-8 space-x-6">
                  <h3 className="text-xl font-semibold text-gray-200 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 mr-2 text-ready-txt" />
                    Projects ({projects.length})
                  </h3>
                  <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={(open) => {
                      // console.log("Dialog onOpenChange called with:", open);
                      setIsCreateDialogOpen(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to  text-lg px-8 py-4"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-custom-bg py-8 pb-6 border-gray-700 left-[50%] max-h-[90vh] overflow-y-auto w-[40vw] max-w-4xl ">
                      <CreateProjectStepperSimple
                        isOpen={isCreateDialogOpen}
                        onClose={() => {
                          setIsCreateDialogOpen(false);
                          setCurrentFormPage(1);
                        }}
                        onSubmit={(data) => {
                          handleCreateProject(data);
                          setIsCreateDialogOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Show existing projects if any */}
                {projects.length > 0 && (
                  <div>
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
                                <span className="text-sm font-normal text-gray-500">
                                  Created {formatDate(project.createdAt)}
                                </span>
                                <span className="text-sm underline relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0.5 after:w-full after:h-px after:bg-gradient-to-r after:from-gradient-background-from after:to-gradient-background-to bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent hover:opacity-90 transition-colors">
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
              </div>
            </div>
          </div>
          <Footer className="bg-custom-bg mt-auto" />
        </div>
      </>
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
      <Footer />
    </div>
  );
};

export default Index;
