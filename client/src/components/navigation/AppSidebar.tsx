import { 
  Home, 
  CreditCard, 
  Plus, 
  Users, 
  BarChart3, 
  Settings,
  Sparkles,
  LogOut,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import type { User } from "@shared/schema";

interface AppSidebarProps {
  user?: User;
  onLogout?: () => void;
}

export function AppSidebar({ user, onLogout }: AppSidebarProps) {
  const [location] = useLocation();

  // Mock user data //todo: remove mock functionality
  const mockUser: User = user || {
    id: "1",
    email: "sarah.j@techcorp.com",
    name: "Sarah Johnson",
    googleId: "google123",
    avatar: "https://avatar.vercel.sh/sarah",
    role: "user",
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-01-20')
  };

  const isAdmin = mockUser.role === 'admin';

  // Main navigation items
  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: location === "/dashboard" || location === "/"
    },
    {
      title: "My Cards",
      url: "/cards",
      icon: CreditCard,
      isActive: location === "/cards"
    },
    {
      title: "Create Card",
      url: "/create",
      icon: Plus,
      isActive: location === "/create"
    },
    {
      title: "AI Generator",
      url: "/ai-generate",
      icon: Sparkles,
      isActive: location === "/ai-generate"
    }
  ];

  // Admin navigation items
  const adminItems = [
    {
      title: "Admin Panel",
      url: "/admin",
      icon: BarChart3,
      isActive: location === "/admin"
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      isActive: location === "/admin/users"
    }
  ];

  // Settings items
  const settingsItems = [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
      isActive: location === "/profile"
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: location === "/settings"
    }
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
    onLogout?.();
  };

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CardCraft AI</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Cards</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.isActive}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation (only for admins) */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              Administration
              <Badge variant="secondary" className="text-xs">
                Admin
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      data-testid={`nav-admin-${item.title.toLowerCase().replace(' ', '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.isActive}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="p-4">
        <div className="space-y-3">
          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUser.avatar || ''} />
              <AvatarFallback className="text-xs">
                {mockUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
            </div>
            {isAdmin && (
              <Badge variant="secondary" className="text-xs">
                Admin
              </Badge>
            )}
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}