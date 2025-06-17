import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { sqlExamples, postgresExamples, Example } from "../data/examples";

interface ExamplesPanelProps {
  onSelectExample: (example: string) => void;
  conversionMode: string;
}

const ExamplesPanel: React.FC<ExamplesPanelProps> = ({
  onSelectExample,
  conversionMode,
}) => {
  const { isDarkMode } = useTheme();
  const [sourceType, targetType] = conversionMode.split("-to-");
  const examples = sourceType === "sqlserver" ? sqlExamples : postgresExamples;

  return (
    <div className={`mb-4 rounded-lg p-4 bg-custom-bg border border-gray-700`}>
      <h3 className="text-sm font-medium mb-2">
        {`${sourceType.toUpperCase()} to ${targetType.toUpperCase()} Examples:`}
      </h3>
      <div className="space-y-3">
        {examples.map((example: Example, index: number) => (
          <div key={index} className="space-y-1">
            <h4
              className={`text-xs font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {example.title}
            </h4>
            <pre
              className={`text-xs p-2 rounded overflow-x-auto ${
                isDarkMode
                  ? "bg-gray-900 text-gray-300"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {example.snippet}
            </pre>
            <button
              onClick={() => onSelectExample(example.full)}
              className={`text-xs px-2 py-1 rounded ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Use This Example
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamplesPanel;
