import { useState, useEffect } from "react";
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
    document.addEventListener("dragenter", preventDefaultDragBehavior);
    document.addEventListener("dragover", preventDefaultDragBehavior);
    document.addEventListener("dragleave", preventDefaultDragBehavior);
    document.addEventListener("drop", preventDefaultDragBehavior);

    // Cleanup listeners when component unmounts
    return () => {
      document.removeEventListener("dragenter", preventDefaultDragBehavior);
      document.removeEventListener("dragover", preventDefaultDragBehavior);
      document.removeEventListener("dragleave", preventDefaultDragBehavior);
      document.removeEventListener("drop", preventDefaultDragBehavior);
    };
  }, []); // Empty dependency array since this effect should only run once

  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | object>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"type" | "upload">("type");

  const { toast } = useToast();
  const { user } = useUser();
  const {
    currentProject,
    addArtifact,
    getAssignedArtifacts,
    updateArtifactStatus,
  } = useWorkflow();

  const isBusinessAnalyst = user?.persona === "business-analyst";

  const assignedStories = currentProject
    ? getAssignedArtifacts(user?.username || "").filter(
        (task) =>
          task.projectId === currentProject.id && task.type === "User Story"
      )
    : [];

  const selectedStory = assignedStories.find(
    (story) => story.id === selectedStoryId
  );

  const handleStorySelection = (storyId: string) => {
    setSelectedStoryId(storyId);
    const story = assignedStories.find((s) => s.id === storyId);
    if (story) {
      setInput(
        `Working on User Story: ${story.title}\n\nStory Description:\n${story.content}\n\nDevelopment Requirements:\n`
      );
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

  const isSwiftCodeFrontend = agentName?.includes(
    "SwiftCode Frontend Developer"
  );

  const handleProcess = async () => {
    if (!input.trim() && !selectedFile) {
      toast({
        title: "Input Required",
        description: "Please provide some input or upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    if (isSwiftCodeFrontend) {
      // For SwiftCode Frontend Developer, simulate processing
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          // Set output to a non-empty string to trigger the file tree view
          setOutput("processed");
        }
      }, 1000); // Update every second for 10 seconds total
    } else {
      try {
        // Normal processing for other agents
        const response = await fetch("https://sewlzvr57rnjulvehobu2ienvu0ritqy.lambda-url.ap-south-1.on.aws/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input,
            file: selectedFile,
            template: selectedTemplate,
            agent: agentName,
          }),
        });

        if (!response.ok) {
          throw new Error("Processing failed");
        }

        const result = await response.json();

        // The API should return either an S3 URL directly or in a specific format
        // Example response: { output: "https://s3-url..." } or { s3_url: "https://s3-url..." }
        const s3Url = result.s3_url || result.output;

        if (
          s3Url &&
          typeof s3Url === "string" &&
          s3Url.includes("s3.amazonaws.com")
        ) {
          // If we got a valid S3 URL, use it
          setOutput(s3Url);
        } else {
          // Fallback to regular output if no S3 URL
          setOutput(result.output || "No output generated");
        }

        toast({
          title: "Processing Complete",
          description: "Your request has been processed successfully.",
        });
      } catch (error) {
        console.error("Processing error:", error);
        toast({
          title: "Processing Failed",
          description: "Failed to process your request. Please try again.",
          variant: "destructive",
        });
        // Set error output to show in the output section
        setOutput("Error processing request. Please try again.");
      } finally {
        setIsProcessing(false);
        setProgress(100);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInputMode("upload");
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
      setInputMode("upload");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof output === "string" ? output : JSON.stringify(output, null, 2)
    );
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const content =
      typeof output === "string" ? output : JSON.stringify(output, null, 2);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handle3Download = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "generated-file.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePushToProjectManager = () => {
    toast({
      title: "Pushed to Project Manager",
      description:
        "Content has been successfully pushed to the project manager.",
    });
  };

  const handleIsProcessing = (processing: boolean) => {
    setIsProcessing(processing);
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
    handle3Download,
    handlePushToProjectManager,
    formatFileSize,
    handleIsProcessing,
  };
};
