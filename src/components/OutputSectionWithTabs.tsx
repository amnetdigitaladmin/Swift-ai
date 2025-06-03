import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Copy,
  Download,
  Cloud,
  Users,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  Folder,
  File,
  GitBranch,
} from "lucide-react";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState, useEffect } from "react";

type FileItem = {
  name: string;
  type: string;
  content: string;
  url: string;
};

type FolderItem = {
  name: string;
  type: "folder";
  items: (FileItem | FolderItem)[];
};

// Add type guard functions
const isFolder = (item: FileItem | FolderItem): item is FolderItem => {
  return item.type === "folder";
};

const isFile = (item: FileItem | FolderItem): item is FileItem => {
  return item.type !== "folder";
};

interface OutputSectionWithTabsProps {
  output: string | { result: (FileItem | FolderItem)[]; [key: string]: any };
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
  if (
    typeof output === "string" &&
    /^https:\/\/.*\.s3(?:\.[a-z0-9-]+)?\.amazonaws\.com\/.+/.test(output)
  ) {
    return output;
  }

  if (
    typeof output === "object" &&
    output !== null &&
    "docx_download_url" in output
  ) {
    const url = (output as any).docx_download_url;
    return typeof url === "string" ? url.replace(/\\\//g, "/") : null;
  }

  return null;
};

const OutputSectionWithTabs = ({
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
}: OutputSectionWithTabsProps) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "backend",
    "frontend",
  ]);
  const [flattenedFiles, setFlattenedFiles] = useState<FileItem[]>([]);
  let s3Url = getS3UrlFromOutput(output);

  // Function to flatten the file structure and get all files
  useEffect(() => {
    const getAllFiles = (items: (FileItem | FolderItem)[]): FileItem[] => {
      return items.reduce((acc: FileItem[], item) => {
        if (isFolder(item)) {
          return [...acc, ...getAllFiles(item.items)];
        }
        if (isFile(item)) {
          return [...acc, item];
        }
        return acc;
      }, []);
    };

    // Check if output contains result array and update flattenedFiles
    if (typeof output === "object" && output !== null && "result" in output) {
      setFlattenedFiles(getAllFiles(output.result));
    }
  }, [output]);

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

  // Show initial state when no processing has happened yet
  const showInitialState = !isProcessing && output === "";

  const cleanName = (name: string | undefined) => {
    if (!name) return "";
    return name.replace(/[\*\`]/g, "");
  };

  const handleCopy = () => {
    const currentContent = flattenedFiles[activeFileIndex].content;
    navigator.clipboard
      .writeText(currentContent)
      .then(() => {
        onCopy();
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderPath)
        ? prev.filter((p) => p !== folderPath)
        : [...prev, folderPath]
    );
  };

  const handleFileDownload = (url: string) => {
    // Clean up the URL by removing extra backslashes
    const cleanUrl = url.replace(/\\\//g, "/");
    onS3Download(cleanUrl);
  };

  const RenderTree = ({
    items,
    path = "",
  }: {
    items: (FileItem | FolderItem)[];
    path: string;
  }) => {
    return (
      <div className="pl-4">
        {items.map((item, idx) => {
          const fullPath = path
            ? `${path}/${cleanName(item.name)}`
            : cleanName(item.name);

          if (isFolder(item)) {
            return (
              <div key={fullPath}>
                <button
                  onClick={() => toggleFolder(fullPath)}
                  className="flex items-center gap-2 py-1 hover:text-indigo-600 w-full text-left"
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedFolders.includes(fullPath) ? "rotate-90" : ""
                    }`}
                  />
                  <Folder className="h-4 w-4 text-yellow-500" />
                  {cleanName(item.name)}
                </button>
                {expandedFolders.includes(fullPath) && (
                  <RenderTree items={item.items} path={fullPath} />
                )}
              </div>
            );
          }

          if (isFile(item)) {
            return (
              <button
                key={fullPath}
                onClick={() => {
                  const fileIndex = flattenedFiles.findIndex(
                    (f) =>
                      cleanName(f.name) === cleanName(item.name) &&
                      f.content === item.content
                  );
                  if (fileIndex !== -1) setActiveFileIndex(fileIndex);
                }}
                className={`flex items-center gap-2 py-1 pl-6 hover:text-indigo-600 w-full text-left ${
                  cleanName(flattenedFiles[activeFileIndex]?.name) ===
                  cleanName(item.name)
                    ? "text-indigo-600 font-medium"
                    : ""
                }`}
              >
                {cleanName(item.name)}
              </button>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 space-y-4">
        {isProcessing ? (
          <div className="h-[600px] flex flex-col items-center justify-center">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">{processingMessage}</p>
              {progress > 0 && (
                <div className="w-64 mt-4 ml-auto mr-auto">
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </div>
        ) : showInitialState ? (
          <div className="h-[600px] flex flex-col items-center justify-center">
            <div className="text-center py-8">
              <p className="text-gray-600">
                Upload a file or enter your requirements to generate code.
              </p>
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="px-0 pt-0">
              <CardTitle>{outputTitle}</CardTitle>
              <CardDescription>{outputDescription}</CardDescription>
            </CardHeader>

            <div className="grid grid-cols-[200px,1fr] gap-4 h-[calc(100vh-200px)]">
              {/* File Tree */}
              <div className="border-r pr-2 overflow-y-auto">
                {typeof output === "object" &&
                  output !== null &&
                  "result" in output && (
                    <RenderTree items={output.result} path="" />
                  )}
              </div>

              {/* File Content */}
              <div className="space-y-4 overflow-y-auto pr-2">
                <div className="flex justify-between items-center sticky top-0 bg-white py-2">
                  <h3 className="text-lg font-semibold">
                    {flattenedFiles[activeFileIndex]
                      ? cleanName(flattenedFiles[activeFileIndex].name)
                      : ""}
                  </h3>
                  <div className="flex gap-2 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleFileDownload(flattenedFiles[activeFileIndex]?.url)
                      }
                      className="border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <SyntaxHighlighter
                  language={flattenedFiles[activeFileIndex]?.type}
                  style={oneLight}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0",
                    fontSize: "0.875rem",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: "3em",
                    paddingRight: "1em",
                    color: "#64748b",
                    textAlign: "right",
                  }}
                >
                  {flattenedFiles[activeFileIndex]?.content}
                </SyntaxHighlighter>

                <div className="flex flex-wrap gap-2 mt-4 sticky bottom-0  py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAzureDevOpsPush}
                  >
                    <Cloud className="h-4 w-4 mr-2" />
                    Push to Azure DevOps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPushToProjectManager}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Push to Git
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
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OutputSectionWithTabs;
