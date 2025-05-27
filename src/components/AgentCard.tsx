
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface AgentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  complexity: "Basic" | "Intermediate" | "Advanced";
  aiModel: "GPT-4" | "Claude-3" | "GPT-3.5" | "Gemini";
  onSelect: () => void;
}

const AgentCard = ({ title, description, icon: Icon, features, complexity, aiModel, onSelect }: AgentCardProps) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Basic": return "bg-green-900/40 text-green-400 border-green-800";
      case "Intermediate": return "bg-yellow-900/40 text-yellow-400 border-yellow-800";
      case "Advanced": return "bg-red-900/40 text-red-400 border-red-800";
      default: return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case "GPT-4": return "bg-purple-900/40 text-purple-400 border-purple-800";
      case "Claude-3": return "bg-blue-900/40 text-blue-400 border-blue-800";
      case "GPT-3.5": return "bg-indigo-900/40 text-indigo-400 border-indigo-800";
      case "Gemini": return "bg-orange-900/40 text-orange-400 border-orange-800";
      default: return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gray-800/50 border-gray-700 hover:border-cyan-400">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-900/40 p-2 rounded-lg">
              <Icon className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-100">{title}</CardTitle>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getComplexityColor(complexity)}>{complexity}</Badge>
            <Badge className={getModelColor(aiModel)}>{aiModel}</Badge>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-400 flex items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button 
            onClick={onSelect} 
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 text-white"
          >
            Select Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
