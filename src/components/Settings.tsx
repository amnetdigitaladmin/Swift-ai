
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
    "business-analyst": "gpt-4",
    "designer": "gpt-4",
    "developer": "claude",
    "qa-engineer": "gemini",
    "project-manager": "gpt-4"
  });

  const roles = [
    { id: "business-analyst", name: "Business Analyst" },
    { id: "designer", name: "UI/UX Designer" },
    { id: "developer", name: "Developer" },
    { id: "qa-engineer", name: "QA Engineer" },
    { id: "project-manager", name: "Project Manager" }
  ];

  const llmOptions = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gemini", label: "Gemini" },
    { value: "claude", label: "Claude" }
  ];

  const handleLlmChange = (roleId: string, llm: string) => {
    setLlmAssignments(prev => ({
      ...prev,
      [roleId]: llm
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings Saved",
      description: "LLM assignments have been updated successfully.",
    });
  };

  if (user?.persona !== "admin") {
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
                Additional settings are available to administrators only.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Administrator Settings</CardTitle>
          <CardDescription className="text-gray-600">Manage system configuration and LLM assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block text-gray-900">LLM Assignments by Role</Label>
            <p className="text-sm text-gray-600 mb-4">
              Assign specific Large Language Models to each role for optimized performance.
            </p>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div>
                    <Label className="font-medium text-gray-900">{role.name}</Label>
                  </div>
                  <div className="w-48">
                    <Select
                      value={llmAssignments[role.id as keyof typeof llmAssignments]}
                      onValueChange={(value) => handleLlmChange(role.id, value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 z-50">
                        {llmOptions.map((llm) => (
                          <SelectItem key={llm.value} value={llm.value} className="text-gray-900 hover:bg-gray-100">
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
          
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
