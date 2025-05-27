import { useState } from "react";
import { FileText, Palette, Code, CheckCircle, ArrowRight, Eye, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import Header from "@/components/Header";
import PhaseCard from "@/components/PhaseCard";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ProcessOverview from "@/components/ProcessOverview";
import ProjectSelector from "@/components/ProjectSelector";
import ProjectManagementDashboard from "@/components/ProjectManagementDashboard";
import RequirementsPhase from "./RequirementsPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import TestingPhase from "./TestingPhase";

const Index = () => {
  const { user, logout } = useUser();
  const { currentProject } = useWorkflow();
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showProcessOverview, setShowProcessOverview] = useState(false);

  const allPhases = [
    {
      id: "requirements",
      title: "Requirements Analysis",
      description: "Gather and analyze business requirements with AI-powered agents for comprehensive documentation.",
      icon: FileText,
      agentCount: 8,
      estimatedTime: "2-3 days"
    },
    {
      id: "design",
      title: "Design & Architecture",
      description: "Create user interfaces, system architecture, and technical designs with intelligent assistance.",
      icon: Palette,
      agentCount: 8,
      estimatedTime: "3-5 days"
    },
    {
      id: "development",
      title: "Development & Implementation",
      description: "Build and implement your solution with AI-powered coding agents and best practices.",
      icon: Code,
      agentCount: 8,
      estimatedTime: "1-4 weeks"
    },
    {
      id: "testing",
      title: "Testing & Quality Assurance",
      description: "Ensure quality with comprehensive testing strategies and automated quality checks.",
      icon: CheckCircle,
      agentCount: 8,
      estimatedTime: "1-2 weeks"
    }
  ];

  // Filter phases based on user's persona
  const allowedPhases = allPhases.filter(phase => 
    user?.allowedPhases.includes(phase.id)
  );

  const getPersonaTitle = (persona: string): string => {
    const titles: Record<string, string> = {
      "business-analyst": "Business Analyst",
      "designer": "UI/UX Designer",
      "developer": "Developer", 
      "qa-engineer": "QA Engineer",
      "project-manager": "Project Manager",
      "admin": "Administrator"
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

  // Show project management dashboard for project managers
  if (user?.persona === "project-manager") {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-sm text-gray-300">
                Welcome, {user?.username} ({getPersonaTitle(user?.persona || "")})
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="border-gray-600 text-gray-200 hover:bg-gray-800">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <ProjectManagementDashboard />
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
                Welcome, {user?.username} ({getPersonaTitle(user?.persona || "")})
              </span>
              <Button variant="outline" size="sm" onClick={logout} className="border-gray-600 text-gray-200 hover:bg-gray-800">
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

  // Show project selector if no project is selected
  if (!currentProject) {
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
            <Button variant="outline" onClick={logout} className="border-gray-600 text-gray-200 hover:bg-gray-800">
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
          <Button variant="outline" onClick={logout} className="border-gray-600 text-gray-200 hover:bg-gray-800">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* SDLC Phases Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Your SDLC Workspace
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Access your specialized AI agents for the {getPersonaTitle(user?.persona || "")} role. 
              Click on any phase to explore the agents and capabilities available to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center mx-auto group transition-colors"
                onClick={() => setShowProcessOverview(!showProcessOverview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showProcessOverview ? 'Hide Process Overview' : 'View Process Overview'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center mx-auto group transition-colors"
                onClick={() => setShowArchitecture(!showArchitecture)}
              >
                {showArchitecture ? 'Hide Architecture Diagram' : 'View Architecture Diagram'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {showProcessOverview && (
              <div className="my-12 p-8 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700">
                <ProcessOverview />
              </div>
            )}
            
            {showArchitecture && (
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
              <p className="text-gray-400">No phases available for your current role.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
