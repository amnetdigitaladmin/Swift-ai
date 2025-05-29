
import { useState } from "react";
import { FileText, Users, Target, GitBranch, MessageSquare, Database, Shield, Smartphone } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import AgentWorkspace from "@/components/AgentWorkspace";
import ArtifactManager from "@/components/ArtifactManager";

const RequirementsPhase = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    {
      title: "SwiftPlan Business Analyst",
      description: "Transforms business needs into detailed functional requirements with stakeholder analysis.",
      icon: FileText,
      features: ["Stakeholder mapping", "Business process analysis", "Functional requirements", "Success metrics"],
    },
    {
      title: "SwiftPlan Story Generator",
      description: "Creates comprehensive user stories with acceptance criteria and personas.",
      icon: Users,
      features: ["User persona creation", "Epic breakdown", "Acceptance criteria", "Story prioritization"],
    },
    {
      title: "SwiftPlan Technical Engineer",
      description: "Defines technical specifications, architecture constraints, and system requirements.",
      icon: Target,
      features: ["Technical constraints", "Performance requirements", "Integration specs", "Scalability analysis"],
    },
    {
      title: "SwiftPlan API Designer",
      description: "Specifies API endpoints, data models, and integration requirements.",
      icon: GitBranch,
      features: ["Endpoint specification", "Data model design", "Authentication flow", "Rate limiting"],
    },
    {
      title: "SwiftPlan Compliance Advisor",
      description: "Ensures regulatory compliance and security requirements are properly defined.",
      icon: Shield,
      features: ["GDPR compliance", "Security requirements", "Audit trails", "Data protection"],
    },
    {
      title: "SwiftPlan Mobile Specialist",
      description: "Focuses on mobile-specific requirements including platform constraints.",
      icon: Smartphone,
      features: ["Platform guidelines", "Performance specs", "Offline capabilities", "App store requirements"],
    },
    {
      title: "SwiftPlan Database Analyst",
      description: "Defines data storage, retrieval, and management requirements.",
      icon: Database,
      features: ["Data modeling", "Query optimization", "Backup strategies", "Migration planning"],
    },
    {
      title: "SwiftPlan Communication Planner",
      description: "Plans stakeholder communication and documentation requirements.",
      icon: MessageSquare,
      features: ["Communication matrix", "Documentation standards", "Review processes", "Sign-off procedures"],
    },
  ];

  if (selectedAgent) {
    return <AgentWorkspace agentName={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SwiftPlan - Requirements Analysis Phase</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Leverage AI-powered agents to transform business needs into comprehensive, actionable requirements. 
          Each agent specializes in different aspects of requirements gathering and analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>
        
        <div className="lg:col-span-1">
          <ArtifactManager currentPhase="requirements" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">SwiftPlan Phase Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">85%</div>
            <div className="text-sm text-gray-600">Faster Requirements Gathering</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">90%</div>
            <div className="text-sm text-gray-600">Reduced Ambiguity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-600">Fewer Change Requests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPhase;
