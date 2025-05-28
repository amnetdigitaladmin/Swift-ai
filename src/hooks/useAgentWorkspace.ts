
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";

export const useAgentWorkspace = (agentName: string) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [inputMode, setInputMode] = useState<"type" | "upload">("type");
  
  const { toast } = useToast();
  const { user } = useUser();
  const { currentProject, addArtifact, getAssignedArtifacts, updateArtifactStatus } = useWorkflow();

  const isBusinessAnalyst = user?.persona === "business-analyst";

  const assignedStories = currentProject 
    ? getAssignedArtifacts(user?.username || "").filter(task => 
        task.projectId === currentProject.id && task.type === "User Story"
      )
    : [];

  const selectedStory = assignedStories.find(story => story.id === selectedStoryId);

  const handleStorySelection = (storyId: string) => {
    setSelectedStoryId(storyId);
    const story = assignedStories.find(s => s.id === storyId);
    if (story) {
      setInput(`Working on User Story: ${story.title}\n\nStory Description:\n${story.content}\n\nDevelopment Requirements:\n`);
      toast({
        title: "User Story Selected",
        description: "Story details have been loaded into the workspace",
      });
    }
  };

  const handleStatusUpdate = (storyId: string, newStatus: string) => {
    updateArtifactStatus(storyId, newStatus);
    toast({
      title: "Status Updated",
      description: `Story status updated to ${newStatus}`,
    });
  };

  const handleProcess = async () => {
    if (isBusinessAnalyst && inputMode === "upload") {
      if (!selectedFile) {
        toast({
          title: "Document Required",
          description: "Please upload a requirements document to process.",
          variant: "destructive",
        });
        return;
      }
    } else if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide input for the agent to process.",
        variant: "destructive",
      });
      return;
    }

    if (selectedStoryId && selectedStory?.status === "assigned") {
      handleStatusUpdate(selectedStoryId, "in-progress");
    }

    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      let outputText = `${agentName} Generated Code:

Based on your ${inputMode === "upload" ? `uploaded document: "${selectedFile?.name}"` : `input: "${input.substring(0, 100)}..."`}`;

      if (selectedTemplate) {
        outputText += `\nUsing template: ${selectedTemplate}`;
      }

      if (inputMode === "upload" && selectedFile) {
        outputText += `\n\nDocument Analysis:
- File: ${selectedFile.name}
- Size: ${formatFileSize(selectedFile.size)}
- Processed requirements from uploaded document`;
      }

      if (selectedStory) {
        outputText += `\n\nUser Story Context:
Title: ${selectedStory.title}
Description: ${selectedStory.content}`;
      }

      if (selectedFile) {
        outputText += `\n\nDocument processed: ${selectedFile.name}`;
      }

      outputText += `

Generated Code Implementation:

// Frontend Component (React)
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeneratedComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize component
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // API call implementation
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Implementation based on user story requirements</p>
            <Button onClick={fetchData}>Refresh Data</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedComponent;

// API Endpoint (Backend)
export async function GET(request: Request) {
  try {
    // Implementation logic based on user story
    const data = await processUserStoryRequirements();
    
    return Response.json({
      success: true,
      data: data
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Database Schema (if needed)
CREATE TABLE user_story_data (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// Test Cases
describe('Generated Component', () => {
  test('should render without crashing', () => {
    render(<GeneratedComponent />);
    expect(screen.getByText('Generated Feature')).toBeInTheDocument();
  });

  test('should fetch data on mount', async () => {
    render(<GeneratedComponent />);
    await waitFor(() => {
      expect(screen.getByText('Implementation based on user story requirements')).toBeInTheDocument();
    });
  });
});

This is AI-generated code based on your user story requirements. The implementation includes:
- Responsive React component with proper TypeScript typing
- Backend API endpoint structure
- Database schema considerations
- Basic test cases
- Error handling and loading states
- Integration with your existing UI components

Next steps:
1. Review the generated code
2. Adapt it to your specific requirements
3. Test the implementation
4. Deploy to your development environment`;

      setOutput(outputText);
      setIsProcessing(false);
      toast({
        title: "Code Generation Complete",
        description: `${agentName} has successfully generated code for your user story.`,
      });
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to Clipboard",
      description: "Output has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentName.toLowerCase().replace(/\s+/g, '-')}-output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: "Output file has been downloaded.",
    });
  };

  const handlePushToProjectManager = () => {
    if (!output.trim() || !currentProject) {
      toast({
        title: "Cannot Push to Project Manager",
        description: "No output generated or no project selected.",
        variant: "destructive",
      });
      return;
    }

    const isStoryGenerator = agentName.toLowerCase().includes("story generator");
    
    if (isStoryGenerator) {
      const storyLines = output.split('\n').filter(line => 
        line.trim().startsWith('-') || 
        line.trim().startsWith('*') || 
        line.toLowerCase().includes('user story') ||
        line.toLowerCase().includes('as a')
      );

      if (storyLines.length > 0) {
        storyLines.forEach((story, index) => {
          if (story.trim()) {
            addArtifact({
              title: `User Story ${index + 1}: ${story.substring(0, 50)}...`,
              type: "User Story",
              content: story.trim(),
              phase: "requirements"
            });
          }
        });

        toast({
          title: "Stories Pushed to Project Manager",
          description: `${storyLines.length} user stories have been created and are now available for assignment.`,
        });
      } else {
        addArtifact({
          title: `${agentName} Output`,
          type: "Analysis Document",
          content: output,
          phase: "requirements"
        });

        toast({
          title: "Content Pushed to Project Manager",
          description: "Generated content has been added to the project for review and assignment.",
        });
      }
    } else {
      addArtifact({
        title: `${agentName} Output`,
        type: "Analysis Document", 
        content: output,
        phase: "requirements"
      });

      toast({
        title: "Content Pushed to Project Manager",
        description: "Generated content has been added to the project for review.",
      });
    }
  };

  return {
    // State
    input,
    setInput,
    output,
    isProcessing,
    progress,
    selectedTemplate,
    setSelectedTemplate,
    selectedFile,
    setSelectedFile,
    dragActive,
    setDragActive,
    selectedStoryId,
    inputMode,
    setInputMode,
    assignedStories,
    selectedStory,
    isBusinessAnalyst,
    currentProject,
    
    // Handlers
    handleStorySelection,
    handleStatusUpdate,
    handleProcess,
    handleFileSelect,
    handleDrag,
    handleDrop,
    handleCopy,
    handleDownload,
    handlePushToProjectManager,
    formatFileSize
  };
};
