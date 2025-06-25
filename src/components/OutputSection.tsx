import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Copy,
  Download,
  Cloud,
  Users,
  CheckCircle,
  RefreshCw,
  GitBranch,
} from "lucide-react";

interface OutputSectionProps {
  output: string | { docx_download_url?: string; [key: string]: any };
  isProcessing: boolean;
  progress: number;
  selectedStory: any;
  agentName?: string;
  onCopy: () => void;
  onDownload: () => void;
  onS3Download: (url: string) => void;
  onAzureDevOpsPush: () => void;
  onPushToProjectManager: () => void;
  onMarkStoryComplete: () => void;
}

const getS3UrlFromOutput = (output: string | object): string[] => {
  const urls: string[] = [];

  // If output is a string and looks like an S3 URL
  if (
    typeof output === "string" &&
    (output.includes("s3.amazonaws.com") || output.includes("lambda-url"))
  ) {
    urls.push(output);
  }

  // If output is an object with url property (from Lambda)
  if (typeof output === "object" && output !== null) {
    if (Array.isArray(output)) {
      // Handle array of URLs
      output.forEach((u: any) => {
        if (typeof u === "string") {
          urls.push(u);
        }
      });
    }
  }

  return urls;
};

const OutputSection = ({
  output,
  isProcessing,
  progress,
  selectedStory,
  agentName,
  onCopy,
  onDownload,
  onS3Download,
  onAzureDevOpsPush,
  onPushToProjectManager,
  onMarkStoryComplete,
}: OutputSectionProps) => {
  let s3Urls = getS3UrlFromOutput(output);
  const isRequirementsAgent = agentName?.toLowerCase().includes("swiftplan");
  const outputTitle = isRequirementsAgent
    ? "Generated Output"
    : "Generated Code Output";
  const outputDescription = isRequirementsAgent
    ? "AI-generated analysis and documentation"
    : "AI-generated code and implementation";
  const processingMessage = isRequirementsAgent
    ? "AI is generating analysis for your requirements..."
    : "AI is generating code for your user story...";

  return (
    <Card className="shadow-md bg-custom-bg">
      <CardContent className="p-6 space-y-4">
        {isProcessing ? (
          <div className="h-[600px] flex flex-col items-center justify-center">
            <div className="text-center py-8">
              {/* <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-ready-txt" /> */}
              <img
                src="/workflow_loader.gif"
                alt="Loading"
                className="h-16 w-16 mx-auto"
              />
              <p className="text-gray-600">{processingMessage}</p>
              {progress > 0 && (
                <div className="w-64 mt-4">
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </div>
        ) : s3Urls.length > 0 ? (
          <div className="h-[600px] flex flex-col items-center justify-center">
            <div className="text-center py-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Generated Files ({s3Urls.length})
              </h3>
              <div className="space-y-3">
                {s3Urls.map((url, index) => (
                  <Button
                    key={index}
                    onClick={() => onS3Download(url)}
                    className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to text-black generate-button-text text-base w-full max-w-md"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download File {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="p-0">
              <CardTitle>{outputTitle}</CardTitle>
              <CardDescription>{outputDescription}</CardDescription>
            </CardHeader>
            <Textarea
              value={typeof output === "string" ? output : ""}
              readOnly
              className="min-h-[300px] bg-custom-bg text-gray-100 border-gray-600 font-mono text-xs"
              placeholder={
                isRequirementsAgent
                  ? "AI-generated analysis will appear here..."
                  : "AI-generated code will appear here..."
              }
            />
            {output && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCopy}
                  className="bg-custom-bg"
                >
                  <Copy className="h-4 w-4 mr-2 text-ready-txt" />
                  <span>Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="text-white bg-custom-bg"
                >
                  <Download className="h-4 w-4 mr-2 text-ready-txt" />
                  <span>Download</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAzureDevOpsPush}
                  className="bg-custom-bg"
                >
                  <Cloud className="h-4 w-4 mr-2 text-ready-txt" />
                  <span>Push to Azure DevOps</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPushToProjectManager}
                  className="bg-custom-bg"
                >
                  <GitBranch className="h-4 w-4 mr-2 text-ready-txt" />
                  <span>Push to git</span>
                </Button>
                {selectedStory && selectedStory.status !== "completed" && (
                  <Button
                    size="sm"
                    onClick={onMarkStoryComplete}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-ready-txt" />
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
