import { useState } from "react";
import { FileText, Palette, Code, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import PhaseCard from "@/components/PhaseCard";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import RequirementsPhase from "./RequirementsPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import TestingPhase from "./TestingPhase";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);

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
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Accelerate Your Software Development
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Transform your development process with AI-powered agents that handle every phase of the SDLC. 
            From requirements gathering to testing, get intelligent assistance that speeds up delivery while maintaining quality.
          </p>
          <button 
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto"
            onClick={() => setShowArchitecture(!showArchitecture)}
          >
            {showArchitecture ? 'Hide Architecture Diagram' : 'View Architecture Diagram'}
          </button>
          
          {showArchitecture && (
            <div className="my-8">
              <ArchitectureDiagram />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Palette className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">AI-Powered Efficiency</h4>
              <p className="text-gray-600">Leverage GPT-4, Claude-3, and other advanced AI models to accelerate every development phase.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Comprehensive Coverage</h4>
              <p className="text-gray-600">32 specialized agents cover every aspect of software development lifecycle.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Quality Assurance</h4>
              <p className="text-gray-600">Built-in quality checks and best practices ensure professional-grade outputs.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Development Process?</h3>
          <p className="text-indigo-100 mb-6">
            Start with any phase of the SDLC and experience the power of AI-assisted development.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">75%</div>
              <div className="text-sm">Faster Delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold">90%</div>
              <div className="text-sm">Quality Improvement</div>
            </div>
            <div>
              <div className="text-3xl font-bold">60%</div>
              <div className="text-sm">Cost Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm">Developer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
