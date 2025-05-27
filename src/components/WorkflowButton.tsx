
import { useState } from "react";
import { ArrowRight, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useToast } from "@/hooks/use-toast";

interface WorkflowButtonProps {
  currentPhase: string;
  nextPhase: string;
  nextPhaseTitle: string;
}

const phaseOrder = ["requirements", "design", "development", "testing"];

const WorkflowButton = ({ currentPhase, nextPhase, nextPhaseTitle }: WorkflowButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getArtifactsByPhase, moveArtifactToNextPhase } = useWorkflow();
  const { toast } = useToast();
  
  const currentArtifacts = getArtifactsByPhase(currentPhase);
  const nextArtifacts = getArtifactsByPhase(nextPhase);

  const handleMoveArtifacts = () => {
    currentArtifacts.forEach(artifact => {
      moveArtifactToNextPhase(artifact.id, nextPhase);
    });
    
    toast({
      title: "Artifacts Moved Successfully",
      description: `${currentArtifacts.length} artifact(s) moved to ${nextPhaseTitle}`,
    });
    
    setIsOpen(false);
  };

  const canMoveToNext = () => {
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const nextIndex = phaseOrder.indexOf(nextPhase);
    return nextIndex === currentIndex + 1;
  };

  if (!canMoveToNext()) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white"
          disabled={currentArtifacts.length === 0}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Push to {nextPhaseTitle}
          {currentArtifacts.length > 0 && (
            <Badge className="ml-2 bg-white/20">{currentArtifacts.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Move Artifacts to {nextPhaseTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Current Phase Artifacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentArtifacts.length > 0 ? (
                  <div className="space-y-2">
                    {currentArtifacts.map(artifact => (
                      <div key={artifact.id} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{artifact.title}</div>
                        <div className="text-gray-500">{artifact.type}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No artifacts to move</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {nextPhaseTitle} Artifacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextArtifacts.length > 0 ? (
                  <div className="space-y-2">
                    {nextArtifacts.map(artifact => (
                      <div key={artifact.id} className="p-2 bg-green-50 rounded text-sm">
                        <div className="font-medium">{artifact.title}</div>
                        <div className="text-gray-500">{artifact.type}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No artifacts yet</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMoveArtifacts}
              disabled={currentArtifacts.length === 0}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
            >
              Move {currentArtifacts.length} Artifact(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowButton;
