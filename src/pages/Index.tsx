
import { useState } from "react";
import { FileText, Palette, Code, CheckCircle, ArrowRight, Eye } from "lucide-react";
import Header from "@/components/Header";
import PhaseCard from "@/components/PhaseCard";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ProcessOverview from "@/components/ProcessOverview";
import RequirementsPhase from "./RequirementsPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import TestingPhase from "./TestingPhase";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showProcessOverview, setShowProcessOverview] = useState(false);

  const phases = [
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

  if (currentPhase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setCurrentPhase(null)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Overview
            </button>
          </div>
          {renderPhaseContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-16">
        {/* SDLC Phases Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              SDLC Agentic Framework
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Our AI agents handle every phase of the software development lifecycle with precision and expertise. 
              Click on any phase to explore the specialized agents and capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto group"
                onClick={() => setShowProcessOverview(!showProcessOverview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showProcessOverview ? 'Hide Process Overview' : 'View Process Overview'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto group"
                onClick={() => setShowArchitecture(!showArchitecture)}
              >
                {showArchitecture ? 'Hide Architecture Diagram' : 'View Architecture Diagram'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {showProcessOverview && (
              <div className="my-12 p-8 bg-white rounded-2xl shadow-lg">
                <ProcessOverview />
              </div>
            )}
            
            {showArchitecture && (
              <div className="my-12 p-8 bg-white rounded-2xl shadow-lg">
                <ArchitectureDiagram />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase) => (
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
        </section>
      </div>
    </div>
  );
};

export default Index;
