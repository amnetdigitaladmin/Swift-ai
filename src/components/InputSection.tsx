import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X, Play, RefreshCw, FileInput } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface InputSectionProps {
  agentName: string;
  input: string;
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  secondaryFile: File | null;
  setSecondaryFile: (file: File | null) => void;
  secondaryDragActive: boolean;
  setSecondaryDragActive: (active: boolean) => void;
  // handleProcessing:(active:boolean) => void;
  inputMode: "type" | "upload";
  setInputMode: (mode: "type" | "upload") => void;
  isProcessing: boolean;
  onProcess: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSecondaryFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  formatFileSize: (bytes: number) => string;
  handleIsProcessing: (processing: boolean) => void;
}

const InputSection = ({
  agentName,
  input,
  setInput,
  setOutput,
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
  inputMode,
  setInputMode,
  isProcessing,
  // handleProcessing,
  onProcess,
  onFileSelect,
  onSecondaryFileSelect,
  onDrag,
  onDrop,
  formatFileSize,
  handleIsProcessing,
}: InputSectionProps) => {
  const { user } = useUser();
  const isBusinessAnalyst = user?.persona === "business-analyst";

  const handleRemoveFile = () => {
    setSelectedFile(null);
    handleIsProcessing(false);
    setInput("");
    setOutput("");
  };

  const handleRemoveSecondaryFile = () => {
    setSecondaryFile(null);
    setInput("");
    setOutput("");
  };

  const getFilteredTemplates = () => {
    const allTemplates = [
      "User Story Template",
      "API Specification",
      "Test Cases",
      "Code Review",
      "Architecture Design",
      "Risk Assessment",
      "Business requirement document (BRD) template",
      "Skills and resources template",
    ];

    if (user?.persona === "business-analyst") {
      return [
        "Business requirement document (BRD) template",
        "Skills and resources template",
      ];
    }

    return allTemplates;
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <Card className="bg-custom-bg">
      <CardHeader>
        <CardTitle>Input</CardTitle>
        <CardDescription>
          {isBusinessAnalyst
            ? "Provide your requirements by typing or uploading a document"
            : "Provide your requirements or specifications"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Mode Toggle for Business Analyst */}
        {isBusinessAnalyst && (
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border">
            <span className="text-sm font-medium text-blue-900">
              Input Method:
            </span>
            <div className="flex space-x-2">
              <Button
                variant={inputMode === "type" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("type")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Type Input
              </Button>
              <Button
                variant={inputMode === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("upload")}
              >
                <FileInput className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        )}

        {/* Conditional Input Based on Mode */}
        {(!isBusinessAnalyst || inputMode === "type") && (
          <Textarea
            placeholder="Enter your project requirements, user stories, technical specifications, or any other relevant information..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] bg-custom-bg"
          />
        )}

        {/* Document Upload Section for Business Analyst */}
        {isBusinessAnalyst && inputMode === "upload" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements Document</label>
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Upload your requirements document
                  </p>
                  <p className="text-xs text-gray-500">
                    Drag and drop or browse files
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported: PDF, DOC, DOCX, TXT, XLSX, XLS
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">Browse Files</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                    onChange={onFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 border rounded-lg bg-green-50 border-green-200">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-700">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Template Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Template (Optional)</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="bg-custom-bg">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {filteredTemplates.map((template) => (
                <SelectItem
                  key={template}
                  value={template}
                  className="bg-custom-bg"
                >
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Upload for Non-Business Analyst */}
        {!isBusinessAnalyst && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Document Upload (Optional)
            </label>
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSecondaryDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSecondaryDragActive(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSecondaryDragActive(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSecondaryDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm">Drag and drop or browse files</p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, XLSX, XLS
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer bg-custom-bg">
                        Browse Files
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                    onChange={onFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-custom-bg">
                <div className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to rounded-md p-1">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-6 w-6 p-0 text-black "
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Additional Document Upload
          </label>
          {!secondaryFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                dragActive
                  ? "border-gray-300 bg-primary/10"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSecondaryDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSecondaryDragActive(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSecondaryDragActive(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSecondaryDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setSecondaryFile(file);
                }
              }}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm">Drag and drop or browse files</p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, TXT, XLSX, XLS
                </p>
                <label htmlFor="additional-file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer bg-custom-bg">
                      Browse Files
                    </span>
                  </Button>
                </label>
                <input
                  id="additional-file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                  onChange={onSecondaryFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-custom-bg">
              <div className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to rounded-md p-1">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {secondaryFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(secondaryFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveSecondaryFile}
                className="h-6 w-6 p-0 text-black"
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {isBusinessAnalyst && inputMode === "upload"
              ? selectedFile
                ? `Document: ${selectedFile.name}`
                : "No document selected"
              : `${input.length} characters`}
          </p>
          <Button
            onClick={onProcess}
            disabled={isProcessing}
            className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to text-black"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {/* <img src="/workflow_loader.gif" alt="Loading" className="h-16 w-16 mx-auto"/> */}
                <span className="generate-button-text">Generating with AI</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                <span className="generate-button-text">Generate with AI</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputSection;
