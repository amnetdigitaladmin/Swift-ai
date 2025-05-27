import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Lock, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (username: string, password: string, persona: string) => boolean;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("business-analyst");
  const [error, setError] = useState("");

  const personas = [
    {
      id: "business-analyst",
      title: "Business Analyst",
      description: "Focus on requirements analysis and business process optimization",
      phases: ["requirements"]
    },
    {
      id: "designer",
      title: "UI/UX Designer", 
      description: "Specialized in design and user experience workflows",
      phases: ["design"]
    },
    {
      id: "developer",
      title: "Developer",
      description: "Full-stack development and implementation focus",
      phases: ["development"]
    },
    {
      id: "qa-engineer",
      title: "QA Engineer",
      description: "Testing, quality assurance, and validation expertise",
      phases: ["testing"]
    },
    {
      id: "project-manager",
      title: "Project Manager",
      description: "Complete oversight of all development phases",
      phases: ["requirements", "design", "development", "testing"]
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Full system access with all agents and administrative capabilities",
      phases: ["requirements", "design", "development", "testing"]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (username && password && persona) {
      const success = onLogin(username, password, persona);
      if (!success) {
        setError("Invalid credentials. Please check your username and password.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/6d2ee624-da66-4058-bda5-573daec3e844.png" 
              alt="Swift AI Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Swift AI Login
          </CardTitle>
          <CardDescription className="text-gray-300">
            Expedite, Optimize, Realize - Sign in to access your AI-powered development workspace
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Persona Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-200">
                Select Your Role
              </Label>
              <RadioGroup
                value={persona}
                onValueChange={setPersona}
                className="space-y-3"
              >
                {personas.map((p) => (
                  <div key={p.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-600 bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                    <RadioGroupItem value={p.id} id={p.id} className="mt-1 border-gray-500 text-cyan-400" />
                    <div className="flex-1">
                      <Label htmlFor={p.id} className="font-medium text-gray-200 cursor-pointer">
                        {p.title}
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">{p.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 text-white"
              disabled={!username || !password}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
