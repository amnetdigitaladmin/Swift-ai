import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import { optimizeSqlCode } from "../services/conversionService";
import { Zap, Clipboard, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const DATABASE_TYPES = [
  { id: "sqlserver", label: "SQL Server" },
  { id: "postgresql", label: "PostgreSQL" },
];

const OptimizationPanel: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [sqlInput, setSqlInput] = useState("");
  const [optimizedOutput, setOptimizedOutput] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(
    null
  );
  const [sqlType, setSqlType] = useState<"postgresql" | "sqlserver">(
    "sqlserver"
  );

  const handleOptimize = async () => {
    if (!sqlInput.trim()) {
      setOptimizationError("Please provide SQL code to optimize.");
      return;
    }

    setIsOptimizing(true);
    setOptimizationError(null);
    try {
      const result = await optimizeSqlCode(sqlInput, sqlType);
      setOptimizedOutput(result);
    } catch (error) {
      console.error("Optimization error:", error);
      setOptimizationError("Failed to optimize SQL code. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(optimizedOutput);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className={`text-lg font-semibold text-white `}
        >
          SQL Optimization
        </h2>
        <div className="flex items-center gap-2">
          <Select
            value={sqlType}
            onValueChange={(value: "postgresql" | "sqlserver") => {
              setSqlType(value);
              // Clear input and output when changing SQL type
              setSqlInput("");
              setOptimizedOutput("");
              setOptimizationError(null);
            }}
          >
            <SelectTrigger className="bg-custom-bg">
              <SelectValue placeholder="Select database type" />
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left panel - Input */}
        <div className="flex-1">
          <h3
            className={`mb-2 text-sm font-medium text-gray-300`}
          >
            {sqlType === "postgresql"
              ? "PostgreSQL Function"
              : "SQL Server Stored Procedure"}
          </h3>
          <CodeEditor
            value={sqlInput}
            onChange={setSqlInput}
            language="sql"
            placeholder={
              sqlType === "postgresql"
                ? "Paste your PostgreSQL function to optimize..."
                : "Paste your SQL Server stored procedure to optimize..."
            }
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right panel - Output */}
        <div className="flex-1">
          <h3
            className={`mb-2 text-sm font-medium text-gray-300`}
          >
            Optimized{" "}
            {sqlType === "postgresql"
              ? "PostgreSQL Function"
              : "SQL Server Stored Procedure"}
          </h3>
          <CodeEditor
            value={optimizedOutput}
            onChange={() => {}} // Read-only
            language="sql"
            placeholder="Optimized SQL code will appear here..."
            isDarkMode={isDarkMode}
            isReadOnly={true}
          />
          {optimizedOutput && (
            <button
              onClick={handleCopyOutput}
              className={`mt-2 flex items-center gap-1 px-3 py-1 rounded text-sm
              bg-custom-bg text-gray-200
              }`}
            >
              <Clipboard className="h-4 w-4" /> Copy to Clipboard
            </button>
          )}
        </div>
      </div>

      {optimizationError && (
        <div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? "bg-red-900/50 text-red-200"
              : "bg-red-100 text-red-700"
          }`}
        >
          {optimizationError}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || !sqlInput.trim()}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105
            bg-gradient-to-r from-gradient-background-from to-gradient-background-to
            generate-button-text
            text-black
            ${isOptimizing ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <Zap className="h-5 w-5" />
          {isOptimizing ? "Optimizing..." : "Optimize SQL"}
        </button>
      </div>

      <div className={`p-4 rounded-lg bg-custom-bg border border-gray-600}`}>
        <p
          className={`text-sm text-gray-300`}
        >
          The optimizer will suggest improvements for:
          {sqlType === "postgresql" ? (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Query performance and execution plans</li>
              <li>Index usage and table access methods</li>
              <li>Function volatility and parameter optimization</li>
              <li>Array and JSON operations</li>
              <li>Parallel query execution</li>
            </ul>
          ) : (
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Query performance and execution plans</li>
              <li>Index usage and table access methods</li>
              <li>Stored procedure optimization</li>
              <li>Dynamic SQL and parameter handling</li>
              <li>Locking and concurrency</li>
            </ul>
          )}
        </p>
      </div>
    </div>
  );
};

export default OptimizationPanel;
