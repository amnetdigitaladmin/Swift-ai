import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface AgentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  onSelect: () => void;
}

const AgentCard = ({
  title,
  description,
  icon: Icon,
  features,
  onSelect,
}: AgentCardProps) => {
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-custom-bg border-gray-700 hover:border-ready-txt relative pb-[80px]">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-cyan-900/40 p-2 rounded-lg">
            <Icon className="h-6 w-6 text-ready-txt" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-100">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2">
              Key Features:
            </h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-400 flex items-center"
                >
                  <div className="w-1.5 h-1.5 bg-ready-txt rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-6 left-6 right-6">
        <Button
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-gradient-background-from to-gradient-background-to transition-all duration-300 text-black font-semibold"
        >
          Select Agent
        </Button>
      </div>
    </Card>
  );
};

export default AgentCard;
