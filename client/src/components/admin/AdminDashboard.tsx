import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  CreditCard, 
  Sparkles, 
  TrendingUp, 
  Search,
  MoreHorizontal,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User, BusinessCard, AiUsage } from "@shared/schema";

interface AdminDashboardProps {
  users?: User[];
  cards?: BusinessCard[];
  aiUsage?: AiUsage[];
  onUserAction?: (action: string, userId: string) => void;
  onCardAction?: (action: string, cardId: string) => void;
}

export default function AdminDashboard({ 
  users = [], 
  cards = [], 
  aiUsage = [],
  onUserAction,
  onCardAction 
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration //todo: remove mock functionality
  const mockUsers: User[] = users.length > 0 ? users : [
    {
      id: "1",
      email: "sarah.j@techcorp.com",
      name: "Sarah Johnson",
      googleId: "google123",
      avatar: "https://avatar.vercel.sh/sarah",
      role: "user",
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-01-20')
    },
    {
      id: "2",
      email: "alex@startupxyz.com",
      name: "Alex Chen",
      googleId: "google456",
      avatar: "https://avatar.vercel.sh/alex",
      role: "user",
      createdAt: new Date('2024-01-10'),
      lastLogin: new Date('2024-01-19')
    },
    {
      id: "3",
      email: "admin@cardcraft.ai",
      name: "Admin User",
      googleId: "google789",
      avatar: "https://avatar.vercel.sh/admin",
      role: "admin",
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-20')
    }
  ];

  const mockCards: BusinessCard[] = cards.length > 0 ? cards : [
    {
      id: "card1",
      userId: "1",
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
      thumbnailUrl: null,
      prompt: null,
      aiStyle: null,
      aiGeneratedText: null,
      elements: null,
      imageUrl: null,
      address: null
    }
  ];

  const mockAiUsage: AiUsage[] = aiUsage.length > 0 ? aiUsage : [
    {
      id: "ai1",
      userId: "1",
      cardId: "card1",
      provider: "cerebras",
      prompt: "Create a modern business card for a product designer",
      tokensUsed: 250,
      responseTime: 1200,
      success: true,
      errorMessage: null,
      createdAt: new Date('2024-01-15')
    },
    {
      id: "ai2",
      userId: "2",
      cardId: null,
      provider: "huggingface",
      prompt: "Design a creative developer card with dark theme",
      tokensUsed: 180,
      responseTime: 800,
      success: true,
      errorMessage: null,
      createdAt: new Date('2024-01-16')
    }
  ];

  const stats = {
    totalUsers: mockUsers.length,
    totalCards: mockCards.length,
    totalAiGenerations: mockAiUsage.length,
    activeUsersToday: mockUsers.filter(user => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return user.lastLogin && user.lastLogin >= today;
    }).length,
    cardsCreatedToday: mockCards.filter(card => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return card.createdAt >= today;
    }).length,
    aiUsageToday: mockAiUsage.filter(usage => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return usage.createdAt >= today;
    }).length
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (action: string, userId: string) => {
    console.log(`${action} action for user:`, userId);
    onUserAction?.(action, userId);
  };

  const handleCardAction = (action: string, cardId: string) => {
    console.log(`${action} action for card:`, cardId);
    onCardAction?.(action, cardId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor users, cards, and AI usage across the platform</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="mr-1 h-3 w-3" />
          Administrator
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold" data-testid="text-total-users">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeUsersToday} active today
                </p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold" data-testid="text-total-cards">{stats.totalCards}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.cardsCreatedToday} created today
                </p>
              </div>
              <div className="h-8 w-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Generations</p>
                <p className="text-2xl font-bold" data-testid="text-ai-generations">{stats.totalAiGenerations}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.aiUsageToday} today
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
                <p className="text-sm font-medium text-muted-foreground">Platform Growth</p>
                <p className="text-2xl font-bold text-chart-2" data-testid="text-growth-rate">+12%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  vs last month
                </p>
              </div>
              <div className="h-8 w-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="ai-usage">AI Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || ''} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Usage Analytics</CardTitle>
                <CardDescription>Provider performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Cerebras API</p>
                      <p className="text-xs text-muted-foreground">
                        Avg response: {mockAiUsage.filter(u => u.provider === 'cerebras')[0]?.responseTime || 0}ms
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {mockAiUsage.filter(u => u.provider === 'cerebras').length} requests
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">HuggingFace API</p>
                      <p className="text-xs text-muted-foreground">
                        Avg response: {mockAiUsage.filter(u => u.provider === 'huggingface')[0]?.responseTime || 0}ms
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {mockAiUsage.filter(u => u.provider === 'huggingface').length} requests
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-bold text-chart-2">
                        {Math.round((mockAiUsage.filter(u => u.success).length / mockAiUsage.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-users"
              />
            </div>
          </div>
          
          {/* Users Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || ''} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-chart-2 rounded-full" />
                        <span className="text-sm">Active</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`button-user-menu-${user.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction('view', user.id)}>
                            <Activity className="mr-2 h-4 w-4" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction('suspend', user.id)}>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Cards</CardTitle>
              <CardDescription>All cards created on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-8 rounded border"
                        style={{ backgroundColor: card.backgroundColor }}
                      />
                      <div>
                        <p className="font-medium">{card.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {card.name} • {card.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {card.layout}
                      </Badge>
                      {card.isPublic && (
                        <Badge variant="secondary" className="text-xs">
                          Public
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`button-card-menu-${card.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCardAction('view', card.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCardAction('moderate', card.id)}>
                            Moderate Content
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Usage Log</CardTitle>
              <CardDescription>Recent AI generation requests and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAiUsage.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="text-sm">
                        {mockUsers.find(u => u.id === usage.userId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {usage.provider}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {usage.prompt}
                      </TableCell>
                      <TableCell className="text-sm">
                        {usage.tokensUsed || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {usage.responseTime}ms
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {usage.success ? (
                            <CheckCircle className="h-4 w-4 text-chart-2" />
                          ) : (
                            <Clock className="h-4 w-4 text-chart-4" />
                          )}
                          <span className="text-sm">
                            {usage.success ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {usage.createdAt.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}