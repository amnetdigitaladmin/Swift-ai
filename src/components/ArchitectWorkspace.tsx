import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Target,
  GitBranch,
  MessageSquare,
  Database,
  Shield,
  Smartphone,
  Code,
  Palette,
  Monitor,
  CheckCircle,
  Zap,
  AlertTriangle,
  Globe,
  History,
  Network,
  Bug,
  Table,
} from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import AgentCard from "./AgentCard";
import AgentWorkspace from "./AgentWorkspace";
import ConversionInterface from "./ConversionInterface";
import CodeConversionInterface from "./CodeConversionInterface";
import ConversionTypeDialog from "./ConversionTypeDialog";

const ArchitectWorkspace = () => {
  const { currentProject, createProject, selectProject, projects } =
    useWorkflow();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [conversionType, setConversionType] = useState<"sql" | "code" | null>(
    null
  );

  const requirementsAgents = [
    {
      title: "SwiftPlan Business Analyst",
      description:
        "Transforms business needs into detailed functional requirements with stakeholder analysis.",
      icon: FileText,
      features: [
        "Stakeholder mapping",
        "Business process analysis",
        "Functional requirements",
        "Success metrics",
      ],
    },
    {
      title: "SwiftPlan Story Generator",
      description:
        "Creates comprehensive user stories with acceptance criteria and personas.",
      icon: Users,
      features: [
        "User persona creation",
        "Epic breakdown",
        "Acceptance criteria",
        "Story prioritization",
      ],
    },
    {
      title: "SwiftPlan Technical Engineer",
      description:
        "Defines technical specifications, architecture constraints, and system requirements.",
      icon: Target,
      features: [
        "Technical constraints",
        "Performance requirements",
        "Integration specs",
        "Scalability analysis",
      ],
    },
    // {
    //   title: "SwiftPlan API Designer",
    //   description: "Specifies API endpoints, data models, and integration requirements.",
    //   icon: GitBranch,
    //   features: ["Endpoint specification", "Data model design", "Authentication flow", "Rate limiting"],
    // },
    // {
    //   title: "SwiftPlan Compliance Advisor",
    //   description: "Ensures regulatory compliance and security requirements are properly defined.",
    //   icon: Shield,
    //   features: ["GDPR compliance", "Security requirements", "Audit trails", "Data protection"],
    // },
    // {
    //   title: "SwiftPlan Mobile Specialist",
    //   description: "Focuses on mobile-specific requirements including platform constraints.",
    //   icon: Smartphone,
    //   features: ["Platform guidelines", "Performance specs", "Offline capabilities", "App store requirements"],
    // },
    // {
    //   title: "SwiftPlan Database Analyst",
    //   description: "Defines data storage, retrieval, and management requirements.",
    //   icon: Database,
    //   features: ["Data modeling", "Query optimization", "Backup strategies", "Migration planning"],
    // },
    // {
    //   title: "SwiftPlan Communication Planner",
    //   description: "Plans stakeholder communication and documentation requirements.",
    //   icon: MessageSquare,
    //   features: ["Communication matrix", "Documentation standards", "Review processes", "Sign-off procedures"],
    // },
  ];

  const developmentAgents = [
    {
      title: "SwiftBuild Frontend",
      description:
        "Builds responsive user interfaces with modern frameworks and best practices.",
      icon: Code,
      features: [
        "React/Vue development",
        "Responsive design",
        "Component libraries",
        "State management",
      ],
    },
    {
      title: "SwiftBuild Backend",
      description:
        "Develops robust server-side applications and APIs with scalable architecture.",
      icon: Database,
      features: [
        "API development",
        "Database design",
        "Authentication",
        "Performance optimization",
      ],
    },
    {
      title: "Code Modernisation",
      description:
        "Revamps outdated systems with modern frameworks, improved architecture, and enhanced maintainability.",
      icon: History,
      features: [
        "Code refactoring",
        "Tech stack upgrades",
        "Modular architecture",
        "Automated testing",
      ],
    },
    {
      title: "SwiftBuild Mobile",
      description:
        "Creates native and cross-platform mobile applications for iOS and Android.",
      icon: Smartphone,
      features: [
        "React Native",
        "Native development",
        "App store deployment",
        "Mobile optimization",
      ],
    },
    {
      title: "SwiftBuild Full-Stack",
      description:
        "Handles end-to-end development from database to user interface.",
      icon: Palette,
      features: [
        "Full-stack development",
        "System integration",
        "Database management",
        "Frontend frameworks",
      ],
    },
    {
      title: "SwiftBuild Security",
      description:
        "Implements security best practices and vulnerability assessments.",
      icon: Shield,
      features: [
        "Security audits",
        "Encryption",
        "Authentication systems",
        "Vulnerability scanning",
      ],
    },
    // {
    //   title: "SwiftBuild API Architect",
    //   description: "Designs and implements RESTful and GraphQL APIs with proper documentation.",
    //   icon: GitBranch,
    //   features: ["API design", "GraphQL", "Documentation", "Versioning strategies"],
    // },
    // {
    //   title: "SwiftBuild Performance Engineer",
    //   description: "Optimizes application performance and implements monitoring solutions.",
    //   icon: Zap,
    //   features: ["Performance optimization", "Monitoring setup", "Profiling", "Caching strategies"],
    // },
  ];

  const qaAgents = [
    {
      title: "SwiftTest Automated Generator",
      description:
        "Creates comprehensive test suites with unit, integration, and end-to-end tests.",
      icon: CheckCircle,
      features: [
        "Unit test generation",
        "Integration tests",
        "E2E test scripts",
        "Test coverage analysis",
      ],
    },
    {
      title: "SwiftTest Security",
      description:
        "Performs security audits, vulnerability scanning, and penetration testing.",
      icon: Shield,
      features: [
        "Vulnerability scanning",
        "Security audits",
        "Penetration testing",
        "Compliance checks",
      ],
    },
    {
      title: "SwiftTest Mobile",
      description:
        "Specializes in mobile app testing across different devices and platforms.",
      icon: Smartphone,
      features: [
        "Device compatibility",
        "Platform testing",
        "Performance testing",
        "User interaction",
      ],
    },
    {
      title: "SwiftTest Browser",
      description:
        "Ensures web applications work consistently across all major browsers.",
      icon: Globe,
      features: [
        "Browser compatibility",
        "Responsive testing",
        "Feature detection",
        "Polyfill suggestions",
      ],
    },
    // {
    //   title: "SwiftTest UAT Coordinator",
    //   description: "Designs UAT processes and manages stakeholder testing workflows.",
    //   icon: Users,
    //   features: ["UAT scenarios", "Test case management", "Stakeholder coordination", "Feedback collection"],
    // },
    {
      title: "SwiftTest Performance",
      description:
        "Conducts load testing, stress testing, and performance optimization.",
      icon: Zap,
      features: [
        "Load testing",
        "Stress testing",
        "Performance profiling",
        "Bottleneck identification",
      ],
    },
    {
      title: "SwiftTest API",
      description:
        "Tests API endpoints, data validation, and service integrations.",
      icon: Network,
      features: [
        "API endpoint testing",
        "Data validation",
        "Integration testing",
        "Service mocking",
      ],
    },
    {
      title: "SwiftTest SQL",
      description:
        "Identifies, categorizes, and prioritizes bugs with detailed analysis.",
      icon: Table,
      features: [
        "Bug identification",
        "Issue classification",
        "Priority assessment",
        "Reproduction steps",
      ],
    },
  ];

  const handleAgentSelection = (agentTitle: string) => {
    if (agentTitle === "Code Modernisation") {
      setShowConversionDialog(true);
    } else {
      setSelectedAgent(agentTitle);
    }
  };

  const handleConversionTypeSelection = (type: "sql" | "code") => {
    setConversionType(type);
    setSelectedAgent("Code Modernisation");
    setShowConversionDialog(false);
  };

  const handleBack = () => {
    setSelectedAgent(null);
    setConversionType(null);
  };

  if (selectedAgent) {
    if (selectedAgent === "Code Modernisation" && conversionType === "sql") {
      return (
        <ConversionInterface agentName={selectedAgent} onBack={handleBack} />
      );
    } else if (
      selectedAgent === "Code Modernisation" &&
      conversionType === "code"
    ) {
      return (
        <CodeConversionInterface
          agentName={selectedAgent}
          onBack={handleBack}
        />
      );
    }
    return <AgentWorkspace agentName={selectedAgent} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {currentProject.name} Workspace
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access all AI-powered agents across requirements, development, and QA
          phases. Select a tab to explore agents in each category.
        </p>
      </div>

      <Tabs defaultValue="plan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plan" className="text-lg">
            SwiftPlan
          </TabsTrigger>
          <TabsTrigger value="build" className="text-lg">
            SwiftBuild
          </TabsTrigger>
          <TabsTrigger value="test" className="text-lg">
            SwiftTest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              SwiftPlan Agents
            </h2>
            <p className="text-gray-600">
              Agents specialized in gathering and analyzing business
              requirements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {requirementsAgents.map((agent, index) => (
              <AgentCard
                key={index}
                title={agent.title}
                description={agent.description}
                icon={agent.icon}
                features={agent.features}
                onSelect={() => handleAgentSelection(agent.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="build" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              SwiftBuild Agents
            </h2>
            <p className="text-gray-600">
              Agents focused on building and implementing solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {developmentAgents.map((agent, index) => (
              <AgentCard
                key={index}
                title={agent.title}
                description={agent.description}
                icon={agent.icon}
                features={agent.features}
                onSelect={() => handleAgentSelection(agent.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              SwiftTest Agents
            </h2>
            <p className="text-gray-600">
              Agents dedicated to testing and quality assurance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {qaAgents.map((agent, index) => (
              <AgentCard
                key={index}
                title={agent.title}
                description={agent.description}
                icon={agent.icon}
                features={agent.features}
                onSelect={() => handleAgentSelection(agent.title)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ConversionTypeDialog
        open={showConversionDialog}
        onOpenChange={setShowConversionDialog}
        onSelectType={handleConversionTypeSelection}
      />
    </div>
  );
};

export default ArchitectWorkspace;
