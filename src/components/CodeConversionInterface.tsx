import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import { codeConversion } from "../services/conversionService";
import {
  Clipboard,
  Zap,
  ArrowLeft,
  FolderOpen,
  Check,
  Info,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

  // Add state for explanations
  const [inputExplanation, setInputExplanation] = useState("");
  const [targetExplanation, setTargetExplanation] = useState("");

  // Validation dialog state
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleConvert = async () => {
    if (!codeInput.trim()) return;
    setIsConverting(true);
    try {
      const result = await codeConversion(
        codeInput,
        sourceLanguage,
        targetLanguage
      );
      if (!result.valid_input) {
        setValidationMessage(
          result.validation_message || "Invalid input provided."
        );
        setShowValidationDialog(true);
        return;
      }
      // Use target_code as the converted result
      setConvertedOutput(result.target_code || "No converted code found.");
      // Set explanations
      setInputExplanation(result.input_code_explanation || "");
      setTargetExplanation(result.target_code_explanation || "");
    } catch (error) {
      console.error("Conversion error:", error);
      setConvertedOutput("Error converting code. Please try again.");
      setInputExplanation("");
      setTargetExplanation("");
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
                      setInputExplanation("");
                      setTargetExplanation("");
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

              {/* Input Code Explanation */}
              {inputExplanation && (
                <div className="mt-4 p-4 bg-custom-bg rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-white " />
                    <h4 className="font-medium text-white">
                      Input Code Explanation
                    </h4>
                  </div>
                  <div
                    className="max-h-24 overflow-y-auto
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-neutral-700
                    [&::-webkit-scrollbar-thumb]:bg-neutral-500
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    <p className="text-sm text-white leading-relaxed">
                      {inputExplanation}
                    </p>
                  </div>
                </div>
              )}
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

              {/* Target Code Explanation */}
              {targetExplanation && (
                <div className="mt-4 p-4 bg-custom-bg rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-white" />
                    <h4 className="font-medium text-white">
                      Converted Code Explanation
                    </h4>
                  </div>
                  <div
                    className="max-h-24 overflow-y-auto
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-neutral-700
                    [&::-webkit-scrollbar-thumb]:bg-neutral-500
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    <p className="text-sm text-white leading-relaxed">
                      {targetExplanation}
                    </p>
                  </div>
                </div>
              )}

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

      {/* Validation Dialog */}
      {showValidationDialog && (
        <Dialog
          open={showValidationDialog}
          onOpenChange={setShowValidationDialog}
        >
          <DialogContent className="sm:max-w-[425px] bg-custom-bg ">
            <DialogHeader>
              <DialogTitle>Validation Error</DialogTitle>
              <DialogDescription>{validationMessage}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CodeConversionInterface;
