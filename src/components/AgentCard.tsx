
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
      case "Basic": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case "GPT-4": return "bg-purple-100 text-purple-800";
      case "Claude-3": return "bg-blue-100 text-blue-800";
      case "GPT-3.5": return "bg-indigo-100 text-indigo-800";
      case "Gemini": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-indigo-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Icon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={getComplexityColor(complexity)}>{complexity}</Badge>
            <Badge className={getModelColor(aiModel)}>{aiModel}</Badge>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button 
            onClick={onSelect} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Select Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
