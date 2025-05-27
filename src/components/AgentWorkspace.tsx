import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Play, Download, Copy, RefreshCw, Upload, FileText, X, FolderOpen, Calendar, Cloud, Users, BookOpen, CheckCircle, Clock, AlertCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import AzureDevOpsAuthModal, { AzureDevOpsCredentials } from "./AzureDevOpsAuthModal";

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
  const [isAzureDevOpsModalOpen, setIsAzureDevOpsModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const { toast } = useToast();
  const { user } = useUser();
  const { currentProject, addArtifact, getAssignedArtifacts, updateArtifactStatus } = useWorkflow();

  // Get user stories assigned to current user for the current project
  const assignedStories = currentProject 
    ? getAssignedArtifacts(user?.username || "").filter(task => 
        task.projectId === currentProject.id && task.type === "User Story"
      )
    : [];

  const selectedStory = assignedStories.find(story => story.id === selectedStoryId);

  const handleStorySelection = (storyId: string) => {
    setSelectedStoryId(storyId);
    const story = assignedStories.find(s => s.id === storyId);
    if (story) {
      // Pre-populate the input with story content
      setInput(`Working on User Story: ${story.title}\n\nStory Description:\n${story.content}\n\nDevelopment Requirements:\n`);
      toast({
        title: "User Story Selected",
        description: "Story details have been loaded into the workspace",
      });
    }
  };

  const handleStatusUpdate = (storyId: string, newStatus: string) => {
    updateArtifactStatus(storyId, newStatus);
    toast({
      title: "Status Updated",
      description: `Story status updated to ${newStatus}`,
    });
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "assigned":
        return <Badge variant="secondary">Assigned</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleProcess = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide input for the agent to process.",
        variant: "destructive",
      });
      return;
    }

    // Update story status to in-progress if a story is selected
    if (selectedStoryId && selectedStory?.status === "assigned") {
      handleStatusUpdate(selectedStoryId, "in-progress");
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
      
      let outputText = `${agentName} Generated Code:

Based on your input: "${input.substring(0, 100)}..."`;

      if (selectedTemplate) {
        outputText += `\nUsing template: ${selectedTemplate}`;
      }

      if (selectedFile) {
        outputText += `\nDocument processed: ${selectedFile.name}`;
      }

      if (selectedStory) {
        outputText += `\n\nUser Story Context:
Title: ${selectedStory.title}
Description: ${selectedStory.content}`;
      }

      outputText += `

Generated Code Implementation:

// Frontend Component (React)
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeneratedComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize component
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // API call implementation
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Implementation based on user story requirements</p>
            <Button onClick={fetchData}>Refresh Data</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedComponent;

// API Endpoint (Backend)
export async function GET(request: Request) {
  try {
    // Implementation logic based on user story
    const data = await processUserStoryRequirements();
    
    return Response.json({
      success: true,
      data: data
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Database Schema (if needed)
CREATE TABLE user_story_data (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// Test Cases
describe('Generated Component', () => {
  test('should render without crashing', () => {
    render(<GeneratedComponent />);
    expect(screen.getByText('Generated Feature')).toBeInTheDocument();
  });

  test('should fetch data on mount', async () => {
    render(<GeneratedComponent />);
    await waitFor(() => {
      expect(screen.getByText('Implementation based on user story requirements')).toBeInTheDocument();
    });
  });
});

This is AI-generated code based on your user story requirements. The implementation includes:
- Responsive React component with proper TypeScript typing
- Backend API endpoint structure
- Database schema considerations
- Basic test cases
- Error handling and loading states
- Integration with your existing UI components

Next steps:
1. Review the generated code
2. Adapt it to your specific requirements
3. Test the implementation
4. Deploy to your development environment`;

      setOutput(outputText);
      setIsProcessing(false);
      toast({
        title: "Code Generation Complete",
        description: `${agentName} has successfully generated code for your user story.`,
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

  const handleAzureDevOpsPush = () => {
    setIsAzureDevOpsModalOpen(true);
  };

  const handleAzureDevOpsSubmit = async (credentials: AzureDevOpsCredentials) => {
    try {
      console.log("Azure DevOps credentials:", {
        organization: credentials.organization,
        project: credentials.project,
        token: credentials.personalAccessToken.substring(0, 8) + "..."
      });

      toast({
        title: "Azure DevOps Integration Successful",
        description: `Content pushed to ${credentials.organization}/${credentials.project} successfully!`,
      });
      
      localStorage.setItem('azuredevops_organization', credentials.organization);
      localStorage.setItem('azuredevops_project', credentials.project);
      
    } catch (error) {
      console.error("Azure DevOps integration failed:", error);
      toast({
        title: "Azure DevOps Integration Failed",
        description: "Failed to connect to Azure DevOps. Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePushToProjectManager = () => {
    if (!output.trim() || !currentProject) {
      toast({
        title: "Cannot Push to Project Manager",
        description: "No output generated or no project selected.",
        variant: "destructive",
      });
      return;
    }

    const isStoryGenerator = agentName.toLowerCase().includes("story generator");
    
    if (isStoryGenerator) {
      const storyLines = output.split('\n').filter(line => 
        line.trim().startsWith('-') || 
        line.trim().startsWith('*') || 
        line.toLowerCase().includes('user story') ||
        line.toLowerCase().includes('as a')
      );

      if (storyLines.length > 0) {
        storyLines.forEach((story, index) => {
          if (story.trim()) {
            addArtifact({
              title: `User Story ${index + 1}: ${story.substring(0, 50)}...`,
              type: "User Story",
              content: story.trim(),
              phase: "requirements"
            });
          }
        });

        toast({
          title: "Stories Pushed to Project Manager",
          description: `${storyLines.length} user stories have been created and are now available for assignment.`,
        });
      } else {
        addArtifact({
          title: `${agentName} Output`,
          type: "Analysis Document",
          content: output,
          phase: "requirements"
        });

        toast({
          title: "Content Pushed to Project Manager",
          description: "Generated content has been added to the project for review and assignment.",
        });
      }
    } else {
      addArtifact({
        title: `${agentName} Output`,
        type: "Analysis Document", 
        content: output,
        phase: "requirements"
      });

      toast({
        title: "Content Pushed to Project Manager",
        description: "Generated content has been added to the project for review.",
      });
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

      {/* User Story Selection */}
      {assignedStories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Select User Story to Work On
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select value={selectedStoryId} onValueChange={handleStorySelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user story to work on..." />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedStories.map((story) => (
                      <SelectItem key={story.id} value={story.id}>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(story.status)}
                          <span>{story.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedStory && (
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedStory.status)}
                  {getStatusBadge(selectedStory.status)}
                </div>
              )}
            </div>
            
            {selectedStory && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-2">Currently Working On:</h4>
                <h5 className="font-semibold">{selectedStory.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{selectedStory.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(selectedStory.createdAt).toLocaleDateString()}
                  </span>
                  <Select
                    value={selectedStory.status || "assigned"}
                    onValueChange={(value) => handleStatusUpdate(selectedStory.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                        Generating Code...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Code with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Code Output</CardTitle>
                <CardDescription>AI-generated code and implementation</CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                      <p className="text-gray-600">AI is generating code for your user story...</p>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-500 text-center">{Math.round(progress)}% complete</p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={output}
                      readOnly
                      className="min-h-[300px] bg-gray-800 text-gray-100 border-gray-600 font-mono text-xs"
                      placeholder="AI-generated code will appear here..."
                    />
                    {output && (
                      <div className="flex items-center space-x-2 mt-4 flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleAzureDevOpsPush}>
                          <Cloud className="h-4 w-4 mr-2" />
                          Push to Azure DevOps
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePushToProjectManager}>
                          <Users className="h-4 w-4 mr-2" />
                          Push to Project Manager
                        </Button>
                        {selectedStory && selectedStory.status !== "completed" && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(selectedStory.id, "completed")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Story Complete
                          </Button>
                        )}
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

      <AzureDevOpsAuthModal
        isOpen={isAzureDevOpsModalOpen}
        onClose={() => setIsAzureDevOpsModalOpen(false)}
        onSubmit={handleAzureDevOpsSubmit}
      />
    </div>
  );
};

export default AgentWorkspace;
