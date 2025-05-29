
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Copy, Download, Cloud, Users, CheckCircle, RefreshCw } from "lucide-react";

interface OutputSectionProps {
  output: string;
  isProcessing: boolean;
  progress: number;
  selectedStory: any;
  agentName?: string;
  onCopy: () => void;
  onDownload: () => void;
  onAzureDevOpsPush: () => void;
  onPushToProjectManager: () => void;
  onMarkStoryComplete: () => void;
}

const OutputSection = ({
  output,
  isProcessing,
  progress,
  selectedStory,
  agentName,
  onCopy,
  onDownload,
  onAzureDevOpsPush,
  onPushToProjectManager,
  onMarkStoryComplete
}: OutputSectionProps) => {
  const isRequirementsAgent = agentName?.toLowerCase().includes('swiftplan');
  const outputTitle = isRequirementsAgent ? "Generated Output" : "Generated Code Output";
  const outputDescription = isRequirementsAgent ? "AI-generated analysis and documentation" : "AI-generated code and implementation";
  const processingMessage = isRequirementsAgent 
    ? "AI is generating analysis for your requirements..." 
    : "AI is generating code for your user story...";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{outputTitle}</CardTitle>
        <CardDescription>{outputDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">{processingMessage}</p>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 text-center">{Math.round(progress)}% complete</p>
          </div>
        ) : (
          <>
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] bg-gray-800 text-gray-100 border-gray-600 font-mono text-xs"
              placeholder={isRequirementsAgent ? "AI-generated analysis will appear here..." : "AI-generated code will appear here..."}
            />
            {output && (
              <div className="flex items-center space-x-2 mt-4 flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={onCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={onAzureDevOpsPush}>
                  <Cloud className="h-4 w-4 mr-2" />
                  Push to Azure DevOps
                </Button>
                <Button variant="outline" size="sm" onClick={onPushToProjectManager}>
                  <Users className="h-4 w-4 mr-2" />
                  Push to Project Manager
                </Button>
                {selectedStory && selectedStory.status !== "completed" && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={onMarkStoryComplete}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Story Complete
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OutputSection;
