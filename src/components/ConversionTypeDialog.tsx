import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database, Code } from "lucide-react";

interface ConversionTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: "sql" | "code") => void;
}

const ConversionTypeDialog: React.FC<ConversionTypeDialogProps> = ({
  open,
  onOpenChange,
  onSelectType,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-custom-bg">
        <DialogHeader>
          <DialogTitle className="text-white">
            Choose Conversion Type
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select the type of conversion you want to perform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={() => onSelectType("sql")}
            className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
          >
            <Database className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">SQL Conversion</div>
              <div className="text-sm opacity-90">
                Convert between SQL dialects
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onSelectType("code")}
            className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
          >
            <Code className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">Code Conversion</div>
              <div className="text-sm opacity-90">
                Convert between programming languages
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversionTypeDialog;
