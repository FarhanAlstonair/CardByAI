import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Eye,
  Sparkles,
  Grid3X3,
  List
} from "lucide-react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { BusinessCard, User } from "@shared/schema";
import CardEditor from "@/components/cards/CardEditor";

export default function Dashboard() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userResponse, cardsResponse] = await Promise.all([
        api.getMe(),
        api.getCards()
      ]);
      setUser(userResponse.user);
      setCards(cardsResponse.cards);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = () => {
    setSelectedCard(null);
    setShowEditor(true);
  };

  const handleEditCard = (card: BusinessCard) => {
    setSelectedCard(card);
    setShowEditor(true);
  };

  const handleSaveCard = async (cardData: Partial<BusinessCard>) => {
    try {
      if (selectedCard) {
        const response = await api.updateCard(selectedCard.id, cardData);
        setCards(prev => prev.map(c => c.id === selectedCard.id ? response.card : c));
      } else {
        const response = await api.createCard(cardData);
        setCards(prev => [...prev, response.card]);
      }
      setShowEditor(false);
      setSelectedCard(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await api.deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
      toast({
        title: "Card Deleted",
        description: "Business card has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the card",
        variant: "destructive"
      });
    }
  };

  const handleExportCard = async (card: BusinessCard) => {
    try {
      // Generate canvas image data (simplified)
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 240;
      const ctx = canvas.getContext('2d')!;
      
      // Draw card background
      ctx.fillStyle = card.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text (simplified)
      ctx.fillStyle = card.textColor || '#000000';
      ctx.font = '20px Inter';
      ctx.fillText(card.name || 'Name', 20, 40);
      
      const imageData = canvas.toDataURL('image/png');
      const response = await api.exportCard(card.id, imageData);
      
      // Download the image
      const link = document.createElement('a');
      link.href = response.imageUrl;
      link.download = `${card.name || 'card'}-business-card.png`;
      link.click();
      
      toast({
        title: "Card Exported",
        description: "Business card has been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the card",
        variant: "destructive"
      });
    }
  };

  const filteredCards = cards.filter(card =>
    card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="h-screen">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {selectedCard ? 'Edit Card' : 'Create New Card'}
          </h1>
          <Button variant="outline" onClick={() => setShowEditor(false)}>
            Back to Dashboard
          </Button>
        </div>
        <CardEditor
          card={selectedCard || undefined}
          onSave={handleSaveCard}
          onAiGenerate={(prompt, style) => console.log('AI Generate:', prompt, style)}
          onExport={() => selectedCard && handleExportCard(selectedCard)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Business Cards</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Create and manage your AI-powered business cards.
              </p>
            </div>
            <Button onClick={handleCreateCard} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4" />
              Create Card
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                  <p className="text-2xl font-bold">{cards.length}</p>
                </div>
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Grid3X3 className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Generated</p>
                  <p className="text-2xl font-bold">{cards.filter(c => c.aiGeneratedText).length}</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exported</p>
                  <p className="text-2xl font-bold">{cards.filter(c => c.imageUrl).length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Download className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {cards.filter(c => {
                      const cardDate = new Date(c.createdAt);
                      const now = new Date();
                      return cardDate.getMonth() === now.getMonth() && cardDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border-border hover:bg-primary/5 hover:text-primary"}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border-border hover:bg-primary/5 hover:text-primary"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cards Grid/List */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Ready to create amazing business cards?</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get started with our AI-powered design tools or choose from professional templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleCreateCard} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Create New Card
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/ai-generate'} className="border-primary text-primary hover:bg-primary/5">
                <Sparkles className="mr-2 h-4 w-4" />
                Try AI Generator
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredCards.map((card) => (
              <Card key={card.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {viewMode === "grid" ? (
                    <div>
                      {/* Card Preview */}
                      <div 
                        className="w-full h-32 rounded-lg mb-4 p-3 text-xs"
                        style={{ 
                          backgroundColor: card.backgroundColor || '#ffffff',
                          color: card.textColor || '#000000',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-sm">{card.name || 'Untitled'}</p>
                            <p className="opacity-80" style={{ color: card.accentColor }}>{card.jobTitle}</p>
                            <p className="text-xs">{card.company}</p>
                          </div>
                          <div className="text-xs opacity-60">
                            <p>{card.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{card.name || 'Untitled Card'}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {card.layout || 'standard'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {card.company} • {card.jobTitle}
                        </p>
                        
                        <div className="flex items-center gap-1 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCard(card)}
                            className="flex-1 border-border hover:bg-primary/5 hover:text-primary hover:border-primary"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportCard(card)}
                            className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-destructive hover:text-destructive border-border hover:bg-destructive/5 hover:border-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-10 rounded border flex-shrink-0"
                          style={{ backgroundColor: card.backgroundColor || '#ffffff' }}
                        />
                        <div>
                          <h3 className="font-semibold">{card.name || 'Untitled Card'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {card.company} • {card.jobTitle}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{card.layout}</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditCard(card)} className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExportCard(card)} className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-destructive hover:text-destructive border-border hover:bg-destructive/5 hover:border-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}