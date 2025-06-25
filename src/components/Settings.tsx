
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [llmAssignments, setLlmAssignments] = useState({
    "requirements": "gpt-4",
    "design": "gpt-4",
    "development": "claude",
    "testing": "gemini"
  });

  const phases = [
    { id: "requirements", name: "Requirements Analysis" },
    { id: "design", name: "Design & Architecture" },
    { id: "development", name: "Development & Implementation" },
    { id: "testing", name: "Testing & Quality Assurance" }
  ];

  const llmOptions = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gemini", label: "Gemini" },
    { value: "claude", label: "Claude" }
  ];

  const handleLlmChange = (phaseId: string, llm: string) => {
    setLlmAssignments(prev => ({
      ...prev,
      [phaseId]: llm
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings Saved",
      description: "LLM assignments have been updated successfully.",
    });
  };

  if (user?.persona !== "architect") {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Settings</CardTitle>
            <CardDescription className="text-gray-600">User preferences and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium text-gray-800">Current Role</Label>
                  <p className="text-sm text-gray-600 mt-1">Your assigned role and permissions</p>
                </div>
                <Badge variant="secondary">{user?.persona}</Badge>
              </div>
              <div className="text-sm text-gray-500">
                Advanced settings are available to architects only.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-custom-bg">
        <CardHeader>
          <CardTitle className="text-white">Model Settings</CardTitle>
          <CardDescription className="text-gray-600">Configure LLM assignments for different SDLC phases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block text-white">LLM Assignments by Phase</Label>
            <p className="text-sm text-gray-600 mb-4">
              Assign specific Large Language Models to each SDLC phase for optimized performance across your architecture workflow.
            </p>
            <div className="space-y-4">
              {phases.map((phase) => (
                <div key={phase.id} className="flex items-center justify-between p-3 border border-custom-tab_border rounded-lg bg-custom-bg shadow-sm">
                  <div>
                    <Label className="font-medium text-white">{phase.name}</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {phase.id === "requirements" && "Business analysis, stakeholder mapping, and requirement gathering"}
                      {phase.id === "design" && "System architecture, UI/UX design, and technical specifications"}
                      {phase.id === "development" && "Code generation, implementation, and development best practices"}
                      {phase.id === "testing" && "Quality assurance, testing strategies, and validation"}
                    </p>
                  </div>
                  <div className="w-48">
                    <Select
                      value={llmAssignments[phase.id as keyof typeof llmAssignments]}
                      onValueChange={(value) => handleLlmChange(phase.id, value)}
                    >
                      <SelectTrigger className="bg-custom-bg border-custom-tab_border text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-custom-bg border-custom-tab_border z-50">
                        {llmOptions.map((llm) => (
                          <SelectItem key={llm.value} value={llm.value} className="text-white hover:bg-gray-100">
                            {llm.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-ready-bg border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Model Recommendations</h4>
            <ul className="text-sm text-gray-500  space-y-1">
              <li>• <strong>GPT-4:</strong> Best for complex reasoning and business analysis</li>
              <li>• <strong>Claude:</strong> Excellent for code generation and technical documentation</li>
              <li>• <strong>Gemini:</strong> Strong performance in testing scenarios and quality assurance</li>
            </ul>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to text-black font-semibold">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
