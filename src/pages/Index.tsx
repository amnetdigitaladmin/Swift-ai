
import { useState } from "react";
import { FileText, Palette, Code, CheckCircle, ArrowRight, Users, Clock, Shield, Zap, Star, Play } from "lucide-react";
import Header from "@/components/Header";
import PhaseCard from "@/components/PhaseCard";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import RequirementsPhase from "./RequirementsPhase";
import DesignPhase from "./DesignPhase";
import DevelopmentPhase from "./DevelopmentPhase";
import TestingPhase from "./TestingPhase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Development",
      description: "Reduce development time by up to 75% with AI-powered automation across all SDLC phases."
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Built-in security best practices and compliance checks ensure your applications meet industry standards."
    },
    {
      icon: Users,
      title: "Collaborative AI Agents",
      description: "32 specialized AI agents work together seamlessly to deliver comprehensive software solutions."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Your AI development team never sleeps, providing continuous progress on your projects."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechFlow Solutions",
      content: "The SDLC Agentic Framework revolutionized our development process. We delivered our last project 60% faster with better quality.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Developer, InnovateLabs",
      content: "The AI agents handle the repetitive tasks perfectly, allowing our team to focus on creative problem-solving.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Product Manager, StartupXYZ",
      content: "From concept to deployment in record time. The quality and documentation generated is exceptional.",
      rating: 5
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🚀 Revolutionary AI-Powered SDLC
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Build Software at the Speed of Thought
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 leading-relaxed">
              Transform your development process with 32 AI agents that handle every phase of the software development lifecycle. 
              From requirements to deployment, experience unprecedented speed and quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-indigo-900 font-semibold px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">75%</div>
              <div className="text-gray-600">Faster Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
              <div className="text-gray-600">Quality Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">32</div>
              <div className="text-gray-600">AI Agents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of software development with AI agents that understand your needs and deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SDLC Phases Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete SDLC Coverage
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Our AI agents handle every phase of the software development lifecycle with precision and expertise. 
              Click on any phase to explore the specialized agents and capabilities.
            </p>
            <button 
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto group"
              onClick={() => setShowArchitecture(!showArchitecture)}
            >
              {showArchitecture ? 'Hide Architecture Diagram' : 'View Architecture Diagram'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
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

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what development teams around the world are saying about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Development Process?</h3>
          <p className="text-indigo-100 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of developers who have already revolutionized their workflow. 
            Start your journey with AI-powered software development today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-indigo-200">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-indigo-200">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-indigo-200">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm text-indigo-200">Customer Rating</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
