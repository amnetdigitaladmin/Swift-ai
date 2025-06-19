import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import ExamplesPanel from "./ExamplesPanel";
import { sqlConversion } from "../services/conversionService";
import {
  ChevronDown,
  ChevronUp,
  Clipboard,
  Zap,
  ArrowLeftRight,
  Badge,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ConversionHistory from "./ConversionHistory";
import OptimizationPanel from "./OptimizationPanel";
import { HistoryItem } from "../types";
import { Button } from "@/components/ui/button";
import { useAgentWorkspace } from "@/hooks/useAgentWorkspace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const DATABASE_TYPES = [
  { id: "sqlserver", label: "SQL Server" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  // { id: "oracle", label: "Oracle" },
];

interface AgentWorkspaceProps {
  agentName: string;
  onBack: () => void;
}
const ConversionInterface: React.FC<AgentWorkspaceProps> = ({
  agentName,
  onBack,
}) => {
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
    showOutput,
    handleFullScreen,

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
  const { isDarkMode } = useTheme();
  const [sqlInput, setSqlInput] = useState("");
  const [postgresOutput, setPostgresOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isExamplesPanelOpen, setIsExamplesPanelOpen] = useState(false);
  const [conversionHistory, setConversionHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sourceType, setSourceType] = useState("sqlserver");
  const [targetType, setTargetType] = useState("postgresql");

  const handleConvert = async () => {
    if (!sqlInput.trim()) return;

    setIsConverting(true);

    let converstionType = "";
    if (sourceType === "postgresql" && targetType === "sqlserver") {
      converstionType = "convert_to_sqlserver";
    } else if (sourceType === "sqlserver" && targetType === "postgresql") {
      converstionType = "convert_to_postgresql";
    }
    try {
      const result = await sqlConversion(sqlInput, sourceType,targetType);

      setPostgresOutput(result);

      // Add to history
      // const newHistoryItem: HistoryItem = {
      //   id: Date.now().toString(),
      //   sqlServer: sourceType === "postgres" ? result : sqlInput,
      //   postgres: sourceType === "postgres" ? sqlInput : result,
      //   timestamp: new Date(),
      //   conversionDirection: `${sourceType}-to-${targetType}`,
      // };

      // setConversionHistory((prev) => [newHistoryItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Conversion error:", error);
      setPostgresOutput("Error converting SQL. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(postgresOutput);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSqlInput(item.sqlServer);
    setPostgresOutput(item.postgres);
  };

  const toggleExamplesPanel = () => {
    setIsExamplesPanelOpen((prev) => !prev);
  };

  return (
    <div className=" bg-custom-bg">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-custom-nav-bg"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{agentName}</h2>
            <p className="text-gray-600">AI-Powered Development Assistant</p>
            {currentProject && (
              <div className="flex items-center space-x-2 mt-1">
                <FolderOpen className="h-4 w-4 text-ready-txt" />
                <span className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent generate-button-text text-base">
                  {currentProject.name}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* <Badge className="bg-ready-bg hover:bg-ready-bg text-ready-txt">
            Ready
          </Badge> */}
      </div>
      <div className="space-y-8 py-4">
        {/* Conversion Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left panel - Input */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                {/* <div className="flex items-center gap-2 ">
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className={`px-3 py-1.5 rounded bg-custom-bg hover:bg-gray-600 text-gray-200 border border-gray-600 focus:outline-none appearance-none pr-8 relative cursor-pointer`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1rem",
                    }}
                  >
                    {DATABASE_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div> */}

                <div className="flex items-center gap-2">
                  <Select value={sourceType} onValueChange={setSourceType}>
                    <SelectTrigger className="bg-custom-bg">
                      <SelectValue placeholder="Select source database" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATABASE_TYPES.map((type) => (
                        <SelectItem
                          key={type.id}
                          value={type.id}
                          className="bg-custom-bg"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* <button
                  onClick={toggleExamplesPanel}
                  className={`flex items-center text-sm px-3 py-2 rounded bg-custom-bg border border-gray-600 text-gray-200`}
                >
                  Examples{" "}
                  {isExamplesPanelOpen ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button> */}
              </div>

              {/* {isExamplesPanelOpen && (
                <ExamplesPanel
                  onSelectExample={(example) => setSqlInput(example)}
                  conversionMode={`${sourceType}-to-${targetType}`}
                />
              )} */}

              <CodeEditor
                value={sqlInput}
                onChange={setSqlInput}
                language="sql"
                placeholder={`Paste your ${sourceType.toUpperCase()} stored procedure here...`}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Right panel - Output */}
            <div className="flex-1 ">
              {/* <div className="flex items-center gap-4 mb-6">
                <select
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value)}
                      className={`px-3 py-1.5 rounded bg-custom-bg hover:bg-gray-600 text-gray-200 border border-gray-600 focus:outline-none appearance-none pr-8 relative cursor-pointer`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.5rem center",
                        backgroundSize: "1rem",
                      }}
                    >
                      {DATABASE_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                </select>
              </div> */}

              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Select value={targetType} onValueChange={setTargetType}>
                    <SelectTrigger className="bg-custom-bg">
                      <SelectValue placeholder="Select source database" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATABASE_TYPES.map((type) => (
                        <SelectItem
                          key={type.id}
                          value={type.id}
                          className="bg-custom-bg"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CodeEditor
                value={postgresOutput}
                onChange={setPostgresOutput}
                language="sql"
                placeholder={`Converted ${targetType.toUpperCase()} function will appear here...`}
                isDarkMode={isDarkMode}
                isReadOnly={true}
              />
              {postgresOutput && (
                <button
                  onClick={handleCopyOutput}
                  className={`mt-2 flex items-center gap-1 px-3 py-1 rounded text-sm
                  bg-custom-bg text-white border }`}
                >
                  <Clipboard className="h-4 w-4" /> Copy to Clipboard
                </button>
              )}
            </div>
          </div>

          {/* Convert button */}
          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              disabled={isConverting || !sqlInput.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105
                bg-gradient-to-r from-gradient-background-from to-gradient-background-to
                ${isConverting ? "opacity-70 cursor-not-allowed" : ""}
                text-black
                generate-button-text
              
              `}
            >
              <Zap className="h-5 w-5" />
              {isConverting
                ? "Converting..."
                : `Convert to ${targetType.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Optimization Panel */}
        <div className="border-t pt-8">
          <OptimizationPanel />
        </div>

        {/* Conversion history */}
        {/* {conversionHistory.length > 0 && (
          <div className="mt-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowHistory((prev) => !prev)}
            >
              <h3 className="text-lg font-semibold">Conversion History</h3>
              {showHistory ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>

            {showHistory && (
              <ConversionHistory
                history={conversionHistory}
                onSelectItem={loadFromHistory}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ConversionInterface;
