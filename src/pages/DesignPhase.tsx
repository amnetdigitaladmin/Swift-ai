
import { useState } from "react";
import { Palette, Layout, Smartphone, Monitor, Layers, Figma, Globe, Accessibility } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import AgentWorkspace from "@/components/AgentWorkspace";

const DesignPhase = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    {
      title: "UI/UX Design Architect",
      description: "Creates comprehensive user interface designs with optimal user experience flows.",
      icon: Palette,
      features: ["Wireframe generation", "User journey mapping", "Component library", "Style guide creation"],
    },
    {
      title: "System Architecture Designer",
      description: "Designs scalable system architecture with component relationships and data flow.",
      icon: Layout,
      features: ["Architecture diagrams", "Component design", "Data flow modeling", "Scalability planning"],
    },
    {
      title: "Mobile Design Specialist",
      description: "Focuses on mobile-first design patterns and responsive layouts.",
      icon: Smartphone,
      features: ["Mobile-first design", "Touch interactions", "Platform conventions", "Responsive layouts"],
    },
    {
      title: "Web Interface Designer",
      description: "Creates modern web interfaces with accessibility and performance in mind.",
      icon: Monitor,
      features: ["Web components", "Grid systems", "Browser compatibility", "Performance optimization"],
    },
    {
      title: "Design System Creator",
      description: "Builds comprehensive design systems with reusable components and guidelines.",
      icon: Layers,
      features: ["Component libraries", "Design tokens", "Style guides", "Documentation"],
    },
    {
      title: "Prototyping Assistant",
      description: "Generates interactive prototypes and mockups for validation and testing.",
      icon: Figma,
      features: ["Interactive prototypes", "User flow validation", "Mockup generation", "Feedback integration"],
    },
    {
      title: "API Design Specialist",
      description: "Designs RESTful APIs and GraphQL schemas with best practices.",
      icon: Globe,
      features: ["API specification", "Schema design", "Documentation", "Version management"],
    },
    {
      title: "Accessibility Design Auditor",
      description: "Ensures designs meet accessibility standards and inclusive design principles.",
      icon: Accessibility,
      features: ["WCAG compliance", "Screen reader support", "Color contrast", "Keyboard navigation"],
    },
  ];

  if (selectedAgent) {
    return <AgentWorkspace agentName={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Design & Architecture Phase</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Transform requirements into beautiful, functional designs with AI-powered design agents. 
          Create everything from user interfaces to system architecture with intelligent assistance.
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

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Design Phase Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">70%</div>
            <div className="text-sm text-gray-600">Faster Design Iteration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">95%</div>
            <div className="text-sm text-gray-600">Design Consistency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">80%</div>
            <div className="text-sm text-gray-600">Reduced Design Debt</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPhase;
