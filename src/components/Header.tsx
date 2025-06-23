import { Code, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FeedbackButton from "./FeedBackButton";
import { useWorkflow } from "@/contexts/WorkflowContext";

const Header = () => {
  const { user, logout } = useUser();
  const { selectProject } = useWorkflow();
  const navigate = useNavigate();

  const { toast } = useToast();
  // Feedback dialog states
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");

  const handleSubmitFeedback = () => {
    if (
      !feedbackType ||
      !feedbackSubject.trim() ||
      !feedbackDescription.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the feedback to your backend
    // console.log("Feedback submitted:", {
    //   type: feedbackType,
    //   subject: feedbackSubject,
    //   description: feedbackDescription,
    //   rating: feedbackRating,
    //   email: feedbackEmail,
    //   user: user?.username,
    //   project: currentProject?.name,
    //   timestamp: new Date().toISOString(),
    // });

    // Reset form and close dialog
    setFeedbackType("");
    setFeedbackSubject("");
    setFeedbackDescription("");
    setFeedbackRating("");
    setFeedbackEmail("");
    setIsFeedbackDialogOpen(false);

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it shortly.",
    });
  };

  const handleLogoClick = () => {
    selectProject(null as any);
    navigate("/");
  };

  return (
    <header className="bg-custom-nav_bg to-black text-white shadow-2xl border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div>
              <img
                src="/Swift-ai-logo.svg"
                alt="Swift AI Logo"
                className="h-6 w-24 object-contain"
              />
              <p className="text-gray-300 text-sm">
                Expedite, Optimize, Realize
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              className="bg-custom-bg hover:bg-gray-700/80 border border-gray-600 text-gray-200"
              asChild
            >
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <FeedbackButton
                isFeedbackDialogOpen={isFeedbackDialogOpen}
                setIsFeedbackDialogOpen={setIsFeedbackDialogOpen}
                feedbackType={feedbackType}
                setFeedbackType={setFeedbackType}
                feedbackSubject={feedbackSubject}
                setFeedbackSubject={setFeedbackSubject}
                feedbackDescription={feedbackDescription}
                setFeedbackDescription={setFeedbackDescription}
                feedbackRating={feedbackRating}
                setFeedbackRating={setFeedbackRating}
                feedbackEmail={feedbackEmail}
                setFeedbackEmail={setFeedbackEmail}
                handleSubmitFeedback={handleSubmitFeedback}
              />
              <Button
                variant="outline"
                onClick={() => {
                  selectProject(null as any);
                  logout();
                  navigate("/");
                }}
                className="border-gray-600 bg-custom-bg text-white hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            {/* <img 
              src="/Swift-ai-logo.svg" 
              alt="Swift AI Logo" 
              className="h-24 w-24 object-contain"
            /> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
