import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import ExamplesPanel from "./ExamplesPanel";
import {
  processConversion,
  processReverseConversion,
} from "../services/conversionService";
import {
  ChevronDown,
  ChevronUp,
  Clipboard,
  Zap,
  ArrowLeftRight,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ConversionHistory from "./ConversionHistory";
import OptimizationPanel from "./OptimizationPanel";
import { HistoryItem } from "../types";

const DATABASE_TYPES = [
  { id: "sqlserver", label: "SQL Server" },
  { id: "postgres", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "oracle", label: "Oracle" },
];

interface AgentWorkspaceProps {
  agentName: string;
  onBack: () => void;
}
const ConversionInterface: React.FC<AgentWorkspaceProps> = ({ agentName, onBack }) => {
  const { isDarkMode } = useTheme();
  const [sqlInput, setSqlInput] = useState("");
  const [postgresOutput, setPostgresOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isExamplesPanelOpen, setIsExamplesPanelOpen] = useState(false);
  const [conversionHistory, setConversionHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sourceType, setSourceType] = useState("sqlserver");
  const [targetType, setTargetType] = useState("postgres");

  const handleConvert = async () => {
    if (!sqlInput.trim()) return;

    setIsConverting(true);
    try {
      const result =
        sourceType === "postgres" && targetType === "sqlserver"
          ? await processReverseConversion(sqlInput)
          : await processConversion(sqlInput);

      setPostgresOutput(result);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        sqlServer: sourceType === "postgres" ? result : sqlInput,
        postgres: sourceType === "postgres" ? sqlInput : result,
        timestamp: new Date(),
        conversionDirection: `${sourceType}-to-${targetType}`,
      };

      setConversionHistory((prev) => [newHistoryItem, ...prev].slice(0, 10));
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
    <div className="container mx-auto px-4 py-6 bg-custom-bg">
      <div className="space-y-8">
        {/* Conversion Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left panel - Input */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2 px-4">
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className={`px-3 py-1 rounded bg-custom-bg hover:bg-gray-600 text-gray-200 border border-gray-600 focus:outline-none `}
                  >
                    {DATABASE_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                 
                </div>
                <button
                  onClick={toggleExamplesPanel}
                  className={`flex items-center text-sm px-3 py-2 rounded bg-custom-bg border border-gray-600 text-gray-200`}
                >
                  Examples{" "}
                  {isExamplesPanelOpen ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </div>

              {isExamplesPanelOpen && (
                <ExamplesPanel
                  onSelectExample={(example) => setSqlInput(example)}
                  conversionMode={`${sourceType}-to-${targetType}`}
                />
              )}

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
              {/* <h2
                className={`mb-2 text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {targetType.toUpperCase()} Function
              </h2> */}
              <div className="flex items-center gap-4 mb-6">
                <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className={`px-3 py-1 rounded bg-custom-bg hover:bg-gray-600 text-gray-200 border border-gray-600 focus:outline-none `}
                  >
                    {DATABASE_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                </select>
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
        {conversionHistory.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default ConversionInterface;
