import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { templates, getAllCategories } from '@shared/templates';

interface TemplateGalleryProps {
  userId: string;
  onSelectTemplate: (templateId: string) => void;
}

export default function TemplateGallery({ userId, onSelectTemplate }: TemplateGalleryProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = getAllCategories();
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Templates
            </h1>
            <p className="text-muted-foreground mt-2">
              Choose from {templates.length} professionally designed templates
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/ai-generate')}
            data-testid="button-ai-generate"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name, style, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-templates"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" data-testid="tab-all">All Templates</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                data-testid={`tab-${category}`}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or category filter
          </p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleSelectTemplate(template.id)}
              data-testid={`template-card-${template.id}`}
            >
              <CardContent className="p-0">
                {/* Template Preview */}
                <div 
                  className="h-48 flex items-center justify-center relative overflow-hidden"
                  style={{ background: template.thumbnail }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 text-center p-6">
                    <div className="text-white font-bold text-xl mb-2 drop-shadow-lg">
                      {template.name}
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" variant="secondary">
                      Use Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
