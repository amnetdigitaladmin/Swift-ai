import {MessageSquare} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
const FeedbackButton = ({
    isFeedbackDialogOpen,
    setIsFeedbackDialogOpen,
    feedbackType,
    setFeedbackType,
    feedbackSubject,
    setFeedbackSubject,
    feedbackDescription,
    setFeedbackDescription,
    feedbackRating,
    setFeedbackRating,
    feedbackEmail,
    setFeedbackEmail,
    handleSubmitFeedback
  }) => (
    <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-custom-bg text-gray-200 hover:bg-gray-800 border-gray-600"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-custom-bg border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-200 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Share Your Feedback
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Feedback Type <span className="text-red-400">*</span>
            </label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
           <SelectTrigger className="bg-custom-bg border-gray-600 text-white focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors">
            <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-600">
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="improvement">General Improvement</SelectItem>
                <SelectItem value="compliment">Compliment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Subject <span className="text-red-400">*</span>
            </label>
            <Input
              value={feedbackSubject}
              onChange={(e) => setFeedbackSubject(e.target.value)}
              placeholder="Brief summary of your feedback..."
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Description <span className="text-red-400">*</span>
            </label>
            <Textarea
              value={feedbackDescription}
              onChange={(e) => setFeedbackDescription(e.target.value)}
              placeholder="Please provide detailed feedback..."
              rows={4}
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Rating (Optional)
            </label>
            <Select value={feedbackRating} onValueChange={setFeedbackRating}>
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white focus:border-gradient-background-from">
                <SelectValue placeholder="Rate your experience" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-600">
                <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                <SelectItem value="2">⭐⭐ Poor</SelectItem>
                <SelectItem value="1">⭐ Very Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Contact Email (Optional)
            </label>
            <Input
              type="email"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsFeedbackDialogOpen(false)}
              className="bg-custom-bg text-gray-200 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
);

export default FeedbackButton;