
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const selectedPersona = personas.find(p => p.id === persona);

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

            {/* Role Selection Dropdown */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-200">
                Select Your Role
              </Label>
              <Select value={persona} onValueChange={setPersona}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {personas.map((p) => (
                    <SelectItem 
                      key={p.id} 
                      value={p.id}
                      className="text-gray-200 focus:bg-gray-700 focus:text-white"
                    >
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPersona && (
                <p className="text-xs text-gray-400 mt-2">
                  {selectedPersona.description}
                </p>
              )}
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
