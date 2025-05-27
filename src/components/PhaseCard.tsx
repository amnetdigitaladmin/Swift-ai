
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, ArrowRight } from "lucide-react";

interface PhaseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  agentCount: number;
  estimatedTime: string;
  onClick: () => void;
  isCompleted?: boolean;
  isActive?: boolean;
}

const PhaseCard = ({ 
  title, 
  description, 
  icon: Icon, 
  agentCount, 
  estimatedTime, 
  onClick, 
  isCompleted = false,
  isActive = false 
}: PhaseCardProps) => {
  return (
    <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gray-800/50 border-gray-700 ${
      isActive ? 'border-2 border-cyan-500 shadow-lg shadow-cyan-500/20' : 
      isCompleted ? 'border-2 border-green-500 bg-green-900/20 shadow-lg shadow-green-500/20' : 
      'hover:border-cyan-400'
    }`} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              isCompleted ? 'bg-green-900/40' : 
              isActive ? 'bg-cyan-900/40' : 
              'bg-gray-700/40'
            }`}>
              <Icon className={`h-8 w-8 ${
                isCompleted ? 'text-green-400' : 
                isActive ? 'text-cyan-400' : 
                'text-gray-300'
              }`} />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-100">{title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">{agentCount} Agents</Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">{estimatedTime}</Badge>
              </div>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400" />
        </div>
        <CardDescription className="text-gray-300 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={isActive ? "default" : isCompleted ? "secondary" : "outline"} 
          className={`w-full ${
            isActive ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white' :
            isCompleted ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' :
            'border-gray-600 text-gray-200 hover:bg-gray-800'
          }`}
        >
          {isCompleted ? 'Review Phase' : isActive ? 'Continue Phase' : 'Start Phase'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhaseCard;
