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
  ChevronLeft,
  Folder,
  File,
  GitBranch,
  X,
  Maximize
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
  showOutput:boolean;
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
  onHandleFullScreen:() => void;
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
  showOutput,
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
  onHandleFullScreen,
}: OutputSectionWithTabsProps) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    "backend",
    "frontend",
  ]);
  const [flattenedFiles, setFlattenedFiles] = useState<FileItem[]>([]);
  const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
  const [openFiles, setOpenFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState(0);
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
      const files = getAllFiles(output.result);
      setFlattenedFiles(files);
      if (files.length > 0 && openFiles.length === 0) {
        setOpenFiles([files[0]]);
      }
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
    const currentContent = openFiles[activeTab]?.content;
    if (currentContent) {
      navigator.clipboard
        .writeText(currentContent)
        .then(onCopy)
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderPath)
        ? prev.filter((p) => p !== folderPath)
        : [...prev, folderPath]
    );
  };

  const handleFileSelect = (file: FileItem) => {
    const fileIndex = openFiles.findIndex((f) => f.name === file.name);
    if (fileIndex === -1) {
      setOpenFiles([...openFiles, file]);
      setActiveTab(openFiles.length);
    } else {
      setActiveTab(fileIndex);
    }
  };

  const closeTab = (index: number) => {
    const newOpenFiles = openFiles.filter((_, i) => i !== index);
    setOpenFiles(newOpenFiles);
    if (activeTab >= newOpenFiles.length) {
      setActiveTab(Math.max(0, newOpenFiles.length - 1));
    }
  };

  const RenderTree = ({
    items,
    path = "",
  }: {
    items: (FileItem | FolderItem)[];
    path: string;
  }) => {
    return (
      <div className="pl-2">
        {items.map((item) => {
          const fullPath = path
            ? `${path}/${cleanName(item.name)}`
            : cleanName(item.name);

          if (isFolder(item)) {
            return (
              <div key={fullPath}>
                <button
                  onClick={() => toggleFolder(fullPath)}
                  className="flex items-center gap-2 py-1 w-full text-left hover:bg-gray-800/50 rounded px-2"
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedFolders.includes(fullPath) ? "rotate-90" : ""
                    }`}
                  />
                  <Folder className="h-4 w-4 " />
                  <span className="text-sm">{cleanName(item.name)}</span>
                </button>
                {expandedFolders.includes(fullPath) && (
                  <RenderTree items={item.items} path={fullPath} />
                )}
              </div>
            );
          }

          if (isFile(item)) {
            const isActive = openFiles[activeTab]?.name === item.name;
            return (
              <button
                key={fullPath}
                onClick={() => handleFileSelect(item)}
                className={`flex items-center gap-2 py-1 pl-6 w-full text-left hover:bg-gray-800/50 rounded px-2 ${
                  isActive ? "bg-gray-800/30" : ""
                }`}
              >
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{cleanName(item.name)}</span>
              </button>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <Card className="shadow-md bg-custom-bg">
      <CardContent className="p-6 space-y-4">
        {isProcessing ? (
          <div className="h-[600px] flex flex-col items-center justify-center">
            <div className="text-center py-8">
              {/* <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 stroke-current  bg-clip-text bg-gradient-to-r from-gradient-background-from to-gradient-background-to text-ready-txt" /> */}
              <img src="/workflow_loader.gif" alt="Loading" className="h-16 w-16 mx-auto"/>
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
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle>{outputTitle}</CardTitle>
              <CardDescription>{outputDescription}</CardDescription>
            </CardHeader> */}

            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>{outputTitle}</span>
               {!showOutput && <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onHandleFullScreen}
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-18h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3" />
                  </svg> */}

                  <Maximize className="h-4 w-4" />
                </Button>} 
              </CardTitle>
              <CardDescription>{outputDescription}</CardDescription>
            </CardHeader>


            <div className="flex flex-1 overflow-hidden border rounded-lg ">
              {/* File Explorer */}
              <div
                className={`transition-all duration-300 border-r ${
                  isTreeCollapsed ? "w-12" : "w-64"
                }`}
              >
                <div className="flex items-center justify-between p-2 border-b h-12">
                  {!isTreeCollapsed && (
                    <span className="text-base font-medium">Files</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
                    className="p-1 h-6 w-6"
                  >
                    {isTreeCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {!isTreeCollapsed && (
                  <div className="overflow-y-auto h-[calc(100%-2.5rem)] custom-scrollbar">
                    {typeof output === "object" &&
                      output !== null &&
                      "result" in output && (
                        <RenderTree items={output.result} path="" />
                      )}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs Bar */}
                {openFiles.length > 0 && (
                  <div className="flex items-center border-b overflow-x-auto custom-scrollbar p-2 h-12">
                    {openFiles.map((file, index) => (
                      <div
                        key={file.name + index}
                        className={`flex items-center gap-1 px-3 py-1.5 border-r ${
                          activeTab === index
                            ? "bg-gray-800/50"
                            : "hover:bg-gray-800/30"
                        }`}
                      >
                        <button
                          className="flex items-center gap-2"
                          onClick={() => setActiveTab(index)}
                        >
                          <File className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {cleanName(file.name)}
                          </span>
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(index);
                          }}
                          className="p-0 h-4 w-4 hover:bg-gray-700/50 rounded-sm"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Action Bar */}
                    {/* <div className="flex justify-end items-center gap-2 p-2 ">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onS3Download(openFiles[activeTab]?.url)}
                        className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to"
                      >
                        <Download className="h-4 w-4 mr-2 text-black" />
                        <span className="text-black font-semibold">
                          Download
                        </span>
                      </Button>
                    </div> */}

                    {/* Code Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <SyntaxHighlighter
                        language={openFiles[activeTab]?.type}
                        style={{
                          ...oneLight,
                          'pre[class*="language-"]': {
                            ...oneLight['pre[class*="language-"]'],
                            background: "transparent",
                            color: "#ffffff",
                            margin: 0,
                            padding: "1rem",
                          },
                          'code[class*="language-"]': {
                            ...oneLight['code[class*="language-"]'],
                            background: "transparent",
                            color: "#ffffff",
                          },
                        }}
                        customStyle={{
                          margin: 0,
                          height: "100%",
                          padding: "1rem",
                          fontSize: "0.875rem",
                          backgroundColor: "transparent",
                          color: "#ffffff",
                        }}
                        className="custom-scrollbar h-full"
                        showLineNumbers={true}
                        lineNumberStyle={{
                          minWidth: "3em",
                          paddingRight: "1em",
                          color: "#64748b",
                          textAlign: "right",
                        }}
                      >
                        {openFiles[activeTab]?.content || ""}
                      </SyntaxHighlighter>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center gap-2 p-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onAzureDevOpsPush}
                        className="bg-custom-bg"
                      >
                        <Cloud className="h-4 w-4 mr-2 text-ready-txt" />
                        Push to Azure DevOps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onPushToProjectManager}
                        className="bg-custom-bg"
                      >
                        <GitBranch className="h-4 w-4 mr-2 text-ready-txt" />
                        Push to Git
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutputSectionWithTabs;
