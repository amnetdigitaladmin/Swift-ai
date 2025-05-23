
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
    <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      isActive ? 'border-2 border-indigo-500 shadow-lg' : 
      isCompleted ? 'border-2 border-green-500 bg-green-50' : 
      'hover:border-indigo-300'
    }`} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              isCompleted ? 'bg-green-100' : 
              isActive ? 'bg-indigo-100' : 
              'bg-gray-100'
            }`}>
              <Icon className={`h-8 w-8 ${
                isCompleted ? 'text-green-600' : 
                isActive ? 'text-indigo-600' : 
                'text-gray-600'
              }`} />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">{agentCount} Agents</Badge>
                <Badge variant="outline">{estimatedTime}</Badge>
              </div>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400" />
        </div>
        <CardDescription className="text-gray-600 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={isActive ? "default" : isCompleted ? "secondary" : "outline"} 
          className="w-full"
        >
          {isCompleted ? 'Review Phase' : isActive ? 'Continue Phase' : 'Start Phase'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhaseCard;
