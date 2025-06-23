import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Calendar, Upload, FileText, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "./InfoTooltip";

// Define the form data interface
interface ProjectFormData {
  // Project Data
  projectName: string;
  projectCode: string;
  description: string;
  startDate: string;
  endDate: string;

  // Tech Stack
  languages: string[];
  frameworks: string[];
  databases: string[];
  containerPlatform: string;

  // Infrastructure
  targetEnvironments: string[];
  cloudProvider: string;
  iacTool: string;

  // CI/CD
  cicdTool: string;
  testCoverageThreshold: string;
  loadTestProfile: string;
  securityScanFrequency: string;

  // Security
  complianceStandards: string[];
  staticAnalysisTool: string;
  dependencyScanSchedule: string;

  // Notifications
  notificationChannels: string[];
  alertThresholds: string;

  // Advance settings
  customTemplates: string;
  featureFlags: Record<string, string>;
  environmentVariables: Record<string, string>;
  uploadedFiles: File[];
}

interface CreateProjectStepperSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

const CreateProjectStepperSimple = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectStepperSimpleProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 7;

  // Initialize form data with default values
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    projectCode: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",

    // Tech Stack Step
    languages: ["python"],
    frameworks: [],
    databases: ["postgresql"],
    containerPlatform: "docker",

    // Infrastructure Step
    targetEnvironments: ["Dev", "QA"],
    cloudProvider: "aws",
    iacTool: "terraform",

    // CI/CD Step
    cicdTool: "github-actions",
    testCoverageThreshold: "80",
    loadTestProfile: "medium",
    securityScanFrequency: "on-commit",

    // Security Step
    complianceStandards: ["gdpr"],
    staticAnalysisTool: "sonarqube",
    dependencyScanSchedule: "on-build",

    // Notifications Step
    notificationChannels: [],
    alertThresholds: "medium",

    // Advance settings
    customTemplates: "",
    featureFlags: {},
    environmentVariables: {},
    uploadedFiles: [],
  });

  // Validation function
  const validateStep = (step: number): boolean => {
    // Temporarily disable all validation to debug modal closing issue
    // return true;

    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.projectName.trim()) {
          newErrors.projectName = "Project name is required";
        }
        if (!formData.projectCode.trim()) {
          newErrors.projectCode = "Project code is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        if (!formData.startDate) {
          newErrors.startDate = "Start date is required";
        }
        break;
      case 2:
        if (formData.languages.length === 0) {
          newErrors.languages = "At least one language is required";
        }
        break;
      case 3:
        if (formData.targetEnvironments.length === 0) {
          newErrors.targetEnvironments = "At least one environment is required";
        }
        if (!formData.cloudProvider) {
          newErrors.cloudProvider = "Cloud provider is required";
        }
        if (!formData.iacTool) {
          newErrors.iacTool = "IaC tool is required";
        }
        break;
      case 4:
        if (!formData.cicdTool) {
          newErrors.cicdTool = "CI/CD tool is required";
        }
        break;
      case 5:
        if (!formData.dependencyScanSchedule) {
          newErrors.dependencyScanSchedule =
            "Dependency scan schedule is required";
        }
        break;
      case 6:
        if (formData.notificationChannels.length === 0) {
          newErrors.notificationChannels =
            "At least one notification channel is required";
        }
        break;
      case 7:
        // Additional validation for the new section
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // console.log("handleNext called for step:", currentStep);
    const isValid = validateStep(currentStep);
    // console.log("Validation result:", isValid);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // File upload handlers
  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    updateFormData("uploadedFiles", [...formData.uploadedFiles, ...fileArray]);
  };

  const handleFileRemove = (index: number) => {
    const newFiles = formData.uploadedFiles.filter((_, i) => i !== index);
    updateFormData("uploadedFiles", newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderProjectDataStep();
      case 2:
        return renderTechStackStep();
      case 3:
        return renderInfrastructureStep();
      case 4:
        return renderCICDStep();
      case 5:
        return renderSecurityStep();
      case 6:
        return renderNotificationsStep();
      case 7:
        return renderAdvanceSettings();
      default:
        return null;
    }
  };

  const renderProjectDataStep = () => (
    <div className="space-y-4 col-span-2">
      <div>
        <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
          Project Name
          <InfoTooltip message="Enter a unique, human-readable project name." />
        </label>
        <Input
          value={formData.projectName}
          onChange={(e) => updateFormData("projectName", e.target.value)}
          placeholder="Enter project name..."
          className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
        />
        {errors.projectName && (
          <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
          Project Code
          <InfoTooltip message="Alphanumeric code used for automation references; must be unique." />
        </label>
        <Input
          value={formData.projectCode}
          onChange={(e) => updateFormData("projectCode", e.target.value)}
          placeholder="PRJ001"
          className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
        />
        {errors.projectCode && (
          <p className="text-red-500 text-sm mt-1">{errors.projectCode}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
          Description
          <InfoTooltip message="Briefly describe the project's purpose and goals." />
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Describe your project..."
          rows={3}
          className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
            Start Date
            <InfoTooltip message="Select the project kickoff date." />
          </label>
          <div className="relative">
            <Input
              value={formData.startDate}
              onChange={(e) => updateFormData("startDate", e.target.value)}
              type="date"
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors pr-10 appearance-none cursor-pointer"
              onClick={(e) => {
                const input = e.target as HTMLInputElement;
                input.showPicker?.();
              }}
            />
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
            End Date
            <InfoTooltip message="Optionally set a target completion date." />
          </label>
          <div className="relative">
            <Input
              value={formData.endDate}
              onChange={(e) => updateFormData("endDate", e.target.value)}
              type="date"
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors pr-10 appearance-none cursor-pointer"
              onClick={(e) => {
                const input = e.target as HTMLInputElement;
                input.showPicker?.();
              }}
            />
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderTechStackStep = () => (
    <div className="space-y-6 col-span-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">
            Tech Stack & Frameworks
          </h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Language(s)
              <InfoTooltip message="Choose primary development languages." />
            </label>
            <Select
              onValueChange={(value) => {
                if (!formData.languages.includes(value)) {
                  updateFormData("languages", [...formData.languages, value]);
                }
              }}
              value=""
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select languages" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
            {formData.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-gray-700 text-white text-sm rounded"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() =>
                        updateFormData(
                          "languages",
                          formData.languages.filter((l) => l !== lang)
                        )
                      }
                      className="ml-2 text-gray-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.languages && (
              <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Framework(s)
              <InfoTooltip message="Select frameworks used (e.g. React, Spring)." />
            </label>
            <Select
              onValueChange={(value) => {
                if (!formData.frameworks.includes(value)) {
                  updateFormData("frameworks", [...formData.frameworks, value]);
                }
              }}
              value=""
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select frameworks" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="django">Django</SelectItem>
                <SelectItem value="fastapi">FastAPI</SelectItem>
              </SelectContent>
            </Select>
            {formData.frameworks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.frameworks.map((framework) => (
                  <span
                    key={framework}
                    className="px-2 py-1 bg-gray-700 text-white text-sm rounded"
                  >
                    {framework}
                    <button
                      type="button"
                      onClick={() =>
                        updateFormData(
                          "frameworks",
                          formData.frameworks.filter((f) => f !== framework)
                        )
                      }
                      className="ml-2 text-gray-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Database(s)
              <InfoTooltip message="Pick one or more database technologies." />
            </label>
            <Select
              onValueChange={(value) => {
                if (!formData.databases.includes(value)) {
                  updateFormData("databases", [...formData.databases, value]);
                }
              }}
              value=""
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select databases" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="sqlserver">SQL Server</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
              </SelectContent>
            </Select>
            {formData.databases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.databases.map((db) => (
                  <span
                    key={db}
                    className="px-2 py-1 bg-gray-700 text-white text-sm rounded"
                  >
                    {db}
                    <button
                      type="button"
                      onClick={() =>
                        updateFormData(
                          "databases",
                          formData.databases.filter((d) => d !== db)
                        )
                      }
                      className="ml-2 text-gray-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.databases && (
              <p className="text-red-500 text-sm mt-1">{errors.databases}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Container Platform
              <InfoTooltip message="Select containerization platform, if any." />
            </label>
            <RadioGroup
              onValueChange={(value) =>
                updateFormData("containerPlatform", value)
              }
              value={formData.containerPlatform}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docker" id="docker" />
                <Label htmlFor="docker" className="text-gray-200">
                  Docker
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kubernetes" id="kubernetes" />
                <Label htmlFor="kubernetes" className="text-gray-200">
                  Kubernetes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="text-gray-200">
                  None
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfrastructureStep = () => (
    <div className="space-y-6 col-span-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">Infrastructure</h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Target Environments
              <InfoTooltip message="Environments to provision: Dev, QA, Staging, Prod." />
            </label>
            <div className="flex flex-col space-y-2">
              {["Dev", "QA", "Staging", "Prod"].map((env) => (
                <div key={env} className="flex items-center space-x-2">
                  <Checkbox
                    id={env}
                    checked={formData.targetEnvironments.includes(env)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("targetEnvironments", [
                          ...formData.targetEnvironments,
                          env,
                        ]);
                      } else {
                        updateFormData(
                          "targetEnvironments",
                          formData.targetEnvironments.filter((v) => v !== env)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={env} className="text-gray-200">
                    {env}
                  </Label>
                </div>
              ))}
            </div>
            {errors.targetEnvironments && (
              <p className="text-red-500 text-sm mt-1">
                {errors.targetEnvironments}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Cloud Provider
              <InfoTooltip message="Choose your primary cloud or on-prem provider." />
            </label>
            <Select
              onValueChange={(value) => updateFormData("cloudProvider", value)}
              value={formData.cloudProvider}
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select cloud provider" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
                <SelectItem value="gcp">GCP</SelectItem>
                <SelectItem value="on-prem">On-Premises</SelectItem>
              </SelectContent>
            </Select>
            {errors.cloudProvider && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cloudProvider}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              IaC Tool
              <InfoTooltip message="Select Infrastructure-as-Code tooling." />
            </label>
            <Select
              onValueChange={(value) => updateFormData("iacTool", value)}
              value={formData.iacTool}
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select IaC tool" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="terraform">Terraform</SelectItem>
                <SelectItem value="cloudformation">CloudFormation</SelectItem>
                <SelectItem value="pulumi">Pulumi</SelectItem>
                <SelectItem value="ansible">Ansible</SelectItem>
              </SelectContent>
            </Select>
            {errors.iacTool && (
              <p className="text-red-500 text-sm mt-1">{errors.iacTool}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCICDStep = () => (
    <div className="space-y-6 col-span-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">CI/CD & Testing</h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              CI/CD Tool
              <InfoTooltip message="Choose your continuous integration/ delivery tool." />
            </label>
            <Select
              onValueChange={(value) => updateFormData("cicdTool", value)}
              value={formData.cicdTool}
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select CI/CD tool" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="github-actions">GitHub Actions</SelectItem>
                <SelectItem value="jenkins">Jenkins</SelectItem>
                <SelectItem value="gitlab-ci">GitLab CI</SelectItem>
                <SelectItem value="circleci">CircleCI</SelectItem>
              </SelectContent>
            </Select>
            {errors.cicdTool && (
              <p className="text-red-500 text-sm mt-1">{errors.cicdTool}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Test Coverage Threshold
              <InfoTooltip message="Minimum acceptable code coverage percentage." />
            </label>
            <Input
              value={formData.testCoverageThreshold}
              onChange={(e) =>
                updateFormData("testCoverageThreshold", e.target.value)
              }
              placeholder="starts from 80%"
              type="number"
              min="0"
              max="100"
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
            {errors.testCoverageThreshold && (
              <p className="text-red-500 text-sm mt-1">
                {errors.testCoverageThreshold}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Load Test Profile
              <InfoTooltip message="Select intensity of load tests: Light, Medium, Heavy." />
            </label>
            <Select
              onValueChange={(value) =>
                updateFormData("loadTestProfile", value)
              }
              value={formData.loadTestProfile}
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select load test profile" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
            {errors.loadTestProfile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.loadTestProfile}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Security Scan Frequency
              <InfoTooltip message="How often to run automated security scans." />
            </label>
            <RadioGroup
              onValueChange={(value) =>
                updateFormData("securityScanFrequency", value)
              }
              value={formData.securityScanFrequency}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on-commit" id="on-commit" />
                <Label htmlFor="on-commit" className="text-gray-200">
                  On commit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="text-gray-200">
                  Daily
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="text-gray-200">
                  Weekly
                </Label>
              </div>
            </RadioGroup>
            {errors.securityScanFrequency && (
              <p className="text-red-500 text-sm mt-1">
                {errors.securityScanFrequency}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityStep = () => (
    <div className="space-y-6 col-span-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">
            Security & Compliance
          </h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Compliance Standards
              <InfoTooltip message="Select regulations to enforce (e.g. GDPR, PCI, ISO 27001)." />
            </label>
            <Select
              onValueChange={(value) => {
                if (!formData.complianceStandards.includes(value)) {
                  updateFormData("complianceStandards", [
                    ...formData.complianceStandards,
                    value,
                  ]);
                }
              }}
              value=""
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                <SelectValue placeholder="Select compliance standards" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="gdpr">GDPR</SelectItem>
                <SelectItem value="pci">PCI DSS</SelectItem>
                <SelectItem value="iso27001">ISO 27001</SelectItem>
                <SelectItem value="hipaa">HIPAA</SelectItem>
              </SelectContent>
            </Select>
            {formData.complianceStandards.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.complianceStandards.map((standard) => (
                  <span
                    key={standard}
                    className="px-2 py-1 bg-gray-700 text-white text-sm rounded"
                  >
                    {standard}
                    <button
                      type="button"
                      onClick={() =>
                        updateFormData(
                          "complianceStandards",
                          formData.complianceStandards.filter(
                            (s) => s !== standard
                          )
                        )
                      }
                      className="ml-2 text-gray-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Static Analysis Tool
              <InfoTooltip message="Tool for static code analysis (SAST)." />
            </label>
            <Select
              onValueChange={(value) =>
                updateFormData("staticAnalysisTool", value)
              }
              value={formData.staticAnalysisTool}
            >
              <SelectTrigger className="bg-custom-bg border-gray-600 text-white text-start">
                <SelectValue placeholder="Select static analysis tool" />
              </SelectTrigger>
              <SelectContent className="bg-custom-bg border-gray-700">
                <SelectItem value="sonarqube">SonarQube</SelectItem>
                <SelectItem value="fortify">Fortify</SelectItem>
                <SelectItem value="veracode">Veracode</SelectItem>
                <SelectItem value="checkmarx">Checkmarx</SelectItem>
              </SelectContent>
            </Select>
            {errors.staticAnalysisTool && (
              <p className="text-red-500 text-sm mt-1">
                {errors.staticAnalysisTool}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Dependency Scan Schedule
              <InfoTooltip message="When to run dependency vulnerability checks." />
            </label>
            <RadioGroup
              onValueChange={(value) =>
                updateFormData("dependencyScanSchedule", value)
              }
              value={formData.dependencyScanSchedule}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on-build" id="on-build" />
                <Label htmlFor="on-build" className="text-gray-200">
                  On build
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily-scan" />
                <Label htmlFor="daily-scan" className="text-gray-200">
                  Daily
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly-scan" />
                <Label htmlFor="weekly-scan" className="text-gray-200">
                  Weekly
                </Label>
              </div>
            </RadioGroup>
            {errors.dependencyScanSchedule && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dependencyScanSchedule}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsStep = () => {
    return (
      <div className="space-y-6 col-span-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">
            Notifications & Alerts
          </h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Notification Channels
              <InfoTooltip message="Where to send project alerts: Email, Slack, Teams." />
            </label>
            <div className="flex flex-col space-y-2">
              {["Email", "Slack", "Teams"].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel}
                    checked={formData.notificationChannels.includes(channel)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("notificationChannels", [
                          ...formData.notificationChannels,
                          channel,
                        ]);
                      } else {
                        updateFormData(
                          "notificationChannels",
                          formData.notificationChannels.filter(
                            (v) => v !== channel
                          )
                        );
                      }
                    }}
                  />
                  <Label htmlFor={channel} className="text-gray-200">
                    {channel}
                  </Label>
                </div>
              ))}
            </div>
            {errors.notificationChannels && (
              <p className="text-red-500 text-sm mt-1">
                {errors.notificationChannels}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Alert Thresholds
              <InfoTooltip message="Define alert thresholds for key events." />
            </label>
            <Input
              value={formData.alertThresholds}
              onChange={(e) =>
                updateFormData("alertThresholds", e.target.value)
              }
              placeholder="e.g., Test failures > 5, Security issues > 0"
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAdvanceSettings = () => {
    return (
      <div className="space-y-6 col-span-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">
            Advanced Settings
          </h3>

          {/* Custom Templates Field */}
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Custom Templates
              <InfoTooltip message="Upload or select custom docs (reqs, test plans)." />
            </label>

            {/* Compact File Upload Area */}
            <div className="mt-2 flex items-center space-x-3">
              <div
                className="flex-1 border-2 border-dashed border-gray-600 rounded-md p-3 hover:border-gray-500 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {formData.uploadedFiles.length > 0
                      ? `${formData.uploadedFiles.length} file(s) uploaded`
                      : "Drag files here or click to upload"}
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.md,.json,.yaml,.yml"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="bg-custom-bg text-gray-200 border-gray-600 hover:border-gray-500"
              >
                Browse
              </Button>
            </div>

            {/* Compact Uploaded Files List */}
            {formData.uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-800 rounded-md px-3 py-1.5 text-sm"
                  >
                    <FileText className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-200 truncate max-w-32">
                      {file.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFileRemove(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-400 text-xs mt-2">
              Supported: PDF, DOC, DOCX, TXT, MD, JSON, YAML
            </p>
          </div>

          {/* Feature Flags Field */}
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Feature Flags
              <InfoTooltip message="Toggle experimental features on/off." />
            </label>
            <div className="space-y-2">
              {Object.entries(formData.featureFlags).map(
                ([key, value], index) => (
                  <div
                    key={`feature-flag-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newFeatureFlags = { ...formData.featureFlags };
                        const oldKey = Object.keys(formData.featureFlags)[
                          index
                        ];
                        if (oldKey !== e.target.value) {
                          delete newFeatureFlags[oldKey];
                          newFeatureFlags[e.target.value] = value;
                          updateFormData("featureFlags", newFeatureFlags);
                        }
                      }}
                      placeholder="Feature name"
                      className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                    />
                    <Input
                      value={value}
                      onChange={(e) => {
                        const newFeatureFlags = { ...formData.featureFlags };
                        const currentKey = Object.keys(formData.featureFlags)[
                          index
                        ];
                        newFeatureFlags[currentKey] = e.target.value;
                        updateFormData("featureFlags", newFeatureFlags);
                      }}
                      placeholder="Value"
                      className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFeatureFlags = { ...formData.featureFlags };
                        const keyToRemove = Object.keys(formData.featureFlags)[
                          index
                        ];
                        delete newFeatureFlags[keyToRemove];
                        updateFormData("featureFlags", newFeatureFlags);
                      }}
                      className="bg-custom-bg text-gray-200 border-gray-600 hover:border-gray-500 px-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                onClick={() => {
                  updateFormData("featureFlags", {
                    ...formData.featureFlags,
                    "": "",
                  });
                }}
                className="bg-custom-bg hover:bg-gradient-to-r hover:from-gradient-background-from hover:to-gradient-background-to hover:text-black text-gray-200"
              >
                Add Feature Flag
              </Button>
            </div>
          </div>

          {/* Environment Variables Field */}
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Environment Variables
              <InfoTooltip message="Define secrets & configs injected during build/deploy." />
            </label>
            <div className="space-y-2">
              {Object.entries(formData.environmentVariables).map(
                ([key, value], index) => (
                  <div
                    key={`env-var-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newEnvVars = { ...formData.environmentVariables };
                        const oldKey = Object.keys(
                          formData.environmentVariables
                        )[index];
                        if (oldKey !== e.target.value) {
                          delete newEnvVars[oldKey];
                          newEnvVars[e.target.value] = value;
                          updateFormData("environmentVariables", newEnvVars);
                        }
                      }}
                      placeholder="Variable name"
                      className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                    />
                    <Input
                      value={value}
                      onChange={(e) => {
                        const newEnvVars = { ...formData.environmentVariables };
                        const currentKey = Object.keys(
                          formData.environmentVariables
                        )[index];
                        newEnvVars[currentKey] = e.target.value;
                        updateFormData("environmentVariables", newEnvVars);
                      }}
                      placeholder="Value"
                      className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newEnvVars = { ...formData.environmentVariables };
                        const keyToRemove = Object.keys(
                          formData.environmentVariables
                        )[index];
                        delete newEnvVars[keyToRemove];
                        updateFormData("environmentVariables", newEnvVars);
                      }}
                      className="bg-custom-bg text-gray-200 border-gray-600 hover:border-gray-500 px-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                onClick={() => {
                  updateFormData("environmentVariables", {
                    ...formData.environmentVariables,
                    "": "",
                  });
                }}
                className="bg-custom-bg hover:bg-gradient-to-r hover:from-gradient-background-from hover:to-gradient-background-to hover:text-black text-gray-200"
              >
                Add Environment Variable
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto">
      {/* Stepper Header - Fixed at top */}
      <div className="sticky top-0 bg-custom-bg z-10 pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                bg-gradient-to-r from-gradient-background-from to-gradient-background-to text-white`}
            >
              {currentStep}
            </div>
            <div className="text-sm text-gray-300">
              {currentStep === 1
                ? "Project Details"
                : currentStep === 2
                ? "Tech Stack"
                : currentStep === 3
                ? "Infrastructure"
                : currentStep === 4
                ? "CI/CD"
                : currentStep === 5
                ? "Security"
                : currentStep === 6
                ? "Notifications"
                : "Advanced Settings"}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="mt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Form submitted");
            handleSubmit(e);
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6">{renderStepContent()}</div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="sticky bottom-0 bg-custom-bg pt-4 border-t border-gray-700 mt-6">
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // console.log("Cancel button clicked");
                  onClose();
                }}
                className="bg-custom-bg text-gray-200"
              >
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBack();
                  }}
                  className="bg-custom-bg text-gray-200"
                >
                  Previous
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // console.log(
                    //   "Next Step button clicked for step:",
                    //   currentStep
                    // );
                    handleNext();
                  }}
                  className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit(e);
                  }}
                  className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to"
                >
                  Create Project
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectStepperSimple;
