
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export interface AzureDevOpsCredentials {
  organization: string;
  project: string;
  personalAccessToken: string;
}

interface AzureDevOpsAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: AzureDevOpsCredentials) => Promise<void>;
}

const AzureDevOpsAuthModal = ({ isOpen, onClose, onSubmit }: AzureDevOpsAuthModalProps) => {
  const [credentials, setCredentials] = useState<AzureDevOpsCredentials>({
    organization: "",
    project: "",
    personalAccessToken: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.organization || !credentials.project || !credentials.personalAccessToken) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(credentials);
      onClose();
      setCredentials({ organization: "", project: "", personalAccessToken: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-custom-bg">
        <DialogHeader>
          <DialogTitle>Connect to Azure DevOps</DialogTitle>
          <DialogDescription>
            Enter your Azure DevOps credentials to push the generated content to your project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              type="text"
              placeholder="your-organization"
              className="bg-custom-bg"
              value={credentials.organization}
              onChange={(e) => setCredentials(prev => ({ ...prev, organization: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Input
              id="project"
              type="text"
              placeholder="your-project-name"
              className="bg-custom-bg"
              value={credentials.project}
              onChange={(e) => setCredentials(prev => ({ ...prev, project: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personalAccessToken">Personal Access Token</Label>
            <Input
              id="personalAccessToken"
              type="password"
              placeholder="Enter your PAT"
              className="bg-custom-bg"
              value={credentials.personalAccessToken}
              onChange={(e) => setCredentials(prev => ({ ...prev, personalAccessToken: e.target.value }))}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Make sure your PAT has work item read/write permissions
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-custom-bg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 "
            >
              {isSubmitting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AzureDevOpsAuthModal;
