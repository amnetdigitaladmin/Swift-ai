
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: GitHubCredentials) => void;
}

export interface GitHubCredentials {
  username: string;
  repository: string;
  token: string;
}

const GitHubAuthModal = ({ isOpen, onClose, onSubmit }: GitHubAuthModalProps) => {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !repository.trim() || !token.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        username: username.trim(),
        repository: repository.trim(),
        token: token.trim(),
      });
      
      // Reset form on successful submission
      setUsername("");
      setRepository("");
      setToken("");
      onClose();
    } catch (error) {
      console.error("GitHub authentication failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Repository Setup
          </DialogTitle>
          <DialogDescription>
            Enter your GitHub credentials to push your generated content to a repository.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">GitHub Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repository">Repository Name</Label>
            <Input
              id="repository"
              type="text"
              placeholder="Enter repository name"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token">Personal Access Token</Label>
            <div className="relative">
              <Input
                id="token"
                type={showToken ? "text" : "password"}
                placeholder="Enter your GitHub personal access token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isSubmitting}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowToken(!showToken)}
                disabled={isSubmitting}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Generate a personal access token from GitHub Settings → Developer settings → Personal access tokens
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubAuthModal;
