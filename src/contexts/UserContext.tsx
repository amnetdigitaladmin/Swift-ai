
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  persona: string;
  allowedPhases: string[];
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string, persona: string) => void;
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

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, persona: string) => {
    // In a real app, you would validate credentials here
    const allowedPhases = getPersonaPhases(persona);
    setUser({
      username,
      persona,
      allowedPhases
    });
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
