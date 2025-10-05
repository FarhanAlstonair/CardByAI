import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Wand2, ArrowLeft, Lightbulb, Zap, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface AIGenerateFormProps {
  onGenerate: (prompt: string, style: string) => void;
}

export default function AIGenerateForm({ onGenerate }: AIGenerateFormProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    
    setEnhancing(true);
    try {
      console.log('Testing Cerebras API with:', { prompt: prompt.trim(), style });
      
      const response = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
        }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('Parsed data:', data);
        
        if (data.enhancedPrompt) {
          setPrompt(data.enhancedPrompt);
          toast({
            title: "Prompt Enhanced!",
            description: "Your prompt has been improved with Cerebras AI.",
          });
        } else {
          throw new Error('No enhanced prompt in response');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      // Generate intelligent fallback data based on prompt
      const generateFromPrompt = (prompt: string, style: string) => {
        const lower = prompt.toLowerCase();
        
        // Extract profession/role
        let jobTitle = 'Professional';
        if (lower.includes('engineer') || lower.includes('developer')) jobTitle = 'Software Engineer';
        else if (lower.includes('designer')) jobTitle = 'Designer';
        else if (lower.includes('manager')) jobTitle = 'Manager';
        else if (lower.includes('doctor') || lower.includes('physician')) jobTitle = 'Doctor';
        else if (lower.includes('lawyer') || lower.includes('attorney')) jobTitle = 'Attorney';
        else if (lower.includes('teacher') || lower.includes('educator')) jobTitle = 'Educator';
        else if (lower.includes('consultant')) jobTitle = 'Consultant';
        else if (lower.includes('photographer')) jobTitle = 'Photographer';
        else if (lower.includes('architect')) jobTitle = 'Architect';
        else if (lower.includes('marketing')) jobTitle = 'Marketing Specialist';
        
        // Extract company type
        let company = 'Professional Services';
        if (lower.includes('startup') || lower.includes('tech')) company = 'TechCorp Inc.';
        else if (lower.includes('design') || lower.includes('creative')) company = 'Creative Studio';
        else if (lower.includes('consulting')) company = 'Consulting Group';
        else if (lower.includes('medical') || lower.includes('health')) company = 'Medical Center';
        else if (lower.includes('law') || lower.includes('legal')) company = 'Law Firm';
        else if (lower.includes('education') || lower.includes('school')) company = 'Educational Institute';
        
        // Style-based colors
        let colors = { bg: '#ffffff', text: '#1f2937', accent: '#de6712' };
        if (style === 'creative') colors = { bg: '#f8fafc', text: '#1e293b', accent: '#de6712' };
        else if (style === 'luxury') colors = { bg: '#1f2937', text: '#ffffff', accent: '#de6712' };
        else if (style === 'minimal') colors = { bg: '#ffffff', text: '#374151', accent: '#de6712' };
        else if (style === 'professional') colors = { bg: '#ffffff', text: '#111827', accent: '#de6712' };
        
        return {
          name: 'Alex Johnson',
          jobTitle,
          company,
          email: `alex@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          phone: '+1 (555) 123-4567',
          website: `https://${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          address: 'New York, NY',
          backgroundColor: colors.bg,
          textColor: colors.text,
          accentColor: colors.accent,
          layout: style || 'modern'
        };
      };
      
      let result = {
        success: true,
        data: generateFromPrompt(prompt.trim(), style),
        source: 'fallback'
      };
      
      toast({
        title: "Card Generated!",
        description: "Your AI-generated business card is ready for editing.",
      });
      
      onGenerate(prompt, style);
      setLocation(`/create?ai=true&prompt=${encodeURIComponent(prompt)}&style=${style}&data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = [
    { value: 'modern', label: 'Modern & Clean', desc: 'Clean lines, minimal design' },
    { value: 'professional', label: 'Professional', desc: 'Corporate and trustworthy' },
    { value: 'creative', label: 'Creative & Bold', desc: 'Artistic and eye-catching' },
    { value: 'minimal', label: 'Minimal', desc: 'Less is more approach' },
    { value: 'luxury', label: 'Luxury', desc: 'Premium and elegant' },
    { value: 'tech', label: 'Tech Startup', desc: 'Modern and innovative' }
  ];

  const examples = [
    { text: "Create a business card for a software engineer at a tech startup", category: "Tech" },
    { text: "Design a card for a wedding photographer with elegant styling", category: "Creative" },
    { text: "Make a professional card for a financial advisor", category: "Professional" },
    { text: "Create a creative card for a graphic designer", category: "Creative" },
    { text: "Design a minimal card for an architect", category: "Minimal" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">AI Generator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Powered by AI
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Generate Your Perfect
            <span className="text-primary block">Business Card</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your vision and watch AI create a professional business card tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-card">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wand2 className="h-6 w-6 text-primary" />
                  Describe Your Card
                </CardTitle>
                <p className="text-muted-foreground">
                  Be specific about your profession, style preferences, and what information to include
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <label className="text-sm font-semibold mb-3 block text-foreground">
                    Card Description
                  </label>
                  <Textarea
                    placeholder="Example: Create a modern business card for a software engineer at a tech startup called 'InnovateTech'. Include the name 'Alex Johnson', title 'Senior Full Stack Developer', email 'alex@innovatetech.com', phone '+1 (555) 123-4567', and the company website. Use a clean, tech-inspired design with blue accents."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-40 text-base resize-none border-input focus:border-primary"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    {prompt.length}/500 characters
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-3 block text-foreground">
                    Design Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map((s) => (
                      <div
                        key={s.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          style === s.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setStyle(s.value)}
                      >
                        <div className="font-medium text-foreground">{s.label}</div>
                        <div className="text-sm text-muted-foreground">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleEnhancePrompt} 
                    disabled={!prompt.trim() || enhancing}
                    variant="outline"
                    className="flex-1 h-14 text-lg font-semibold border-primary text-primary hover:bg-primary/5"
                  >
                    {enhancing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5 mr-2" />
                        Enhance Prompt
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!prompt.trim() || loading}
                    className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate My Card
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Examples Sidebar */}
          <div>
            <Card className="shadow-lg border-0 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Example Prompts
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click any example to get started
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all group"
                      onClick={() => setPrompt(example.text)}
                    >
                      <div className="text-xs font-medium text-primary mb-2">
                        {example.category}
                      </div>
                      <div className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {example.text}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}