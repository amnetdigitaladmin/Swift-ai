
import { ArrowRight, Shield, Lock, Brain, Database, Code, Server, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ArchitectureDiagram = () => {
  // Define component styles
  const boxStyle = "flex flex-col items-center justify-center rounded-lg p-4 shadow-md text-center";
  const arrowStyle = "text-gray-400 mx-2 transform rotate-0 md:rotate-0";
  const labelStyle = "text-xs font-medium mt-2";

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-8">SDLC Agentic Framework Architecture</h2>
        
        <div className="flex flex-col gap-8">
          {/* Front-End Layer */}
          <div className="flex flex-col md:flex-row justify-around items-center gap-4">
            <div className={`${boxStyle} bg-blue-50 border border-blue-200 w-64`}>
              <div className="flex items-center mb-2">
                <Layers className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">User Interface</span>
              </div>
              <p className="text-sm text-gray-600">React + Tailwind CSS</p>
              <div className="text-xs mt-3 text-gray-500 grid grid-cols-2 gap-2 w-full">
                <div className="bg-blue-100 rounded p-1">Agents</div>
                <div className="bg-blue-100 rounded p-1">Phases</div>
                <div className="bg-blue-100 rounded p-1">Workspaces</div>
                <div className="bg-blue-100 rounded p-1">Input/Output</div>
              </div>
            </div>

            <ArrowRight className={arrowStyle} />

            <div className={`${boxStyle} bg-purple-50 border border-purple-200 w-64`}>
              <div className="flex items-center mb-2">
                <Server className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-semibold">Application Logic</span>
              </div>
              <p className="text-sm text-gray-600">React State Management</p>
              <div className="text-xs mt-3 text-gray-500 grid grid-cols-2 gap-2 w-full">
                <div className="bg-purple-100 rounded p-1">Agent Selection</div>
                <div className="bg-purple-100 rounded p-1">Request Handling</div>
                <div className="bg-purple-100 rounded p-1">Phase Tracking</div>
                <div className="bg-purple-100 rounded p-1">Result Processing</div>
              </div>
            </div>
          </div>

          {/* Security & Guardrails Layer */}
          <div className="mx-auto w-full max-w-3xl">
            <div className={`${boxStyle} bg-green-50 border border-green-200`}>
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold">Security & Guardrailing Layer</span>
              </div>
              <p className="text-sm text-gray-600">Input Validation & Prompt Security</p>
              <div className="flex justify-around mt-3 w-full">
                <div className="text-xs flex flex-col items-center">
                  <Lock className="h-4 w-4 text-green-600 mb-1" />
                  <span className="bg-green-100 rounded p-1">API Key Management</span>
                </div>
                <div className="text-xs flex flex-col items-center">
                  <Shield className="h-4 w-4 text-green-600 mb-1" />
                  <span className="bg-green-100 rounded p-1">Content Filtering</span>
                </div>
                <div className="text-xs flex flex-col items-center">
                  <Layers className="h-4 w-4 text-green-600 mb-1" />
                  <span className="bg-green-100 rounded p-1">Prompt Guardrails</span>
                </div>
              </div>
            </div>
          </div>

          {/* LLM and Backend Services */}
          <div className="flex flex-col md:flex-row justify-around items-center gap-4">
            <div className={`${boxStyle} bg-yellow-50 border border-yellow-200 w-64`}>
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-semibold">AI Service Connector</span>
              </div>
              <p className="text-sm text-gray-600">LLM Integration Layer</p>
              <div className="mt-3 text-xs grid grid-cols-2 gap-2 w-full">
                <div className="bg-yellow-100 rounded p-1">OpenAI GPT-4</div>
                <div className="bg-yellow-100 rounded p-1">Anthropic Claude</div>
                <div className="bg-yellow-100 rounded p-1">API Management</div>
                <div className="bg-yellow-100 rounded p-1">Model Selection</div>
              </div>
            </div>

            <ArrowRight className={arrowStyle} />

            <div className={`${boxStyle} bg-red-50 border border-red-200 w-64`}>
              <div className="flex items-center mb-2">
                <Database className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-semibold">Data Storage</span>
              </div>
              <p className="text-sm text-gray-600">State & History Management</p>
              <div className="mt-3 text-xs grid grid-cols-2 gap-2 w-full">
                <div className="bg-red-100 rounded p-1">User Sessions</div>
                <div className="bg-red-100 rounded p-1">Agent History</div>
                <div className="bg-red-100 rounded p-1">Generated Assets</div>
                <div className="bg-red-100 rounded p-1">Project Data</div>
              </div>
            </div>
          </div>

          {/* Output Layer */}
          <div className="mx-auto w-full max-w-3xl">
            <div className={`${boxStyle} bg-indigo-50 border border-indigo-200`}>
              <div className="flex items-center mb-2">
                <Code className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-semibold">Development Outputs</span>
              </div>
              <p className="text-sm text-gray-600">AI-Generated Development Artifacts</p>
              <div className="flex flex-wrap justify-around gap-2 mt-3 w-full">
                <div className="text-xs bg-indigo-100 rounded p-1">Requirements Docs</div>
                <div className="text-xs bg-indigo-100 rounded p-1">UI/UX Designs</div>
                <div className="text-xs bg-indigo-100 rounded p-1">Code Implementation</div>
                <div className="text-xs bg-indigo-100 rounded p-1">Test Cases</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 border-t pt-4">
          <div className="text-sm font-medium mb-2">Legend:</div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-1"></div>
              <span className="text-xs">User Interface</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded mr-1"></div>
              <span className="text-xs">App Logic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-1"></div>
              <span className="text-xs">Security Layer</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-1"></div>
              <span className="text-xs">AI Services</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-1"></div>
              <span className="text-xs">Data Storage</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded mr-1"></div>
              <span className="text-xs">Outputs</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchitectureDiagram;
