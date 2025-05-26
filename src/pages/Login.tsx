
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Lock, Users } from "lucide-react";

interface LoginProps {
  onLogin: (username: string, password: string, persona: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("business-analyst");

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
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && persona) {
      onLogin(username, password, persona);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            SDLC Agentic Login
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to access your personalized AI agent workspace
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
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
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Persona Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Select Your Role
              </Label>
              <RadioGroup
                value={persona}
                onValueChange={setPersona}
                className="space-y-3"
              >
                {personas.map((p) => (
                  <div key={p.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={p.id} id={p.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={p.id} className="font-medium text-gray-900 cursor-pointer">
                        {p.title}
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">{p.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
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
