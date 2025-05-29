import { useState } from "react";
import { Plus, FileText, Code, Palette, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";

interface ArtifactManagerProps {
  currentPhase: string;
}

const phaseIcons = {
  requirements: FileText,
  design: Palette,
  development: Code,
  testing: TestTube,
};

const artifactTypes = {
  requirements: ["User Story", "Business Rule", "Technical Specification", "Requirements Document"],
  design: ["Wireframe", "Mockup", "System Architecture", "Database Schema", "UI Component"],
  development: ["Source Code", "API Endpoint", "Database Migration", "Configuration File"],
  testing: ["Test Case", "Bug Report", "Test Plan", "Quality Report"],
};

const ArtifactManager = ({ currentPhase }: ArtifactManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const { addArtifact, getArtifactsByPhase } = useWorkflow();
  const { toast } = useToast();

  const artifacts = getArtifactsByPhase(currentPhase);
  const Icon = phaseIcons[currentPhase as keyof typeof phaseIcons] || FileText;

  const handleAddArtifact = () => {
    if (!title.trim() || !type || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addArtifact({
      title: title.trim(),
      type,
      content: content.trim(),
      phase: currentPhase,
    });

    toast({
      title: "Artifact Created",
      description: `${type} "${title}" has been added to ${currentPhase}`,
    });

    setTitle("");
    setType("");
    setContent("");
    setIsOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Icon className="mr-2 h-5 w-5" />
            Phase Artifacts ({artifacts.length})
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Artifact
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Artifact</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter artifact title"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select artifact type" />
                    </SelectTrigger>
                    <SelectContent>
                      {artifactTypes[currentPhase as keyof typeof artifactTypes]?.map((artifactType) => (
                        <SelectItem key={artifactType} value={artifactType}>
                          {artifactType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter artifact content"
                    rows={6}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddArtifact} className="bg-green-600 hover:bg-green-700">
                    Create Artifact
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {artifacts.length > 0 ? (
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{artifact.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {artifact.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{artifact.content}</p>
                <div className="text-xs text-gray-400 mt-2">
                  Created: {new Date(artifact.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No artifacts created yet. Click "Add Artifact" to get started.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtifactManager;
