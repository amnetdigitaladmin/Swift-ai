import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import { codeConversion } from "../services/conversionService";
import { Clipboard, Zap, ArrowLeft, FolderOpen, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import OptimizationPanel from "./OptimizationPanel";
import { Button } from "@/components/ui/button";
import { useAgentWorkspace } from "@/hooks/useAgentWorkspace";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROGRAMMING_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "cpp", label: "C++" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby" },
];

interface AgentWorkspaceProps {
  agentName: string;
  onBack: () => void;
}

const CodeConversionInterface: React.FC<AgentWorkspaceProps> = ({
  agentName,
  onBack,
}) => {
  const { currentProject } = useAgentWorkspace(agentName);
  const { toast } = useToast();

  const { isDarkMode } = useTheme();
  const [codeInput, setCodeInput] = useState("");
  const [convertedOutput, setConvertedOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("javascript");
  const [targetLanguage, setTargetLanguage] = useState("typescript");
  const [isCopied, setIsCopied] = useState(false);

  const handleConvert = async () => {
    if (!codeInput.trim()) return;

    setIsConverting(true);

    try {
      // Using the new code conversion service
      const result = await codeConversion(
        codeInput,
        sourceLanguage,
        targetLanguage
      );
      setConvertedOutput(result);
    } catch (error) {
      console.error("Conversion error:", error);
      setConvertedOutput("Error converting code. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(convertedOutput);
      setIsCopied(true);

      // Show toast notification
      toast({
        title: "Code Copied!",
        description: "The converted code has been copied to your clipboard.",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-custom-bg">
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
            <p className="text-gray-600">
              AI-Powered Code Conversion Assistant
            </p>
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
      </div>

      <div className="space-y-8 py-4">
        {/* Code Conversion Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Right panel - Input */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Select
                    value={sourceLanguage}
                    onValueChange={(value: string) => {
                      setSourceLanguage(value);
                      setCodeInput("");
                      setConvertedOutput("");
                    }}
                  >
                    <SelectTrigger className="bg-custom-bg">
                      <SelectValue placeholder="Select source language" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang.id}
                          value={lang.id}
                          className="bg-custom-bg"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <CodeEditor
                value={codeInput}
                onChange={setCodeInput}
                language={sourceLanguage}
                placeholder={`Paste your ${sourceLanguage.toUpperCase()} code here...`}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Left panel - Output */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Select
                    value={targetLanguage}
                    onValueChange={setTargetLanguage}
                  >
                    <SelectTrigger className="bg-custom-bg">
                      <SelectValue placeholder="Select target language" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang.id}
                          value={lang.id}
                          className="bg-custom-bg"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <CodeEditor
                value={convertedOutput}
                onChange={setConvertedOutput}
                language={targetLanguage}
                placeholder={`Converted ${targetLanguage.toUpperCase()} code will appear here...`}
                isDarkMode={isDarkMode}
                isReadOnly={true}
              />
              {convertedOutput && (
                <button
                  onClick={handleCopyOutput}
                  className={`mt-2 flex items-center gap-1 px-3 py-1 rounded text-sm transition-all duration-200
                  ${
                    isCopied
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-custom-bg text-white border hover:bg-gray-700"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" /> Copy to Clipboard
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Convert button */}
          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              disabled={isConverting || !codeInput.trim()}
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
                : `Convert to ${targetLanguage.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Optimization Panel */}
        {/* <div className="border-t pt-8">
          <OptimizationPanel />
        </div> */}
      </div>
    </div>
  );
};

export default CodeConversionInterface;
