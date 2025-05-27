
import { createContext, useContext, useState, ReactNode } from "react";

interface Artifact {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  phase: string;
}

interface WorkflowContextType {
  artifacts: Artifact[];
  currentPhase: string | null;
  addArtifact: (artifact: Omit<Artifact, 'id' | 'createdAt'>) => void;
  moveArtifactToNextPhase: (artifactId: string, nextPhase: string) => void;
  getArtifactsByPhase: (phase: string) => Artifact[];
  setCurrentPhase: (phase: string | null) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider = ({ children }: WorkflowProviderProps) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

  const addArtifact = (artifact: Omit<Artifact, 'id' | 'createdAt'>) => {
    const newArtifact: Artifact = {
      ...artifact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setArtifacts(prev => [...prev, newArtifact]);
  };

  const moveArtifactToNextPhase = (artifactId: string, nextPhase: string) => {
    setArtifacts(prev => 
      prev.map(artifact => 
        artifact.id === artifactId 
          ? { ...artifact, phase: nextPhase }
          : artifact
      )
    );
  };

  const getArtifactsByPhase = (phase: string) => {
    return artifacts.filter(artifact => artifact.phase === phase);
  };

  return (
    <WorkflowContext.Provider value={{
      artifacts,
      currentPhase,
      addArtifact,
      moveArtifactToNextPhase,
      getArtifactsByPhase,
      setCurrentPhase,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};
