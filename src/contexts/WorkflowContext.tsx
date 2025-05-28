import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  role: string;
  currentStage?: string;
  lastActivity?: string;
  assignedTeams?: string[];
}

interface Artifact {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  phase: string;
  projectId: string;
  assignedTo?: string;
  status?: "unassigned" | "assigned" | "in-progress" | "completed";
}

interface WorkflowContextType {
  artifacts: Artifact[];
  projects: Project[];
  currentPhase: string | null;
  currentProject: Project | null;
  addArtifact: (artifact: Omit<Artifact, 'id' | 'createdAt' | 'projectId'>) => void;
  moveArtifactToNextPhase: (artifactId: string, nextPhase: string) => void;
  getArtifactsByPhase: (phase: string) => Artifact[];
  setCurrentPhase: (phase: string | null) => void;
  createProject: (name: string, description: string, role: string) => Project;
  selectProject: (project: Project) => void;
  getProjectsByRole: (role: string) => Project[];
  updateProjectStage: (projectId: string, stage: string) => void;
  getAllProjectsWithStatus: () => Project[];
  assignArtifactToUser: (artifactId: string, assignedTo: string) => void;
  updateArtifactStatus: (artifactId: string, status: string) => void;
  getAssignedArtifacts: (assignedTo: string) => Artifact[];
  getUserStories: () => Artifact[];
  assignProjectToTeams: (projectId: string, teamRoles: string[]) => void;
  getProjectsAssignedToTeam: (teamRole: string) => Project[];
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
      role: "business-analyst",
      currentStage: "requirements",
      lastActivity: new Date(Date.now() - 3600000).toISOString(),
      assignedTeams: ["business-analyst", "developer"]
    },
    {
      id: "2",
      name: "Mobile Banking App",
      description: "Designing user interfaces for a secure mobile banking application",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      role: "designer",
      currentStage: "design",
      lastActivity: new Date(Date.now() - 7200000).toISOString(),
      assignedTeams: ["designer", "qa-engineer"]
    },
    {
      id: "3",
      name: "Task Management System",
      description: "Developing a collaborative task management system",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      role: "developer",
      currentStage: "development",
      lastActivity: new Date(Date.now() - 1800000).toISOString(),
      assignedTeams: ["developer"]
    }
  ]);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Load current project from localStorage on mount
  useEffect(() => {
    const savedProjectId = localStorage.getItem('swift-ai-current-project-id');
    if (savedProjectId) {
      const savedProject = projects.find(project => project.id === savedProjectId);
      if (savedProject) {
        setCurrentProject(savedProject);
      }
    }
  }, [projects]);

  // Save current project to localStorage whenever it changes
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('swift-ai-current-project-id', currentProject.id);
    } else {
      localStorage.removeItem('swift-ai-current-project-id');
    }
  }, [currentProject]);

  const addArtifact = (artifact: Omit<Artifact, 'id' | 'createdAt' | 'projectId'>) => {
    if (!currentProject) return;
    
    const newArtifact: Artifact = {
      ...artifact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      projectId: currentProject.id,
      status: artifact.type === "User Story" ? "unassigned" : undefined,
    };
    setArtifacts(prev => [...prev, newArtifact]);
    
    // Update project's last activity and stage
    updateProjectStage(currentProject.id, artifact.phase);
  };

  const moveArtifactToNextPhase = (artifactId: string, nextPhase: string) => {
    setArtifacts(prev => 
      prev.map(artifact => 
        artifact.id === artifactId 
          ? { ...artifact, phase: nextPhase }
          : artifact
      )
    );
    
    // Update project stage when artifact moves
    const artifact = artifacts.find(a => a.id === artifactId);
    if (artifact) {
      updateProjectStage(artifact.projectId, nextPhase);
    }
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
      currentStage: "requirements",
      lastActivity: new Date().toISOString(),
      assignedTeams: []
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

  const updateProjectStage = (projectId: string, stage: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              currentStage: stage,
              lastActivity: new Date().toISOString()
            }
          : project
      )
    );
  };

  const getAllProjectsWithStatus = () => {
    return projects.map(project => {
      const projectArtifacts = artifacts.filter(a => a.projectId === project.id);
      const latestPhase = projectArtifacts.reduce((latest, artifact) => {
        const phases = ["requirements", "design", "development", "testing"];
        const currentPhaseIndex = phases.indexOf(artifact.phase);
        const latestPhaseIndex = phases.indexOf(latest);
        return currentPhaseIndex > latestPhaseIndex ? artifact.phase : latest;
      }, project.currentStage || "requirements");

      return {
        ...project,
        currentStage: latestPhase
      };
    });
  };

  const assignArtifactToUser = (artifactId: string, assignedTo: string) => {
    setArtifacts(prev => 
      prev.map(artifact => 
        artifact.id === artifactId 
          ? { ...artifact, assignedTo, status: "assigned" }
          : artifact
      )
    );
  };

  const updateArtifactStatus = (artifactId: string, status: string) => {
    setArtifacts(prev => 
      prev.map(artifact => 
        artifact.id === artifactId 
          ? { ...artifact, status: status as Artifact['status'] }
          : artifact
      )
    );
  };

  const getAssignedArtifacts = (assignedTo: string) => {
    return artifacts.filter(artifact => artifact.assignedTo === assignedTo);
  };

  const getUserStories = () => {
    if (!currentProject) return [];
    return artifacts.filter(artifact => 
      artifact.type === "User Story" && artifact.projectId === currentProject.id
    );
  };

  const assignProjectToTeams = (projectId: string, teamRoles: string[]) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, assignedTeams: teamRoles, lastActivity: new Date().toISOString() }
          : project
      )
    );
  };

  const getProjectsAssignedToTeam = (teamRole: string) => {
    return projects.filter(project => project.assignedTeams?.includes(teamRole));
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
      updateProjectStage,
      getAllProjectsWithStatus,
      assignArtifactToUser,
      updateArtifactStatus,
      getAssignedArtifacts,
      getUserStories,
      assignProjectToTeams,
      getProjectsAssignedToTeam,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};
