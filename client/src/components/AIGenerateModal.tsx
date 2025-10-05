import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiJob } from "@shared/schema";

interface AIGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onTemplateCreated?: (templateId: string) => void;
}

export function AIGenerateModal({
  open,
  onOpenChange,
  userId,
  onTemplateCreated,
}: AIGenerateModalProps) {
  const [promptText, setPromptText] = useState("");
  const [style, setStyle] = useState<string>("modern");
  const [jobId, setJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai-generate", {
        userId,
        promptText,
        style,
        targetFormatHints: {
          preferredDPI: 600,
          vectorPreferred: true,
          canvasSize: { width: 1050, height: 600, dpi: 300 },
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      setJobId(data.jobId);
      toast({
        title: "Generation started!",
        description: "Your template is being created...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Poll job status
  const { data: job } = useQuery<AiJob>({
    queryKey: ["/api/ai-jobs", jobId],
    enabled: !!jobId,
    refetchInterval: (query) => {
      const job = query.state.data;
      if (!job || job.status === "completed" || job.status === "failed") {
        return false;
      }
      return 1000; // Poll every second
    },
  });

  const handleGenerate = () => {
    if (!promptText.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe the card you want to create",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate();
  };

  const handleLoadTemplate = () => {
    if (job?.templateId && onTemplateCreated) {
      onTemplateCreated(job.templateId);
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setPromptText("");
    setStyle("modern");
    setJobId(null);
  };

  const isGenerating = job?.status === "queued" || job?.status === "processing";
  const isCompleted = job?.status === "completed";
  const isFailed = job?.status === "failed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-ai-generate">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate with AI
          </DialogTitle>
          <DialogDescription>
            Describe your business card and let AI create a professional design for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" data-testid="label-prompt">
              Describe your card
            </Label>
            <Textarea
              id="prompt"
              placeholder="E.g., Create a luxury business card for John Doe, wedding photographer. Include name, title, portfolio URL, and a camera icon. Make it premium and minimal."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={5}
              disabled={isGenerating || isCompleted}
              data-testid="textarea-prompt"
            />
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <Label htmlFor="style" data-testid="label-style">
              Style
            </Label>
            <Select
              value={style}
              onValueChange={setStyle}
              disabled={isGenerating || isCompleted}
            >
              <SelectTrigger data-testid="select-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Status */}
          {job && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating your template...</span>
                  </div>
                  <Progress value={job.progress || 10} className="h-2" />
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Template created successfully!</span>
                </div>
              )}

              {isFailed && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{job.errorMessage || "Generation failed"}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            {!job && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !promptText.trim()}
                  data-testid="button-generate"
                >
                  {generateMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Generate
                </Button>
              </>
            )}

            {isCompleted && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onOpenChange(false);
                  }}
                  data-testid="button-close"
                >
                  Close
                </Button>
                <Button
                  onClick={handleLoadTemplate}
                  data-testid="button-load-template"
                >
                  Load into Editor
                </Button>
              </>
            )}

            {isFailed && (
              <Button
                onClick={() => {
                  resetForm();
                }}
                data-testid="button-try-again"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
