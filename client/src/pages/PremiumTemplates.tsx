import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { Template } from "@shared/schema";

export default function PremiumTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ templates: Template[] }>({
    queryKey: ["/api/templates?premium=true"],
  });

  const templates = data?.templates || [];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" data-testid="icon-sparkles" />
          <h1 className="text-4xl font-bold" data-testid="text-page-title">
            Premium Templates
          </h1>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="text-page-description">
          Professional templates designed with AI - Ready to customize and export
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-templates"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            data-testid="button-category-all"
          >
            All Templates
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-80 animate-pulse">
              <div className="h-full bg-muted" />
            </Card>
          ))}
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover-elevate cursor-pointer overflow-hidden"
              data-testid={`card-template-${template.id}`}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">
                      {template.category}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {template.title}
                    </p>
                  </div>
                </div>
                {template.source === "generated" && (
                  <Badge 
                    className="absolute top-2 right-2 bg-primary"
                    data-testid={`badge-ai-generated-${template.id}`}
                  >
                    AI Generated
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-base truncate" data-testid={`text-template-title-${template.id}`}>
                  {template.title}
                </CardTitle>
                <CardDescription data-testid={`text-template-category-${template.id}`}>
                  {template.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/templates/${template.id}/preview`}>
                  <Button className="w-full" size="sm" data-testid={`button-preview-${template.id}`}>
                    Preview & Edit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTemplates.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4" data-testid="text-empty-state">
              No templates found matching your criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
