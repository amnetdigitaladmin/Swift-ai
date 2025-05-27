import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Play, Download, Copy, RefreshCw, Upload, FileText, X, Github, FolderOpen, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import GitHubAuthModal, { GitHubCredentials } from "./GitHubAuthModal";

interface AgentWorkspaceProps {
  agentName: string;
  onBack: () => void;
}

const AgentWorkspace = ({ agentName, onBack }: AgentWorkspaceProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { currentProject } = useWorkflow();

  const handleProcess = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide input for the agent to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate AI processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate API call delay
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      let outputText = `${agentName} Analysis Results:

Based on your input: "${input}"`;

      if (selectedTemplate) {
        outputText += `\nUsing template: ${selectedTemplate}`;
      }

      if (selectedFile) {
        outputText += `\nDocument processed: ${selectedFile.name}`;
      }

      outputText += `

Generated output with AI assistance:
- Comprehensive analysis completed
- Best practices recommendations included
- Implementation guidelines provided
- Risk assessment performed
- Next steps outlined

This is a simulated output. In production, this would connect to OpenAI/Anthropic APIs for real processing.`;

      setOutput(outputText);
      setIsProcessing(false);
      toast({
        title: "Processing Complete",
        description: `${agentName} has successfully processed your request.`,
      });
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to Clipboard",
      description: "Output has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentName.toLowerCase().replace(/\s+/g, '-')}-output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: "Output file has been downloaded.",
    });
  };

  const handleGitHubPush = () => {
    setIsGitHubModalOpen(true);
  };

  const handleGitHubSubmit = async (credentials: GitHubCredentials) => {
    try {
      // Simulate GitHub API interaction
      console.log("GitHub credentials:", {
        username: credentials.username,
        repository: credentials.repository,
        token: credentials.token.substring(0, 8) + "..." // Only log partial token for security
      });

      // In a real implementation, this would:
      // 1. Validate the credentials with GitHub API
      // 2. Create or update the repository
      // 3. Commit and push the generated content
      
      toast({
        title: "GitHub Integration Successful",
        description: `Content pushed to ${credentials.username}/${credentials.repository} successfully!`,
      });
      
      // Store credentials securely (in a real app, this would be encrypted/stored securely)
      localStorage.setItem('github_username', credentials.username);
      localStorage.setItem('github_repository', credentials.repository);
      // Note: In production, tokens should NEVER be stored in localStorage
      
    } catch (error) {
      console.error("GitHub integration failed:", error);
      toast({
        title: "GitHub Integration Failed",
        description: "Failed to connect to GitHub. Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to prevent modal from closing
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter templates based on user persona
  const getFilteredTemplates = () => {
    const allTemplates = [
      "User Story Template", 
      "API Specification", 
      "Test Cases", 
      "Code Review", 
      "Architecture Design", 
      "Risk Assessment",
      "Business requirement document (BRD) template",
      "Skills and resources template"
    ];

    if (user?.persona === "business-analyst") {
      return [
        "Business requirement document (BRD) template",
        "Skills and resources template"
      ];
    }

    return allTemplates;
  };

  const filteredTemplates = getFilteredTemplates();

  // Mock history data with project information
  const mockHistorySessions = [
    {
      id: "1",
      name: "E-commerce Platform Requirements",
      date: "2 hours ago",
      project: "E-commerce Platform",
      agent: "SwiftPlan Requirements Analyst"
    },
    {
      id: "2", 
      name: "Mobile App Testing Strategy",
      date: "1 day ago",
      project: "Mobile Banking App",
      agent: "SwiftTest Automated Generator"
    },
    {
      id: "3",
      name: "API Documentation Review", 
      date: "3 days ago",
      project: "Task Management System",
      agent: "Swift Dev Backend Specialist"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{agentName}</h2>
            <p className="text-gray-600">AI-Powered Development Assistant</p>
            {currentProject && (
              <div className="flex items-center space-x-2 mt-1">
                <FolderOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600 font-medium">{currentProject.name}</span>
              </div>
            )}
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Ready</Badge>
      </div>

      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Provide your requirements or specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your project requirements, user stories, technical specifications, or any other relevant information..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px]"
                />
                
                {/* Template Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template (Optional)</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTemplates.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Upload (Optional)</label>
                  {!selectedFile ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragActive 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <div className="space-y-1">
                        <p className="text-sm">Drag and drop or browse files</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT</p>
                        <label htmlFor="file-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">Browse Files</span>
                          </Button>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{input.length} characters</p>
                  <Button onClick={handleProcess} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Process with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>AI-generated results and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                      <p className="text-gray-600">AI is processing your request...</p>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-500 text-center">{Math.round(progress)}% complete</p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={output}
                      readOnly
                      className="min-h-[300px] bg-gray-50"
                      placeholder="AI-generated output will appear here..."
                    />
                    {output && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleGitHubPush}>
                          <Github className="h-4 w-4 mr-2" />
                          Push to GitHub
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your previous AI processing sessions with project information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session Name</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistorySessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="h-4 w-4 text-blue-500" />
                          <span>{session.project}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.agent}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{session.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <GitHubAuthModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSubmit={handleGitHubSubmit}
      />
    </div>
  );
};

export default AgentWorkspace;
