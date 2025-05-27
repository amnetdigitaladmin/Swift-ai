
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  persona: string;
  allowedPhases: string[];
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string, persona: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const getPersonaPhases = (persona: string): string[] => {
  const personaMapping: Record<string, string[]> = {
    "business-analyst": ["requirements"],
    "designer": ["design"],
    "developer": ["development"],
    "qa-engineer": ["testing"],
    "project-manager": ["requirements", "design", "development", "testing"],
    "admin": ["requirements", "design", "development", "testing"]
  };
  
  return personaMapping[persona] || [];
};

const validateCredentials = (username: string, password: string, persona: string): boolean => {
  // Define specific credentials for each persona
  const credentials: Record<string, { username: string; password: string }> = {
    "business-analyst": { username: "analyst", password: "password" },
    "project-manager": { username: "manager", password: "password" }
  };

  // For business analyst and project manager, validate specific credentials
  if (persona === "business-analyst" || persona === "project-manager") {
    const requiredCreds = credentials[persona];
    return username === requiredCreds.username && password === requiredCreds.password;
  }

  // For other personas, accept any non-empty credentials for now
  return username.trim() !== "" && password.trim() !== "";
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, persona: string): boolean => {
    if (validateCredentials(username, password, persona)) {
      const allowedPhases = getPersonaPhases(persona);
      setUser({
        username,
        persona,
        allowedPhases
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
