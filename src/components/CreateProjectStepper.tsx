import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
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

// Define the form schema
const projectSchema = z.object({
  // Project Data
  projectName: z.string().min(1, "Project name is required"),
  projectCode: z.string().min(1, "Project code is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  projectPriority: z.string().min(1, "Project priority is required"),
  projectManager: z.string().min(1, "Project manager is required"),
  projectBudget: z.string().min(1, "Project budget is required"),
  projectLocation: z.string().min(1, "Project location is required"),

  // Tech Stack
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  containerPlatform: z.string(),

  // Infrastructure
  targetEnvironments: z.array(z.string()),
  cloudProvider: z.string(),
  iacTool: z.string(),

  // CI/CD
  cicdTool: z.string(),
  testCoverage: z.string(),
  loadTestProfile: z.string(),
  securityScanFrequency: z.string(),

  // Security
  complianceStandards: z.array(z.string()),
  staticAnalysis: z.string(),
  dependencyScanSchedule: z.string(),

  // Notifications
  notificationChannels: z.array(z.string()),
  alertThresholds: z.string(),
  customTemplates: z.string(),
  featureFlags: z.record(z.string()),
  environmentVariables: z.record(z.string()),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectStepperProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

const CreateProjectStepper = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      projectCode: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      projectType: "",
      projectPriority: "",
      projectManager: "",
      projectBudget: "",
      projectLocation: "",
      // Tech Stack Step
      languages: [],
      frameworks: [],
      databases: [],
      containerPlatform: "none",
      // Infrastructure Step
      targetEnvironments: [],
      cloudProvider: "",
      iacTool: "",
      // CI/CD Step
      cicdTool: "",
      testCoverage: "medium",
      loadTestProfile: "basic",
      securityScanFrequency: "weekly",
      // Security Step
      complianceStandards: [],
      staticAnalysis: "enabled",
      dependencyScanSchedule: "weekly",
      // Notifications Step
      notificationChannels: [],
      alertThresholds: "medium",
      customTemplates: "",
      featureFlags: {},
      environmentVariables: {},
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = form;

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return [
          "projectName",
          "projectCode",
          "description",
          "startDate",
          "endDate",
        ];
      case 2:
        return ["languages", "frameworks", "databases", "containerPlatform"];
      case 3:
        return ["targetEnvironments", "cloudProvider", "iacTool"];
      case 4:
        return [
          "cicdTool",
          "testCoverageThreshold",
          "loadTestProfile",
          "securityScanFrequency",
        ];
      case 5:
        return [
          "complianceStandards",
          "staticAnalysisTool",
          "dependencyScanSchedule",
        ];
      case 6:
        return [
          "notificationChannels",
          "alertThresholds",
          "customTemplates",
          "featureFlags",
          "environmentVariables",
        ];
      default:
        return [];
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
      default:
        return null;
    }
  };

  const renderProjectDataStep = () => (
    <div className="space-y-4 col-span-2">
      <div>
        <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
          Project Name
          <span className="ml-1 text-red-500">*</span>
          {/* <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Enter a unique, human-readable project name.
          </div> */}
        <InfoTooltip message="Enter a unique, human-readable project name." />
        </label>
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter project name..."
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          )}
        />
        {errors.projectName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
          Project Code
          {/* <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Alphanumeric code used for automation references; must be unique.
          </div> */}
            <InfoTooltip message="Alphanumeric code used for automation references; must be unique." />
        </label>
        <Controller
          name="projectCode"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="PRJ001"
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          )}
        />
        {errors.projectCode && (
          <p className="text-red-500 text-sm mt-1">
            {errors.projectCode.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
          Description
          <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Briefly describe the project's purpose and goals.
          </div>
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Describe your project..."
              rows={3}
              className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
            Start Date
            <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Select the project kickoff date.
            </div>
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
              />
            )}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
            End Date
            <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Optionally set a target completion date.
            </div>
          </label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
              />
            )}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endDate.message}
            </p>
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
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Choose primary development languages.
              </div>
            </label>
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange([...field.value, value])
                  }
                  value={field.value[0]}
                >
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">Java</SelectItem>
                    {/* <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="go">Go</SelectItem> */}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.languages && (
              <p className="text-red-500 text-sm mt-1">
                {errors.languages.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Framework(s)
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Select frameworks used (e.g. React, Spring).
              </div>
            </label>
            <Controller
              name="frameworks"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange([...field.value, value])
                  }
                  value={field.value[0]}
                >
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select frameworks" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="django">Angular</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="express">Vue</SelectItem>
                    <SelectItem value="django">Spring</SelectItem>
                    <SelectItem value="express">Express</SelectItem>        
                    <SelectItem value="django">Django</SelectItem>
                    <SelectItem value="spring">FastAPI</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Database(s)
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Pick one or more database technologies.
              </div>
            </label>
            <Controller
              name="databases"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange([...field.value, value])
                  }
                  value={field.value[0]}
                >
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select databases" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="mongodb">SQL Server</SelectItem>
                    <SelectItem value="redis">Oracle</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.databases && (
              <p className="text-red-500 text-sm mt-1">
                {errors.databases.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Container Platform
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Select containerization platform, if any.
              </div>
            </label>
            <Controller
              name="containerPlatform"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
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
              )}
            />
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
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Environments to provision: Dev, QA, Staging, Prod.
              </div>
            </label>
            <Controller
              name="targetEnvironments"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  {["Dev", "QA", "Staging", "Prod"].map((env) => (
                    <div key={env} className="flex items-center space-x-2">
                      <Checkbox
                        id={env}
                        checked={field.value.includes(env)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, env]);
                          } else {
                            field.onChange(
                              field.value.filter((v) => v !== env)
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
              )}
            />
            {errors.targetEnvironments && (
              <p className="text-red-500 text-sm mt-1">
                {errors.targetEnvironments.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Cloud Provider
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Choose your primary cloud or on-prem provider.
              </div>
            </label>
            <Controller
              name="cloudProvider"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select cloud provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="azure">Azure</SelectItem>
                    <SelectItem value="gcp">GCP</SelectItem>
                    <SelectItem value="on-prem">On-Premises</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cloudProvider && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cloudProvider.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              IaC Tool
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Select Infrastructure-as-Code tooling.
              </div>
            </label>
            <Controller
              name="iacTool"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select IaC tool" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="terraform">Terraform</SelectItem>
                    <SelectItem value="cloudformation">
                      CloudFormation
                    </SelectItem>
                    <SelectItem value="pulumi">Pulumi</SelectItem>
                    <SelectItem value="ansible">Ansible</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.iacTool && (
              <p className="text-red-500 text-sm mt-1">
                {errors.iacTool.message}
              </p>
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
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Choose your continuous integration/ delivery tool.
              </div>
            </label>
            <Controller
              name="cicdTool"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select CI/CD tool" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="github-actions">
                      GitHub Actions
                    </SelectItem>
                    <SelectItem value="jenkins">Jenkins</SelectItem>
                    <SelectItem value="gitlab-ci">GitLab CI</SelectItem>
                    <SelectItem value="circleci">CircleCI</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cicdTool && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cicdTool.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Test Coverage Threshold
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Minimum acceptable code coverage percentage.
              </div>
            </label>
            <Controller
              name="testCoverageThreshold"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="0"
                  max="100"
                  className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                />
              )}
            />
            {errors.testCoverageThreshold && (
              <p className="text-red-500 text-sm mt-1">
                {errors.testCoverageThreshold.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Load Test Profile
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Select intensity of load tests: Light, Medium, Heavy.
              </div>
            </label>
            <Controller
              name="loadTestProfile"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select load test profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.loadTestProfile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.loadTestProfile.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Security Scan Frequency
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                How often to run automated security scans.
              </div>
            </label>
            <Controller
              name="securityScanFrequency"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
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
              )}
            />
            {errors.securityScanFrequency && (
              <p className="text-red-500 text-sm mt-1">
                {errors.securityScanFrequency.message}
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
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Select regulations to enforce (e.g. GDPR, PCI, ISO 27001).
              </div>
            </label>
            <Controller
              name="complianceStandards"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange([...field.value, value])
                  }
                  value={field.value[0]}
                >
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select compliance standards" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="gdpr">GDPR</SelectItem>
                    <SelectItem value="pci">PCI DSS</SelectItem>
                    <SelectItem value="iso27001">ISO 27001</SelectItem>
                    <SelectItem value="hipaa">HIPAA</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Static Analysis Tool
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Tool for static code analysis (SAST).
              </div>
            </label>
            <Controller
              name="staticAnalysisTool"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select static analysis tool" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="sonarqube">SonarQube</SelectItem>
                    <SelectItem value="fortify">Fortify</SelectItem>
                    <SelectItem value="veracode">Veracode</SelectItem>
                    <SelectItem value="checkmarx">Checkmarx</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.staticAnalysisTool && (
              <p className="text-red-500 text-sm mt-1">
                {errors.staticAnalysisTool.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Dependency Scan Schedule
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                When to run dependency vulnerability checks.
              </div>
            </label>
            <Controller
              name="dependencyScanSchedule"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
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
              )}
            />
            {errors.dependencyScanSchedule && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dependencyScanSchedule.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsStep = () => (
    <div className="space-y-6 col-span-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">
            Notifications & Alerts
          </h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Notification Channels
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Where to send project alerts: Email, Slack, Teams.
              </div>
            </label>
            <Controller
              name="notificationChannels"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  {["Email", "Slack", "Teams"].map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        checked={field.value.includes(channel)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, channel]);
                          } else {
                            field.onChange(
                              field.value.filter((v) => v !== channel)
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
              )}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Alert Thresholds
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Define alert thresholds for key events.
              </div>
            </label>
            <Controller
              name="alertThresholds"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g., Test failures > 5, Security issues > 0"
                  className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                />
              )}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">
            Advanced Settings
          </h3>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Custom Templates
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Upload or select custom docs (reqs, test plans).
              </div>
            </label>
            <Controller
              name="customTemplates"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-custom-bg border-gray-600 text-white">
                    <SelectValue placeholder="Select templates" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="built-in">Built-in templates</SelectItem>
                    <SelectItem value="custom">Custom templates</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Feature Flags
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Toggle experimental features on/off.
              </div>
            </label>
            <Controller
              name="featureFlags"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {Object.entries(field.value).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newValue = { ...field.value };
                          delete newValue[key];
                          newValue[e.target.value] = value;
                          field.onChange(newValue);
                        }}
                        className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            [key]: e.target.value,
                          });
                        }}
                        className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      field.onChange({ ...field.value, "": "" });
                    }}
                    className="bg-custom-bg text-gray-200"
                  >
                    Add Feature Flag
                  </Button>
                </div>
              )}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 group relative inline-flex items-center">
              Environment Variables
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-gray-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Define secrets & configs injected during build/deploy.
              </div>
            </label>
            <Controller
              name="environmentVariables"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {Object.entries(field.value).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newValue = { ...field.value };
                          delete newValue[key];
                          newValue[e.target.value] = value;
                          field.onChange(newValue);
                        }}
                        className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          field.onChange({
                            ...field.value,
                            [key]: e.target.value,
                          });
                        }}
                        className="bg-custom-bg border-gray-600 text-white placeholder:text-gray-400 focus:border-2 focus:border-gradient-background-from focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      field.onChange({ ...field.value, "": "" });
                    }}
                    className="bg-custom-bg text-gray-200"
                  >
                    Add Environment Variable
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

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
                ? "Project Data"
                : currentStep === 2
                ? "Tech Stack"
                : currentStep === 3
                ? "Infrastructure"
                : currentStep === 4
                ? "CI/CD"
                : currentStep === 5
                ? "Security"
                : "Settings"}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="mt-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">{renderStepContent()}</div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="sticky bottom-0 bg-custom-bg pt-4 border-t border-gray-700 mt-6">
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-custom-bg text-gray-200"
              >
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="bg-custom-bg text-gray-200"
                >
                  Previous
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-gradient-background-from to-gradient-background-to"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
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

export default CreateProjectStepper;
