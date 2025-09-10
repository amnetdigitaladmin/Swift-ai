import OutputSection from "./OutputSection";
import OutputSectionWithTabs from "./OutputSectionWithTabs";

interface ConditionalOutputProps {
  output: string | { docx_download_url?: string; [key: string]: any };
  isProcessing: boolean;
  progress: number;
  selectedStory: any;
  agentName?: string;
  onCopy: () => void;
  onDownload: () => void;
  onS3Download: (url: string) => void;
  onAzureDevOpsPush: () => void;
  onPushToProjectManager: () => void;
  onMarkStoryComplete: () => void;
}

const ConditionalOutput = (props: any) => {
  const isSwiftCodeFrontend = props.agentName?.includes("SwiftBuild Frontend");
  const isSwiftCodeBackend = props.agentName?.includes("SwiftBuild Backend");
  const isSwiftBuildMobile = props.agentName?.includes("SwiftBuild Mobile");
  const shouldUseTabsOutput = isSwiftCodeFrontend || isSwiftCodeBackend || isSwiftBuildMobile ;

  return shouldUseTabsOutput ? (
    <OutputSectionWithTabs {...props} />
  ) : (
    <OutputSection {...props} />
  );
};

export default ConditionalOutput;
