
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Copy, Download, Cloud, Users, CheckCircle, RefreshCw } from "lucide-react";

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


const getS3UrlFromOutput = (output: string | object): string | null => {
  if (typeof output === "string" && /^https:\/\/.*\.s3(?:\.[a-z0-9-]+)?\.amazonaws\.com\/.+/.test(output)) {
    return output;
  }

  if (typeof output === "object" && output !== null && "docx_download_url" in output) {
    const url = (output as any).docx_download_url;
    return typeof url === "string" ? url.replace(/\\\//g, "/") : null;
  }

  return null;
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
  onMarkStoryComplete
}: OutputSectionProps) => {
   let s3Url = getS3UrlFromOutput(output);
  const isRequirementsAgent = agentName?.toLowerCase().includes('swiftplan');
  const outputTitle = isRequirementsAgent ? "Generated Output" : "Generated Code Output";
  const outputDescription = isRequirementsAgent ? "AI-generated analysis and documentation" : "AI-generated code and implementation";
  const processingMessage = isRequirementsAgent 
    ? "AI is generating analysis for your requirements..." 
    : "AI is generating code for your user story...";

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{outputTitle}</CardTitle>
        <CardDescription>{outputDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 h-full">
        {isProcessing ? (
            <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">{processingMessage}</p>
            </div>
            {/* <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">{Math.round(progress)}% complete</p> */}
          </div>
        ) : s3Url ? (
          <div className="flex items-center justify-center h-full">
            <Button
              onClick={()=>onS3Download(s3Url)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Generated File
            </Button>
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle >{outputTitle}</CardTitle>
              <CardDescription>{outputDescription}</CardDescription>
            </CardHeader>
            <Textarea
              value={typeof output === "string" ? output : ""}
              readOnly
              className="min-h-[300px] bg-gray-800 text-gray-100 border-gray-600 font-mono text-xs"
              placeholder={isRequirementsAgent ? "AI-generated analysis will appear here..." : "AI-generated code will appear here..."}
            />
            {output && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="secondary" size="sm" onClick={onCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
                >
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
                    size="sm"
                    onClick={onMarkStoryComplete}
                    className="bg-green-600 hover:bg-green-700 text-white"
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

  // -----------------old code---------------------------------
  // return (
  //   <Card>
  //     <CardHeader>
  //       <CardTitle>Generated Code Output</CardTitle>
  //       <CardDescription>AI-generated code and implementation</CardDescription>
  //     </CardHeader>
  //     <CardContent>
  //       {isProcessing ? (
  //         <div className="space-y-4">
  //           <div className="text-center py-8">
  //             <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
  //             <p className="text-gray-600">AI is generating code for your user story...</p>
  //           </div>
  //           <Progress value={progress} className="w-full" />
  //           <p className="text-sm text-gray-500 text-center">{Math.round(progress)}% complete</p>
  //         </div>
  //       ) : (
  //         <>
  //           <Textarea
  //             value={output}
  //             readOnly
  //             className="min-h-[300px] bg-gray-800 text-gray-100 border-gray-600 font-mono text-xs"
  //             placeholder="AI-generated code will appear here..."
  //           />
  //           {output && (
  //             <div className="flex items-center space-x-2 mt-4 flex-wrap gap-2">
  //               <Button variant="outline" size="sm" onClick={onCopy}>
  //                 <Copy className="h-4 w-4 mr-2" />
  //                 Copy
  //               </Button>
  //               <Button variant="outline" size="sm" onClick={onDownload}>
  //                 <Download className="h-4 w-4 mr-2" />
  //                 Download
  //               </Button>
  //               <Button variant="outline" size="sm" onClick={onAzureDevOpsPush}>
  //                 <Cloud className="h-4 w-4 mr-2" />
  //                 Push to Azure DevOps
  //               </Button>
  //               <Button variant="outline" size="sm" onClick={onPushToProjectManager}>
  //                 <Users className="h-4 w-4 mr-2" />
  //                 Push to Project Manager
  //               </Button>
  //               {selectedStory && selectedStory.status !== "completed" && (
  //                 <Button
  //                   variant="default"
  //                   size="sm"
  //                   onClick={onMarkStoryComplete}
  //                   className="bg-green-600 hover:bg-green-700"
  //                 >
  //                   <CheckCircle className="h-4 w-4 mr-2" />
  //                   Mark Story Complete
  //                 </Button>
  //               )}
  //             </div>
  //           )}
  //         </>
  //       )}
  //     </CardContent>
  //   </Card>
  // );
};

export default OutputSection;
