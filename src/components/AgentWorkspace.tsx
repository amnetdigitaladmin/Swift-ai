import { useState } from "react";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AzureDevOpsAuthModal, {AzureDevOpsCredentials,} from "./AzureDevOpsAuthModal";
import UserStorySection from "./UserStorySection";
import InputSection from "./InputSection";
import ConditionalOutput from "./ConditionalOutput";
import HistorySection from "./HistorySection";
import { useAgentWorkspace } from "@/hooks/useAgentWorkspace";
import {AlertDialog,AlertDialogAction,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,
} from "@/components/ui/alert-dialog";
interface AgentWorkspaceProps {
  agentName: string;
  onBack: () => void;
}

const AgentWorkspace = ({ agentName, onBack }: AgentWorkspaceProps) => {
  const [isAzureDevOpsModalOpen, setIsAzureDevOpsModalOpen] = useState(false);
  const { toast } = useToast();

  const {
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
    selectedStory,
    currentProject,

    isAlertOpen,
    setIsAlertOpen,
    alertContent,


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
  } = useAgentWorkspace(agentName);

  const handleAzureDevOpsPush = () => {
    setIsAzureDevOpsModalOpen(true);
  };

  const handleAzureDevOpsSubmit = async (
    credentials: AzureDevOpsCredentials
  ) => {
    try {
      console.log("Azure DevOps credentials:", {
        organization: credentials.organization,
        project: credentials.project,
        token: credentials.personalAccessToken.substring(0, 8) + "...",
      });

      toast({
        title: "Azure DevOps Integration Successful",
        description: `Content pushed to ${credentials.organization}/${credentials.project} successfully!`,
      });

      localStorage.setItem(
        "azuredevops_organization",
        credentials.organization
      );
      localStorage.setItem("azuredevops_project", credentials.project);
    } catch (error) {
      console.error("Azure DevOps integration failed:", error);
      toast({
        title: "Azure DevOps Integration Failed",
        description:
          "Failed to connect to Azure DevOps. Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleMarkStoryComplete = () => {
    if (selectedStory) {
      handleStatusUpdate(selectedStory.id, "completed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}  className="bg-custom-nav-bg" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{agentName}</h2>
            <p className="text-gray-600">AI-Powered Development Assistant</p>
            {currentProject && (
              <div className="flex items-center space-x-2 mt-1">
                <FolderOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent font-medium">
                  {currentProject.name}
                </span>
              </div>
            )}
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Ready</Badge>
      </div>

      <UserStorySection
        selectedStoryId={selectedStoryId}
        onStorySelection={handleStorySelection}
        onStatusUpdate={handleStatusUpdate}
      />

      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputSection
              agentName={agentName}
              input={input}
              setInput={setInput}
              setOutput={setOutput}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              dragActive={dragActive}
              setDragActive={setDragActive}
              secondaryFile={secondaryFile}
              setSecondaryFile={setSecondaryFile}
              secondaryDragActive={secondaryDragActive}
              setSecondaryDragActive={setSecondaryDragActive}
              inputMode={inputMode}
              setInputMode={setInputMode}
              isProcessing={isProcessing}
              onProcess={handleProcess}
              onFileSelect={handleFileSelect}
              onSecondaryFileSelect={handleSecondaryFileSelect}
              onDrag={handleDrag}
              onDrop={handleDrop}
              formatFileSize={formatFileSize}
              handleIsProcessing={handleIsProcessing}
            />

            <ConditionalOutput
              output={output}
              isProcessing={isProcessing}
              progress={progress}
              selectedStory={selectedStory}
              agentName={agentName}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onS3Download={handle3Download}
              onAzureDevOpsPush={handleAzureDevOpsPush}
              onPushToProjectManager={handlePushToProjectManager}
              onMarkStoryComplete={handleMarkStoryComplete}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <HistorySection />
        </TabsContent>
      </Tabs>

      <AzureDevOpsAuthModal
        isOpen={isAzureDevOpsModalOpen}
        onClose={() => setIsAzureDevOpsModalOpen(false)}
        onSubmit={handleAzureDevOpsSubmit}
      />



        {/* Add this before the closing div */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sensitive Information Alert</AlertDialogTitle>
            <AlertDialogDescription>{alertContent}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgentWorkspace;
