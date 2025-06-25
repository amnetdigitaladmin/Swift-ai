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
  // primary file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  // secondary file upload
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [secondaryDragActive, setSecondaryDragActive] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"type" | "upload">("type");
  const [showOutput, setShowOutput] = useState(false);
  const [parallelLLMMode, setParallelLLMMode] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();
  const {
    currentProject,
    addArtifact,
    getAssignedArtifacts,
    updateArtifactStatus,
  } = useWorkflow();

  const agentConfigs: Record<string, { endpoint: string }> = {
    "SwiftPlan Business Analyst": {
      endpoint:
        "https://sewlzvr57rnjulvehobu2ienvu0ritqy.lambda-url.ap-south-1.on.aws/",
    },
    "SwiftBuild Frontend": {
      endpoint:
        "https://c3677yvqbobzen7zfwoxy7ybjq0qletv.lambda-url.ap-south-1.on.aws/",
    },
    "SwiftBuild Backend": {
      endpoint:
        "https://smi25q3swrw3aprk2h3ccr7tri0mdflr.lambda-url.ap-south-1.on.aws/",
    },
    "SwiftTest Automated Generator": {
      endpoint:
        "https://jfvhzql6k7pcrl3vrlmyk26g2a0jqwzy.lambda-url.ap-south-1.on.aws/",
    },
    "SwiftPlan Technical Engineer": {
      endpoint:
        "https://xnerzmxfx2i4mdklh2b4jzfwsm0arbze.lambda-url.ap-south-1.on.aws/",
    },
  };
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

  const getFirstURLFromApiResult: (apiResult: Record<string, any>) => string[] | null = (apiResult) => {
  const urls: string[] = [];
  if (!apiResult || typeof apiResult !== 'object') return urls;

  for (const [key, value] of Object.entries(apiResult)) {
    if (key.toLowerCase().includes('url') && typeof value === 'string') {
      urls.push(value);
    }
  }

  return urls;
} 

  const isSwiftCodeFrontend = agentName?.includes("SwiftBuild Frontend");
  const isSwiftCodeBackend = agentName?.includes("SwiftBuild Backend");
  const isSwiftPlanTechnicalEngineer = agentName?.includes(
    "SwiftPlan Technical Engineer"
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
    const config = agentConfigs[agentName];
    if (isSwiftCodeFrontend || isSwiftCodeBackend) {
      try {
        if (selectedFile) {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);

          let devtype = isSwiftCodeFrontend ? "frontend" : "backend";

          reader.onload = async () => {
            try {
              const fileResult = reader.result as string;
              const base64Content = fileResult.split(",")[1];

              const payload = {
                file: {
                  filename: selectedFile.name.replace(/\.[^/.]+$/, ""),
                  content: base64Content,
                  extension: selectedFile.name.split(".").pop(),
                },
                model_name: "openai",
                dev_type: devtype,
                pages_per_chunk: 3,
                enable_parallel_llm:parallelLLMMode
              };
              const response = await fetch(config.endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                throw new Error("Processing failed");
              }

              const apiResult = await response.json();
              // console.log(apiResult.result.result)
              // API should return file structure data

              setOutput(isSwiftCodeFrontend ? apiResult.result : apiResult);
              setShowOutput(true);
            } catch (error) {
              // Handle errors
              console.error("API error:", error);
              toast({
                title: "Processing Failed",
                description:
                  "Failed to process your request. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsProcessing(false);
              setProgress(100);
            }
          };

          reader.onerror = () => {
            // Handle file reading errors
            console.error("File reading error:", reader.error);
            toast({
              title: "File Reading Failed",
              description: "Failed to read the file. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
            setProgress(0);
          };
        }
      } catch (error) {
        // Handle any other errors
      }
    } else if (isSwiftPlanTechnicalEngineer) {
      try {
        if (!selectedFile) {
          throw new Error("No file selected");
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);

        reader.onload = async () => {
          try {
            const fileResult = reader.result as string;
            const base64Content = fileResult.split(",")[1];

            // Define the type for the payload
            interface FilePayload {
              filename: string;
              content: string;
              extension: string | undefined;
            }

            interface Payload {
              file: FilePayload;
              template?: FilePayload; // Make template optional
              fe?: FilePayload; // Add dummy file 1
              be?: FilePayload; // Add dummy file 2
            }

            const payload: Payload = {
              file: {
                filename: selectedFile.name.replace(/\.[^/.]+$/, ""),
                content: base64Content,
                extension: selectedFile.name.split(".").pop(),
              },
            };

            // If there's a secondary file, add it to the payload
            if (secondaryFile) {
              const secondaryReader = new FileReader();
              secondaryReader.readAsDataURL(secondaryFile);

              // Convert the secondary file reading to a Promise
              const secondaryBase64Content = await new Promise<string>(
                (resolve, reject) => {
                  secondaryReader.onload = () => {
                    const secondaryResult = secondaryReader.result as string;
                    resolve(secondaryResult.split(",")[1]);
                  };
                  secondaryReader.onerror = reject;
                }
              );

              // Add the secondary file to the payload
              payload.template = {
                filename: secondaryFile.name.replace(/\.[^/.]+$/, ""),
                content: secondaryBase64Content,
                extension: secondaryFile.name.split(".").pop(),
              };
            }

            // Add two dummy files to the payload
            const dummyFile1Content = btoa(""); // Empty content
            const dummyFile2Content = btoa(""); // Empty content

            payload.fe = {
              filename: "dummy_file_1",
              content: dummyFile1Content,
              extension: "docx",
            };

            payload.be = {
              filename: "dummy_file_2",
              content: dummyFile2Content,
              extension: "docx",
            };

            const response = await fetch(config.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              throw new Error("Processing failed");
            }

            const apiResult = await response.json();

            if (
              apiResult.sensitive_info_status &&
              apiResult.sensitive_info_status !== ""
            ) {
              setAlertContent(apiResult.sensitive_info_status);
              setIsAlertOpen(true);
            }

            // const downloadedFileURL = getFirstURLFromApiResult(apiResult.url);ap
            if(apiResult.url){
              setOutput(apiResult.url);
              toast({
                title: "Processing Complete",
                description: "Your request has been processed successfully.",
              });
            } else {
               throw new Error("Invalid response format");
            }
          } catch (error) {
            console.error("API error:", error);
            toast({
              title: "Processing Failed",
              description: "Failed to process your request. Please try again.",
              variant: "destructive",
            });
            // setOutput("Error processing request. Please try again.");
          } finally {
            setIsProcessing(false);
            setProgress(100);
          }
        };

        reader.onerror = () => {
          console.error("File reading error:", reader.error);
          toast({
            title: "File Reading Failed",
            description: "Failed to read the file. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
          setProgress(0);
          setOutput("Error reading file. Please try again.");
        };
      } catch (error) {
        console.error("Process error:", error);
        toast({
          title: "Processing Failed",
          description: "Failed to process your request. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        setProgress(0);
        setOutput("Error processing request. Please try again.");
      }
    } else {
      try {
        if (!selectedFile) {
          throw new Error("No file selected");
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);

        reader.onload = async () => {
          try {
            const fileResult = reader.result as string;
            const base64Content = fileResult.split(",")[1];

            // Define the type for the payload
            interface FilePayload {
              filename: string;
              content: string;
              extension: string | undefined;
            }

            interface Payload {
              file: FilePayload;
              template?: FilePayload; // Make template optional
            }

            const payload: Payload = {
              file: {
                filename: selectedFile.name.replace(/\.[^/.]+$/, ""),
                content: base64Content,
                extension: selectedFile.name.split(".").pop(),
              },
            };

            // If there's a secondary file, add it to the payload
            if (secondaryFile) {
              const secondaryReader = new FileReader();
              secondaryReader.readAsDataURL(secondaryFile);

              // Convert the secondary file reading to a Promise
              const secondaryBase64Content = await new Promise<string>(
                (resolve, reject) => {
                  secondaryReader.onload = () => {
                    const secondaryResult = secondaryReader.result as string;
                    resolve(secondaryResult.split(",")[1]);
                  };
                  secondaryReader.onerror = reject;
                }
              );

              // Add the secondary file to the payload
              payload.template = {
                filename: secondaryFile.name.replace(/\.[^/.]+$/, ""),
                content: secondaryBase64Content,
                extension: secondaryFile.name.split(".").pop(),
              };
            }

            const response = await fetch(config.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              throw new Error("Processing failed");
            }

            const apiResult = await response.json();

            if (
              apiResult.sensitive_info_status &&
              apiResult.sensitive_info_status !== ""
            ) {
              setAlertContent(apiResult.sensitive_info_status);
              setIsAlertOpen(true);
            }

            // The Lambda function should return a URL in the response
            if (
              apiResult &&
              (apiResult.docx_download_url || apiResult.excel_download_url)
            ) {
              let downloadedFileURL = apiResult.docx_download_url
                ? apiResult.docx_download_url
                : apiResult.excel_download_url;
              setOutput({'Download File':downloadedFileURL});
              toast({
                title: "Processing Complete",
                description: "Your request has been processed successfully.",
              });
            } else {
              throw new Error("Invalid response format");
            }
          } catch (error) {
            console.error("API error:", error);
            toast({
              title: "Processing Failed",
              description: "Failed to process your request. Please try again.",
              variant: "destructive",
            });
            // setOutput("Error processing request. Please try again.");
          } finally {
            setIsProcessing(false);
            setProgress(100);
          }
        };

        reader.onerror = () => {
          console.error("File reading error:", reader.error);
          toast({
            title: "File Reading Failed",
            description: "Failed to read the file. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
          setProgress(0);
          setOutput("Error reading file. Please try again.");
        };
      } catch (error) {
        console.error("Process error:", error);
        toast({
          title: "Processing Failed",
          description: "Failed to process your request. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        setProgress(0);
        setOutput("Error processing request. Please try again.");
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

  const handleSecondaryFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSecondaryFile(file);
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

  const handle3Download = (url: string) => {
    if (!url) return;

    // Extract filename from URL (strip query parameters)
    const urlParts = url.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const [filename] = lastPart.split("?");

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "downloaded-file");
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your file is being downloaded.",
      duration: 5000,
    });
  };

  const handlePushToProjectManager = () => {
    toast({
      title: "Pushed to Git",
      description: "Content has been successfully pushed to Git.",
    });
  };

  const handleIsProcessing = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const handleFullScreen = () => {
    setShowOutput((prev) => !prev);
  };

  return {
    // State
    input,
    setInput,
    output,
    setOutput,
    isProcessing,
    progress,
    selectedTemplate,
    setSelectedTemplate,
    selectedFile,
    setSelectedFile,
    dragActive,
    setDragActive,
    secondaryFile,
    setSecondaryFile,
    secondaryDragActive,
    setSecondaryDragActive,
    selectedStoryId,
    inputMode,
    setInputMode,
    assignedStories,
    selectedStory,
    isBusinessAnalyst,
    currentProject,
    parallelLLMMode,
    setParallelLLMMode,

    isAlertOpen,
    setIsAlertOpen,
    alertContent,
    setAlertContent,

    showOutput,
    handleFullScreen,

    // Handlers
    handleStorySelection,
    handleStatusUpdate,
    handleProcess,
    handleFileSelect,
    handleSecondaryFileSelect,
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
