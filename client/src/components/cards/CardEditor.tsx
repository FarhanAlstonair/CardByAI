import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Type, 
  Layout, 
  Download, 
  Save, 
  Sparkles, 
  Move,
  RotateCcw,
  Trash2
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import type { BusinessCard, CardElement } from "@shared/schema";

interface CardEditorProps {
  card?: Partial<BusinessCard>;
  onSave?: (card: Partial<BusinessCard>) => void;
  onAiGenerate?: (prompt: string, style: string) => void;
  onExport?: () => void;
}

export default function CardEditor({ card, onSave, onAiGenerate, onExport }: CardEditorProps) {
  const [formData, setFormData] = useState({
    name: card?.name || "",
    jobTitle: card?.jobTitle || "",
    company: card?.company || "",
    email: card?.email || "",
    phone: card?.phone || "",
    website: card?.website || "",
    backgroundColor: card?.backgroundColor || "#ffffff",
    textColor: card?.textColor || "#000000",
    accentColor: card?.accentColor || "#3b82f6",
    layout: card?.layout || "standard",
    fontFamily: card?.fontFamily || "Inter"
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAiGenerate = () => {
    if (aiPrompt.trim()) {
      console.log('AI Generation requested:', aiPrompt);
      onAiGenerate?.(aiPrompt, formData.layout);
      setAiPrompt("");
    }
  };

  const handleSave = () => {
    console.log('Saving card:', formData);
    onSave?.(formData);
  };

  const handleExport = () => {
    console.log('Exporting card');
    onExport?.();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Controls */}
      <div className="w-80 border-r border-border bg-card p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Card Editor</h2>
          </div>

          {/* AI Generation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Generate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Describe your business card (e.g., 'Modern tech startup founder, blue color scheme')..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                data-testid="textarea-ai-prompt"
              />
              <Button 
                onClick={handleAiGenerate} 
                className="w-full"
                disabled={!aiPrompt.trim()}
                data-testid="button-ai-generate"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </CardContent>
          </Card>

          {/* Content */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                    data-testid="input-job-title"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="TechCorp Inc."
                    data-testid="input-company"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-website"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Colors</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Background</Label>
                      <Button
                        variant="outline"
                        className="w-full h-8 p-1"
                        style={{ backgroundColor: formData.backgroundColor }}
                        onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
                        data-testid="button-bg-color"
                      />
                      {showColorPicker === 'bg' && (
                        <div className="absolute z-10 mt-2">
                          <HexColorPicker
                            color={formData.backgroundColor}
                            onChange={(color) => handleInputChange('backgroundColor', color)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Text</Label>
                      <Button
                        variant="outline"
                        className="w-full h-8 p-1"
                        style={{ backgroundColor: formData.textColor }}
                        onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
                        data-testid="button-text-color"
                      />
                      {showColorPicker === 'text' && (
                        <div className="absolute z-10 mt-2">
                          <HexColorPicker
                            color={formData.textColor}
                            onChange={(color) => handleInputChange('textColor', color)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Accent</Label>
                      <Button
                        variant="outline"
                        className="w-full h-8 p-1"
                        style={{ backgroundColor: formData.accentColor }}
                        onClick={() => setShowColorPicker(showColorPicker === 'accent' ? null : 'accent')}
                        data-testid="button-accent-color"
                      />
                      {showColorPicker === 'accent' && (
                        <div className="absolute z-10 mt-2">
                          <HexColorPicker
                            color={formData.accentColor}
                            onChange={(color) => handleInputChange('accentColor', color)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select value={formData.fontFamily} onValueChange={(value) => handleInputChange('fontFamily', value)}>
                    <SelectTrigger data-testid="select-font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="layout" className="space-y-4">
              <div>
                <Label htmlFor="layout">Layout Style</Label>
                <Select value={formData.layout} onValueChange={(value) => handleInputChange('layout', value)}>
                  <SelectTrigger data-testid="select-layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Style Preview</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['standard', 'modern', 'minimal', 'creative'].map((style) => (
                    <Button
                      key={style}
                      variant={formData.layout === style ? "default" : "outline"}
                      className="h-16 text-xs"
                      onClick={() => handleInputChange('layout', style)}
                      data-testid={`button-layout-${style}`}
                    >
                      <div className="flex flex-col items-center">
                        <Layout className="h-4 w-4 mb-1" />
                        <span className="capitalize">{style}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleSave} className="w-full" data-testid="button-save">
              <Save className="mr-2 h-4 w-4" />
              Save Card
            </Button>
            <Button variant="outline" onClick={handleExport} className="w-full" data-testid="button-export">
              <Download className="mr-2 h-4 w-4" />
              Export Image
            </Button>
          </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <div className="relative">
          {/* Card Preview */}
          <div 
            ref={canvasRef}
            className="w-96 h-56 rounded-lg shadow-lg border-2 border-border relative overflow-hidden cursor-move"
            style={{ 
              backgroundColor: formData.backgroundColor,
              color: formData.textColor,
              fontFamily: formData.fontFamily
            }}
            data-testid="card-preview"
          >
            {/* Layout-specific rendering */}
            {formData.layout === 'standard' && (
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: formData.textColor }}>
                    {formData.name || "Your Name"}
                  </h2>
                  <p className="text-sm opacity-80" style={{ color: formData.accentColor }}>
                    {formData.jobTitle || "Job Title"}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {formData.company || "Company Name"}
                  </p>
                </div>
                <div className="text-xs space-y-1">
                  {formData.email && <p>{formData.email}</p>}
                  {formData.phone && <p>{formData.phone}</p>}
                  {formData.website && <p>{formData.website}</p>}
                </div>
              </div>
            )}
            
            {formData.layout === 'modern' && (
              <div className="p-6 h-full">
                <div className="flex items-center justify-between h-full">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold" style={{ color: formData.textColor }}>
                      {formData.name || "Your Name"}
                    </h2>
                    <div className="w-12 h-1 rounded" style={{ backgroundColor: formData.accentColor }} />
                    <p className="text-sm" style={{ color: formData.accentColor }}>
                      {formData.jobTitle || "Job Title"}
                    </p>
                    <p className="text-sm font-medium">
                      {formData.company || "Company Name"}
                    </p>
                  </div>
                  <div className="text-right text-xs space-y-1">
                    {formData.email && <p>{formData.email}</p>}
                    {formData.phone && <p>{formData.phone}</p>}
                    {formData.website && <p>{formData.website}</p>}
                  </div>
                </div>
              </div>
            )}

            {formData.layout === 'minimal' && (
              <div className="p-8 h-full flex items-center justify-center text-center">
                <div className="space-y-3">
                  <h2 className="text-xl font-light" style={{ color: formData.textColor }}>
                    {formData.name || "Your Name"}
                  </h2>
                  <div className="w-16 h-px mx-auto" style={{ backgroundColor: formData.accentColor }} />
                  <p className="text-sm" style={{ color: formData.accentColor }}>
                    {formData.jobTitle || "Job Title"}
                  </p>
                  <div className="text-xs space-y-1 pt-2">
                    {formData.email && <p>{formData.email}</p>}
                    {formData.phone && <p>{formData.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {formData.layout === 'creative' && (
              <div className="relative p-6 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full" style={{ backgroundColor: formData.accentColor, opacity: 0.2 }} />
                <div className="relative z-10">
                  <h2 className="text-lg font-bold" style={{ color: formData.textColor }}>
                    {formData.name || "Your Name"}
                  </h2>
                  <p className="text-sm font-medium" style={{ color: formData.accentColor }}>
                    {formData.jobTitle || "Job Title"}
                  </p>
                  <p className="text-sm mt-1">
                    {formData.company || "Company Name"}
                  </p>
                  <div className="absolute bottom-6 left-6 text-xs space-y-1">
                    {formData.email && <p>{formData.email}</p>}
                    {formData.phone && <p>{formData.phone}</p>}
                    {formData.website && <p>{formData.website}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Card Info */}
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="text-xs">
              {formData.layout || 'standard'} layout
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}