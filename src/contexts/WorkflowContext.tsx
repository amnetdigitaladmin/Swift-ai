
import { createContext, useContext, useState, ReactNode } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  role: string;
}

interface Artifact {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  phase: string;
  projectId: string;
}

interface WorkflowContextType {
  artifacts: Artifact[];
  projects: Project[];
  currentPhase: string | null;
  currentProject: Project | null;
  addArtifact: (artifact: Omit<Artifact, 'id' | 'createdAt'>) => void;
  moveArtifactToNextPhase: (artifactId: string, nextPhase: string) => void;
  getArtifactsByPhase: (phase: string) => Artifact[];
  setCurrentPhase: (phase: string | null) => void;
  createProject: (name: string, description: string, role: string) => Project;
  selectProject: (project: Project) => void;
  getProjectsByRole: (role: string) => Project[];
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
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Building a modern e-commerce platform with React and Node.js",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      role: "business-analyst"
    },
    {
      id: "2",
      name: "Mobile Banking App",
      description: "Designing user interfaces for a secure mobile banking application",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      role: "designer"
    },
    {
      id: "3",
      name: "Task Management System",
      description: "Developing a collaborative task management system",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      role: "developer"
    }
  ]);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const addArtifact = (artifact: Omit<Artifact, 'id' | 'createdAt'>) => {
    if (!currentProject) return;
    
    const newArtifact: Artifact = {
      ...artifact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      projectId: currentProject.id,
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
    if (!currentProject) return [];
    return artifacts.filter(artifact => 
      artifact.phase === phase && artifact.projectId === currentProject.id
    );
  };

  const createProject = (name: string, description: string, role: string) => {
    const newProject: Project = {
      id: (Date.now() + Math.random()).toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      role,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const selectProject = (project: Project) => {
    setCurrentProject(project);
  };

  const getProjectsByRole = (role: string) => {
    return projects.filter(project => project.role === role);
  };

  return (
    <WorkflowContext.Provider value={{
      artifacts,
      projects,
      currentPhase,
      currentProject,
      addArtifact,
      moveArtifactToNextPhase,
      getArtifactsByPhase,
      setCurrentPhase,
      createProject,
      selectProject,
      getProjectsByRole,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};
