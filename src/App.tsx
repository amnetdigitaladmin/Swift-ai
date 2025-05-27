
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, login } = useUser();

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <WorkflowProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </WorkflowProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
