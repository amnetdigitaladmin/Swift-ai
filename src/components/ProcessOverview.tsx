import { ArrowRight, FileText, Palette, Code, CheckCircle, Users, Zap, Bot, Target, Lightbulb, Shield, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProcessOverview = () => {
  const processSteps = [
    {
      id: 1,
      title: "SwiftPlan",
      icon: FileText,
      color: "bg-blue-500",
      agents: ["Business Analyst", "Stakeholder Liaison", "Requirements Engineer"],
      outputs: ["User Stories", "Business Rules", "Technical Specs"],
      description: "AI agents gather and analyze requirements"
    },
    {
      id: 2,
      title: "SwiftDesign",
      icon: Palette,
      color: "bg-purple-500",
      agents: ["UI/UX Designer", "System Architect", "Database Designer"],
      outputs: ["Wireframes", "System Design", "Architecture Diagrams"],
      description: "Create comprehensive design solutions"
    },
    {
      id: 3,
      title: "Swift Dev",
      icon: Code,
      color: "bg-green-500",
      agents: ["Frontend Developer", "Backend Developer", "DevOps Engineer"],
      outputs: ["Source Code", "APIs", "Infrastructure"],
      description: "Build and implement the solution"
    },
    {
      id: 4,
      title: "SwiftTest",
      icon: CheckCircle,
      color: "bg-orange-500",
      agents: ["QA Engineer", "Test Automation", "Security Tester"],
      outputs: ["Test Cases", "Bug Reports", "Quality Metrics"],
      description: "Ensure quality and reliability"
    }
  ];

  const benefits = [
    { icon: Zap, text: "75% Faster Development", color: "text-yellow-600" },
    { icon: Shield, text: "Built-in Security", color: "text-green-600" },
    { icon: Bot, text: "32 AI Agents", color: "text-blue-600" },
    { icon: Target, text: "99.9% Accuracy", color: "text-purple-600" }
  ];

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-8 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">SDLC Process Overview</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered framework streamlines every phase of software development with specialized agents working in harmony
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative mb-12">
          {/* Main Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {processSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                  {/* Header */}
                  <div className={`${step.color} p-4 rounded-t-xl`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2">
                        <step.icon className="h-6 w-6" />
                        <span className="font-semibold">Phase {step.id}</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        8 Agents
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    
                    {/* Agents */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Key Agents
                      </h4>
                      <div className="space-y-1">
                        {step.agents.slice(0, 3).map((agent, i) => (
                          <div key={i} className="text-xs bg-gray-100 rounded px-2 py-1 flex items-center text-gray-700">
                            <Bot className="h-3 w-3 mr-1 text-gray-500" />
                            {agent}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outputs */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Outputs
                      </h4>
                      <div className="space-y-1">
                        {step.outputs.map((output, i) => (
                          <div key={i} className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-1">
                            {output}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow (except for last item) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
                      <ArrowRight className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Arrows */}
          <div className="md:hidden flex justify-center my-4">
            <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
          </div>
        </div>

        {/* AI Coordination Layer */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Orchestration Layer</h3>
            <p className="text-gray-700 mb-4 max-w-2xl mx-auto">
              Our central AI coordinator ensures seamless communication between all 32 agents, 
              maintaining context and optimizing workflow across all phases.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-indigo-100 text-indigo-800">Context Management</Badge>
              <Badge className="bg-purple-100 text-purple-800">Agent Coordination</Badge>
              <Badge className="bg-blue-100 text-blue-800">Quality Assurance</Badge>
              <Badge className="bg-green-100 text-green-800">Progress Tracking</Badge>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <benefit.icon className={`h-8 w-8 mx-auto mb-2 ${benefit.color}`} />
              <p className="text-sm font-medium text-gray-800">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* Final Outcome */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <Rocket className="h-12 w-12" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Production-Ready Solution</h3>
          <p className="text-white mb-4">
            Complete software solution delivered with documentation, tests, and deployment-ready code
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-white/20 text-white border-white/30">Fully Tested</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Documentation</Badge>
            <Badge className="bg-white/20 text-white border-white/30">CI/CD Ready</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Scalable</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessOverview;
