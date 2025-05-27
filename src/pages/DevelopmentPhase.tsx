
import { useState } from "react";
import { Code, Database, Cloud, Zap, GitBranch, Package, Settings, Bug } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import AgentWorkspace from "@/components/AgentWorkspace";
import ArtifactManager from "@/components/ArtifactManager";
import WorkflowButton from "@/components/WorkflowButton";
import { useUser } from "@/contexts/UserContext";

const DevelopmentPhase = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { user } = useUser();

  const allAgents = [
    {
      title: "Swift Dev Full-Stack Generator",
      description: "Generates complete application code with frontend, backend, and database integration.",
      icon: Code,
      features: ["Frontend scaffolding", "Backend APIs", "Database schemas", "Integration code"],
    },
    {
      title: "Swift Dev Frontend Assistant",
      description: "Specializes in modern frontend frameworks and component development.",
      icon: Package,
      features: ["React/Vue/Angular", "Component libraries", "State management", "Responsive design"],
    },
    {
      title: "Swift Dev Backend Builder",
      description: "Creates robust backend services with RESTful APIs and microservices architecture.",
      icon: Database,
      features: ["REST/GraphQL APIs", "Microservices", "Authentication", "Data validation"],
    },
    {
      title: "Swift Dev Cloud Architect",
      description: "Designs and implements cloud-native solutions with auto-scaling and monitoring.",
      icon: Cloud,
      features: ["AWS/Azure/GCP", "Docker containers", "Kubernetes", "CI/CD pipelines"],
    },
    {
      title: "Swift Dev Performance Optimizer",
      description: "Optimizes application performance with caching, bundling, and code splitting.",
      icon: Zap,
      features: ["Code optimization", "Caching strategies", "Bundle analysis", "Load balancing"],
    },
    {
      title: "Swift Dev Version Control Manager",
      description: "Manages git workflows, branching strategies, and code collaboration.",
      icon: GitBranch,
      features: ["Git workflows", "Branch strategies", "Code reviews", "Merge conflicts"],
    },
    {
      title: "Swift Dev DevOps Assistant",
      description: "Sets up development environments, deployment pipelines, and monitoring.",
      icon: Settings,
      features: ["Environment setup", "Deployment automation", "Monitoring", "Logging"],
    },
    {
      title: "Swift Dev Quality Auditor",
      description: "Reviews code quality, identifies technical debt, and suggests improvements.",
      icon: Bug,
      features: ["Code review", "Security analysis", "Best practices", "Refactoring suggestions"],
    },
  ];

  // Filter agents based on developer type
  const getFilteredAgents = () => {
    if (user?.username === "dev1") {
      // Frontend developer - only show Frontend Assistant
      return allAgents.filter(agent => agent.title === "Swift Dev Frontend Assistant");
    } else if (user?.username === "dev2") {
      // Backend developer - only show Backend Builder
      return allAgents.filter(agent => agent.title === "Swift Dev Backend Builder");
    }
    
    // For other developers, show all agents (fallback)
    return allAgents;
  };

  const agents = getFilteredAgents();

  if (selectedAgent) {
    return <AgentWorkspace agentName={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Swift Dev - Development & Implementation Phase</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Accelerate development with AI-powered coding agents. From frontend to backend, 
          infrastructure to optimization - get intelligent assistance for every aspect of development.
        </p>
      </div>

      {/* Workflow Management Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ArtifactManager currentPhase="development" />
          </div>
          <div className="lg:w-auto flex flex-col justify-center">
            <WorkflowButton 
              currentPhase="development" 
              nextPhase="testing" 
              nextPhaseTitle="Testing & Quality Assurance" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <AgentCard
            key={index}
            title={agent.title}
            description={agent.description}
            icon={agent.icon}
            features={agent.features}
            onSelect={() => setSelectedAgent(agent.title)}
          />
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Swift Dev Phase Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">60%</div>
            <div className="text-sm text-gray-600">Faster Development Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-gray-600">Code Quality Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">70%</div>
            <div className="text-sm text-gray-600">Reduced Bugs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentPhase;
