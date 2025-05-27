
import { useState } from "react";
import { Code, Database, Cloud, Zap, GitBranch, Package, Settings, Bug } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import AgentWorkspace from "@/components/AgentWorkspace";

const DevelopmentPhase = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    {
      title: "Full-Stack Code Generator",
      description: "Generates complete application code with frontend, backend, and database integration.",
      icon: Code,
      features: ["Frontend scaffolding", "Backend APIs", "Database schemas", "Integration code"],
    },
    {
      title: "Frontend Development Assistant",
      description: "Specializes in modern frontend frameworks and component development.",
      icon: Package,
      features: ["React/Vue/Angular", "Component libraries", "State management", "Responsive design"],
    },
    {
      title: "Backend API Builder",
      description: "Creates robust backend services with RESTful APIs and microservices architecture.",
      icon: Database,
      features: ["REST/GraphQL APIs", "Microservices", "Authentication", "Data validation"],
    },
    {
      title: "Cloud Infrastructure Architect",
      description: "Designs and implements cloud-native solutions with auto-scaling and monitoring.",
      icon: Cloud,
      features: ["AWS/Azure/GCP", "Docker containers", "Kubernetes", "CI/CD pipelines"],
    },
    {
      title: "Performance Optimizer",
      description: "Optimizes application performance with caching, bundling, and code splitting.",
      icon: Zap,
      features: ["Code optimization", "Caching strategies", "Bundle analysis", "Load balancing"],
    },
    {
      title: "Version Control Manager",
      description: "Manages git workflows, branching strategies, and code collaboration.",
      icon: GitBranch,
      features: ["Git workflows", "Branch strategies", "Code reviews", "Merge conflicts"],
    },
    {
      title: "DevOps Configuration Assistant",
      description: "Sets up development environments, deployment pipelines, and monitoring.",
      icon: Settings,
      features: ["Environment setup", "Deployment automation", "Monitoring", "Logging"],
    },
    {
      title: "Code Quality Auditor",
      description: "Reviews code quality, identifies technical debt, and suggests improvements.",
      icon: Bug,
      features: ["Code review", "Security analysis", "Best practices", "Refactoring suggestions"],
    },
  ];

  if (selectedAgent) {
    return <AgentWorkspace agentName={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Development & Implementation Phase</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Accelerate development with AI-powered coding agents. From frontend to backend, 
          infrastructure to optimization - get intelligent assistance for every aspect of development.
        </p>
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
        <h3 className="text-xl font-semibold mb-3">Development Phase Benefits</h3>
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
