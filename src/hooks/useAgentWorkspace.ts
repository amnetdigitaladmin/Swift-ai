
import { useState,useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";

export const useAgentWorkspace = (agentName: string) => {

   // Add this useEffect to handle document-level drag and drop
  useEffect(() => {
    // Prevent default drag behaviors at document level
    const preventDefaultDragBehavior = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add listeners to document
    document.addEventListener('dragenter', preventDefaultDragBehavior);
    document.addEventListener('dragover', preventDefaultDragBehavior);
    document.addEventListener('dragleave', preventDefaultDragBehavior);
    document.addEventListener('drop', preventDefaultDragBehavior);

    // Cleanup listeners when component unmounts
    return () => {
      document.removeEventListener('dragenter', preventDefaultDragBehavior);
      document.removeEventListener('dragover', preventDefaultDragBehavior);
      document.removeEventListener('dragleave', preventDefaultDragBehavior);
      document.removeEventListener('drop', preventDefaultDragBehavior);
    };
  }, []); // Empty dependency array since this effect should only run once


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


  const uploadFileToBackend = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = async () => {
      const result = reader.result as string;

      // Extract base64 content (removes the data:...;base64, prefix)
      const base64Content = result.split(',')[1];

      const payload = {
        file: {
          filename: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove extension from filename
          content: base64Content,
          extension: selectedFile.name.split('.').pop()
        }
      };

      try {
        const response = await fetch("https://sewlzvr57rnjulvehobu2ienvu0ritqy.lambda-url.ap-south-1.on.aws/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Backend response:", data);

        setOutput(data); // can be a URL or full text
        setIsProcessing(false);


        toast({
          title: "Upload Successful",
          description: "Your file has been uploaded and processed by the backend.",
        });

        return data;
      } catch (error) {
        console.error("Upload failed:", error);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading the file.",
          variant: "destructive",
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "File Read Error",
        description: "Could not read the file. Please try again.",
        variant: "destructive",
      });
    };
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

    await uploadFileToBackend();
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

  const handle3Download = (url: string) => {
  if (!url) return;

  // Extract filename from URL (strip query parameters)
  const urlParts = url.split('/');
  const lastPart = urlParts[urlParts.length - 1];
  const [filename] = lastPart.split('?');

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || 'downloaded-file');
  link.setAttribute('target', '_blank');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast({
    title: "Download Started",
    description: "Your file is being downloaded.",
    duration: 5000
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

  const handleIsProcessing=(processing:boolean)=>{
   setOutput("");
  }

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
    handle3Download,
    handlePushToProjectManager,
    formatFileSize,
    handleIsProcessing
  };
};
