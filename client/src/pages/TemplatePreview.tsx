import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card3DPreview } from "@/components/Card3DPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Edit } from "lucide-react";
import type { Template } from "@shared/schema";
import { useState } from "react";
import { ExportModal } from "@/components/ExportModal";

export default function TemplatePreview() {
  const [, params] = useRoute("/templates/:id/preview");
  const [, setLocation] = useLocation();
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: template, isLoading } = useQuery<Template>({
    queryKey: [`/api/templates/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 animate-pulse">
            <div className="h-96 bg-muted rounded-lg" />
          </Card>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Template not found</h2>
          <Button onClick={() => setLocation("/premium-templates")}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/premium-templates")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-template-title">
                {template.title}
              </h1>
              <p className="text-muted-foreground" data-testid="text-template-category">
                {template.category}
              </p>
            </div>
            <div className="flex gap-2">
              {template.tags?.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Preview */}
        <Card className="p-8 mb-6">
          <Card3DPreview
            front={template.front as any}
            back={template.back as any}
            className="max-w-2xl mx-auto"
          />
        </Card>

        {/* Template Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Template Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Dimensions</dt>
                <dd className="font-medium">
                  {(template.front as any).width} × {(template.front as any).height}px
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">DPI</dt>
                <dd className="font-medium">{(template.front as any).dpi}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Source</dt>
                <dd className="font-medium capitalize">{template.source}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Export Quality</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Recommended DPI</dt>
                <dd className="font-medium">
                  {(template.exportHints as any)?.recommendedDPI || 300}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Vector Preferred</dt>
                <dd className="font-medium">
                  {(template.exportHints as any)?.vectorPreferred ? "Yes" : "No"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowExportModal(true)}
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="lg"
            onClick={() => setLocation(`/create?templateId=${template.id}`)}
            data-testid="button-customize"
          >
            <Edit className="w-4 h-4 mr-2" />
            Customize in Editor
          </Button>
        </div>

        {/* Export Modal */}
        <ExportModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          template={template}
        />
      </div>
    </div>
  );
}
