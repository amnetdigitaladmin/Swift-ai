import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Download, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import TemplateDocumentDialog from "./TemplateDocumentDialog";

interface AgentWorkspaceProps {
  agentName: string;
  onBack: () => void;
}

const AgentWorkspace = ({ agentName, onBack }: AgentWorkspaceProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { toast } = useToast();
  const { user } = useUser();

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
      setOutput(`${agentName} Analysis Results:

Based on your input: "${input}"

Generated output with AI assistance:
- Comprehensive analysis completed
- Best practices recommendations included
- Implementation guidelines provided
- Risk assessment performed
- Next steps outlined

This is a simulated output. In production, this would connect to OpenAI/Anthropic APIs for real processing.`);
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

  const handleTemplateClick = (template: string) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleDocumentSelect = (file: File) => {
    setInput(`Template: ${selectedTemplate}\nDocument: ${file.name}\n\nPlease generate a comprehensive ${selectedTemplate.toLowerCase()} based on the uploaded document "${file.name}"...`);
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
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Ready</Badge>
      </div>

      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Provide your requirements or specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your project requirements, user stories, technical specifications, or any other relevant information..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px]"
                />
                <div className="flex items-center justify-between mt-4">
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
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template}</CardTitle>
                  <CardDescription>Pre-built template for {template.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleTemplateClick(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your previous AI processing sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["E-commerce Platform Requirements", "Mobile App Testing Strategy", "API Documentation Review"].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{session}</h4>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TemplateDocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        templateName={selectedTemplate}
        onDocumentSelect={handleDocumentSelect}
      />
    </div>
  );
};

export default AgentWorkspace;
