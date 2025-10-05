import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Template } from "@shared/schema";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template;
}

type ExportFormat = "png" | "pdf" | "svg" | "jpeg";
type ExportQuality = "preview" | "standard" | "high" | "advanced";

export function ExportModal({ open, onOpenChange, template }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState<ExportQuality>("standard");

  const exportHints = template.exportHints as any;
  const recommendedDPI = exportHints?.recommendedDPI || 300;
  const vectorPreferred = exportHints?.vectorPreferred || false;

  // Quality check logic
  const getQualityCheck = () => {
    if (quality === "preview") {
      return {
        status: "info",
        message: "Preview quality (72 DPI) - suitable for screen viewing only",
      };
    }

    if (quality === "standard") {
      return {
        status: "success",
        message: "Standard quality (150 DPI) - good for most digital uses",
      };
    }

    if (quality === "high") {
      return {
        status: "success",
        message: "High quality (300 DPI) - suitable for professional printing",
      };
    }

    if (quality === "advanced") {
      if (!vectorPreferred && format !== "svg") {
        return {
          status: "warning",
          message: `This template contains raster elements. Recommended DPI is ${recommendedDPI}. Consider using SVG format for best quality.`,
        };
      }
      return {
        status: "success",
        message: `Advanced quality (${recommendedDPI} DPI) - Premium print quality with vector preservation`,
      };
    }

    return { status: "info", message: "" };
  };

  const qualityCheck = getQualityCheck();

  const handleExport = () => {
    // In a real implementation, this would trigger the export workflow
    console.log("Exporting:", { format, quality, template: template.id });
    alert(`Exporting as ${format.toUpperCase()} with ${quality} quality\n\nIn production, this would generate and download your file.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-export">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Template
          </DialogTitle>
          <DialogDescription>
            Choose your export format and quality settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label data-testid="label-format">Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="format-png" data-testid="radio-format-png" />
                  <Label htmlFor="format-png" className="cursor-pointer flex-1">
                    PNG
                    <span className="block text-xs text-muted-foreground">
                      Lossless raster
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" data-testid="radio-format-pdf" />
                  <Label htmlFor="format-pdf" className="cursor-pointer flex-1">
                    PDF
                    <span className="block text-xs text-muted-foreground">
                      Print-ready
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="svg" id="format-svg" data-testid="radio-format-svg" />
                  <Label htmlFor="format-svg" className="cursor-pointer flex-1">
                    SVG
                    {vectorPreferred && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Recommended
                      </Badge>
                    )}
                    <span className="block text-xs text-muted-foreground">
                      Vector format
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpeg" id="format-jpeg" data-testid="radio-format-jpeg" />
                  <Label htmlFor="format-jpeg" className="cursor-pointer flex-1">
                    JPEG
                    <span className="block text-xs text-muted-foreground">
                      Compressed
                    </span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Quality Presets */}
          <div className="space-y-3">
            <Label data-testid="label-quality">Quality Preset</Label>
            <RadioGroup value={quality} onValueChange={(v) => setQuality(v as ExportQuality)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preview" id="quality-preview" data-testid="radio-quality-preview" />
                  <Label htmlFor="quality-preview" className="cursor-pointer flex-1">
                    Preview (72 DPI)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="quality-standard" data-testid="radio-quality-standard" />
                  <Label htmlFor="quality-standard" className="cursor-pointer flex-1">
                    Standard (150 DPI)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="quality-high" data-testid="radio-quality-high" />
                  <Label htmlFor="quality-high" className="cursor-pointer flex-1">
                    High (300 DPI)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="quality-advanced" data-testid="radio-quality-advanced" />
                  <Label htmlFor="quality-advanced" className="cursor-pointer flex-1">
                    Advanced ({recommendedDPI} DPI)
                    <span className="block text-xs text-muted-foreground">
                      Premium print quality
                    </span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Quality Check Alert */}
          <Alert variant={qualityCheck.status === "warning" ? "destructive" : "default"}>
            {qualityCheck.status === "success" && <CheckCircle2 className="w-4 h-4" />}
            {qualityCheck.status === "warning" && <AlertTriangle className="w-4 h-4" />}
            <AlertDescription>{qualityCheck.message}</AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-export"
            >
              Cancel
            </Button>
            <Button onClick={handleExport} data-testid="button-download">
              <Download className="w-4 h-4 mr-2" />
              Export {format.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
