import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Download,
  Trash2,
  Sparkles,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BusinessCard } from "@shared/schema";

interface UserDashboardProps {
  cards?: BusinessCard[];
  onCreateNew?: () => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  onExportCard?: (cardId: string) => void;
}

export default function UserDashboard({ 
  cards = [], 
  onCreateNew, 
  onEditCard, 
  onDeleteCard, 
  onExportCard 
}: UserDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data for demonstration //todo: remove mock functionality
  const mockCards: BusinessCard[] = cards.length > 0 ? cards : [
    {
      id: "1",
      userId: "user1",
      title: "Professional Card",
      name: "Sarah Johnson",
      jobTitle: "Senior Product Designer",
      company: "TechCorp Innovation",
      email: "sarah.j@techcorp.com",
      phone: "+1 (555) 123-4567",
      website: "https://sarahjohnson.design",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#3b82f6",
      layout: "modern",
      fontFamily: "Inter",
      isPublic: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ["design", "tech"],
      thumbnailUrl: "/api/placeholder/card-1",
      prompt: null,
      aiStyle: null,
      aiGeneratedText: null,
      elements: null,
      imageUrl: null,
      address: null
    },
    {
      id: "2",
      userId: "user1",
      title: "Creative Card",
      name: "Alex Chen",
      jobTitle: "Full Stack Developer",
      company: "StartupXYZ",
      email: "alex@startupxyz.com",
      phone: "+1 (555) 987-6543",
      website: "https://alexchen.dev",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      accentColor: "#22d3ee",
      layout: "creative",
      fontFamily: "Poppins",
      isPublic: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      tags: ["development", "startup"],
      thumbnailUrl: "/api/placeholder/card-2",
      prompt: "Dark themed developer card with cyan accents",
      aiStyle: "creative",
      aiGeneratedText: "Modern developer card",
      elements: null,
      imageUrl: null,
      address: null
    },
    {
      id: "3",
      userId: "user1",
      title: "Minimal Card",
      name: "Emma Wilson",
      jobTitle: "Marketing Director",
      company: "Brand Studio",
      email: "emma@brandstudio.com",
      phone: "+1 (555) 456-7890",
      website: "https://emmawilson.marketing",
      backgroundColor: "#f8fafc",
      textColor: "#334155",
      accentColor: "#f59e0b",
      layout: "minimal",
      fontFamily: "Inter",
      isPublic: false,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      tags: ["marketing", "branding"],
      thumbnailUrl: "/api/placeholder/card-3",
      prompt: null,
      aiStyle: null,
      aiGeneratedText: null,
      elements: null,
      imageUrl: null,
      address: null
    }
  ];

  const filteredCards = mockCards.filter(card => 
    card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardAction = (action: string, cardId: string) => {
    console.log(`${action} action for card:`, cardId);
    switch (action) {
      case 'edit':
        onEditCard?.(cardId);
        break;
      case 'delete':
        onDeleteCard?.(cardId);
        break;
      case 'export':
        onExportCard?.(cardId);
        break;
    }
  };

  const CardPreview = ({ card }: { card: BusinessCard }) => (
    <div 
      className="relative w-full h-32 rounded-lg shadow-sm border overflow-hidden"
      style={{ 
        backgroundColor: card.backgroundColor,
        color: card.textColor,
        fontFamily: card.fontFamily
      }}
      data-testid={`card-preview-${card.id}`}
    >
      {/* Mini card layout preview */}
      {card.layout === 'standard' && (
        <div className="p-3 h-full flex flex-col justify-between text-xs">
          <div>
            <h3 className="font-semibold text-sm" style={{ color: card.textColor }}>
              {card.name}
            </h3>
            <p className="text-xs opacity-80" style={{ color: card.accentColor }}>
              {card.jobTitle}
            </p>
            <p className="text-xs">{card.company}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs">{card.email}</p>
            <p className="text-xs">{card.phone}</p>
          </div>
        </div>
      )}
      
      {card.layout === 'modern' && (
        <div className="p-3 h-full flex justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm" style={{ color: card.textColor }}>
              {card.name}
            </h3>
            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: card.accentColor }} />
            <p className="text-xs" style={{ color: card.accentColor }}>
              {card.jobTitle}
            </p>
            <p className="text-xs">{card.company}</p>
          </div>
          <div className="text-right text-xs space-y-0.5">
            <p>{card.email}</p>
            <p>{card.phone}</p>
          </div>
        </div>
      )}

      {card.layout === 'minimal' && (
        <div className="p-3 h-full flex items-center justify-center text-center">
          <div className="space-y-1">
            <h3 className="font-light text-sm" style={{ color: card.textColor }}>
              {card.name}
            </h3>
            <div className="w-8 h-px mx-auto" style={{ backgroundColor: card.accentColor }} />
            <p className="text-xs" style={{ color: card.accentColor }}>
              {card.jobTitle}
            </p>
          </div>
        </div>
      )}

      {card.layout === 'creative' && (
        <div className="relative p-3 h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 rounded-full" style={{ backgroundColor: card.accentColor, opacity: 0.2 }} />
          <div className="relative">
            <h3 className="font-semibold text-sm" style={{ color: card.textColor }}>
              {card.name}
            </h3>
            <p className="text-xs" style={{ color: card.accentColor }}>
              {card.jobTitle}
            </p>
            <p className="text-xs">{card.company}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">My Business Cards</h1>
          <p className="text-muted-foreground">Create and manage your professional business cards</p>
        </div>
        <Button onClick={onCreateNew} data-testid="button-create-card">
          <Plus className="mr-2 h-4 w-4 " />
          Create New Card
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold" data-testid="text-total-cards">{mockCards.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Grid className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Cards</p>
                <p className="text-2xl font-bold" data-testid="text-public-cards">
                  {mockCards.filter(card => card.isPublic).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Generated</p>
                <p className="text-2xl font-bold" data-testid="text-ai-cards">
                  {mockCards.filter(card => card.aiStyle).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold" data-testid="text-favorite-cards">0</p>
              </div>
              <div className="h-8 w-8 bg-chart-5/10 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards by name, company, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-cards"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            data-testid="button-grid-view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            data-testid="button-list-view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cards Grid/List */}
      {filteredCards.length === 0 ? (
        <Card className="p-12 text-center" data-testid="card-empty-state">
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No cards found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Create your first business card to get started"}
              </p>
            </div>
            {!searchTerm && (
              <Button onClick={onCreateNew} data-testid="button-create-first-card">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Card
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCards.map((card) => (
            <Card key={card.id} className="hover-elevate" data-testid={`card-item-${card.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{card.name}</span>
                      {card.isPublic && (
                        <Badge variant="secondary" className="text-xs">
                          <Eye className="mr-1 h-3 w-3" />
                          Public
                        </Badge>
                      )}
                      {card.aiStyle && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" data-testid={`button-card-menu-${card.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCardAction('edit', card.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCardAction('export', card.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCardAction('delete', card.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardPreview card={card} />
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Updated {card.updatedAt.toLocaleDateString()}</span>
                  <div className="flex gap-1">
                    {card.tags?.map((tag) => (
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