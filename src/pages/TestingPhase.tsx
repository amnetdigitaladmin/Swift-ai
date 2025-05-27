
import { useState } from "react";
import { CheckCircle, Shield, Smartphone, Globe, Users, Zap, Target, AlertTriangle } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import AgentWorkspace from "@/components/AgentWorkspace";
import ArtifactManager from "@/components/ArtifactManager";

const TestingPhase = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    {
      title: "SwiftTest Automated Generator",
      description: "Creates comprehensive test suites with unit, integration, and end-to-end tests.",
      icon: CheckCircle,
      features: ["Unit test generation", "Integration tests", "E2E test scripts", "Test coverage analysis"],
    },
    {
      title: "SwiftTest Security Specialist",
      description: "Performs security audits, vulnerability scanning, and penetration testing.",
      icon: Shield,
      features: ["Vulnerability scanning", "Security audits", "Penetration testing", "Compliance checks"],
    },
    {
      title: "SwiftTest Mobile Expert",
      description: "Specializes in mobile app testing across different devices and platforms.",
      icon: Smartphone,
      features: ["Device compatibility", "Platform testing", "Performance testing", "User interaction"],
    },
    {
      title: "SwiftTest Browser Tester",
      description: "Ensures web applications work consistently across all major browsers.",
      icon: Globe,
      features: ["Browser compatibility", "Responsive testing", "Feature detection", "Polyfill suggestions"],
    },
    {
      title: "SwiftTest UAT Coordinator",
      description: "Designs UAT processes and manages stakeholder testing workflows.",
      icon: Users,
      features: ["UAT scenarios", "Test case management", "Stakeholder coordination", "Feedback collection"],
    },
    {
      title: "SwiftTest Performance Engineer",
      description: "Conducts load testing, stress testing, and performance optimization.",
      icon: Zap,
      features: ["Load testing", "Stress testing", "Performance profiling", "Bottleneck identification"],
    },
    {
      title: "SwiftTest API Specialist",
      description: "Tests API endpoints, data validation, and service integrations.",
      icon: Target,
      features: ["API endpoint testing", "Data validation", "Integration testing", "Service mocking"],
    },
    {
      title: "SwiftTest Bug Hunter",
      description: "Identifies, categorizes, and prioritizes bugs with detailed analysis.",
      icon: AlertTriangle,
      features: ["Bug identification", "Issue classification", "Priority assessment", "Reproduction steps"],
    },
  ];

  if (selectedAgent) {
    return <AgentWorkspace agentName={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SwiftTest - Testing & Quality Assurance Phase</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Ensure application quality with comprehensive AI-powered testing agents. 
          From automated testing to security audits, guarantee your software meets the highest standards.
        </p>
      </div>

      {/* Workflow Management Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex-1">
          <ArtifactManager currentPhase="testing" />
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

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">SwiftTest Phase Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">90%</div>
            <div className="text-sm text-gray-600">Bug Detection Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">75%</div>
            <div className="text-sm text-gray-600">Faster Testing Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">95%</div>
            <div className="text-sm text-gray-600">Test Coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingPhase;
