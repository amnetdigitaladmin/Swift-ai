import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Portal } from "@radix-ui/react-portal";

export function InfoTooltip({ message }: { message: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2 cursor-pointer text-muted-foreground">
            <Info className="w-4 h-4" />
          </span>
        </TooltipTrigger>
        <Portal>
          <TooltipContent side="top" className="max-w-xs z-[9999]">
            <p>{message}</p>
          </TooltipContent>
        </Portal>
      </Tooltip>
    </TooltipProvider>
  );
}
