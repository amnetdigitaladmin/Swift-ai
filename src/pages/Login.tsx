import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Lock, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (username: string, password: string, persona: string) => boolean;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("architect");
  const [error, setError] = useState("");

  // Add refs to track the input elements
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Add useEffect to detect autofill - run only once on mount
  useEffect(() => {
    const checkAutofill = () => {
      if (usernameRef.current && passwordRef.current) {
        // Check if fields have been autofilled by checking their values
        if (usernameRef.current.value && !username) {
          setUsername(usernameRef.current.value);
        }
        if (passwordRef.current.value && !password) {
          setPassword(passwordRef.current.value);
        }
      }
    };

    // Check immediately
    checkAutofill();

    // Check after a short delay to catch autofill that happens after component mount
    const timeoutId = setTimeout(checkAutofill, 100);

    // Also listen for animation events that might indicate autofill
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName.includes("autofill")) {
        checkAutofill();
      }
    };

    document.addEventListener("animationstart", handleAnimationStart);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("animationstart", handleAnimationStart);
    };
  }, []); // Empty dependency array - run only once on mount

  const personas = [
    {
      id: "admin",
      title: "Administrator",
      description:
        "Full system access with all agents and administrative capabilities",
      phases: ["requirements", "design", "development", "testing"],
    },
    {
      id: "architect",
      title: "Architect",
      description: "System architecture and cross-team coordination",
      phases: ["requirements", "development", "testing"],
    },
    {
      id: "business-analyst",
      title: "Business Analyst",
      description:
        "Focus on requirements analysis and business process optimization",
      phases: ["requirements"],
    },
    {
      id: "developer",
      title: "Developer",
      description: "Full-stack development and implementation focus",
      phases: ["development"],
    },
    {
      id: "project-manager",
      title: "Project Manager",
      description: "Complete oversight of all development phases",
      phases: ["requirements", "design", "development", "testing"],
    },
    {
      id: "qa-engineer",
      title: "QA Engineer",
      description: "Testing, quality assurance, and validation expertise",
      phases: ["testing"],
    },
    {
      id: "designer",
      title: "UI/UX Designer",
      description: "Specialized in design and user experience workflows",
      phases: ["design"],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username && password && persona) {
      const success = onLogin(username, password, persona);
      if (!success) {
        setError(
          "Invalid credentials. Please check your username and password."
        );
      }
    }
  };

  const selectedPersona = personas.find((p) => p.id === persona);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6 relative overflow-hidden before:absolute before:w-[800px] before:h-[800px] before:-left-[300px] before:bottom-[-500px] before:rounded-full before:bg-emerald-400/10 before:blur-[120px]">
      <Card className="w-full max-w-md shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur-sm before:absolute before:w-[600px] before:h-[200px] before:-left-[200px] before:top-[-200px] before:rounded-full before:bg-emerald-400/10 before:blur-[120px]">
        <CardHeader className="text-center space-y-4 relative">
          <div className="flex justify-center">
            <img
              src="/Swift-ai-logo.svg"
              alt="Swift AI Logo"
              className="h-24 w-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white bg-clip-text">
            Log in to your account
          </CardTitle>
          <CardDescription className="text-gray-300">
            Expedite, Optimize, Realize - Sign in to access your AI-powered
            development workspace
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
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-200"
              >
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
                  className="pl-10 bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors [appearance:textfield]"
                  autoComplete="username"
                  required
                  ref={usernameRef}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
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
                  className="pl-10 bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors [appearance:textfield] [&::-webkit-credentials-auto-fill-button]:hidden [&:-webkit-autofill]:!bg-[#374151]/50 [&:-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(55,65,81,0.5)] [&:-webkit-autofill]:!text-[#fff] [-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff]"
                  autoComplete="current-password"
                  required
                  ref={passwordRef}
                />
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-200">
                Select Your Role
              </Label>
              <Select value={persona} onValueChange={setPersona}>
                <SelectTrigger className="bg-gray-700/50 border border-gray-600 text-white focus:border-2 focus:border-gradient-background-from outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors">
                  <SelectValue
                    placeholder="Choose your role"
                    className="outline-none focus:outline-none focus-visible:outline-none"
                  />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                  {personas.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="text-gray-200 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
              className="w-full bg-gradient-to-r from-gradient-background-from to-gradient-background-to hover:from-gradiant-background-from-hover hover:to-gradiant-background-to-hover transition-all duration-300 text-black font-semibold"
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
