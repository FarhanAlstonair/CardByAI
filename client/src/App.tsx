import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Page components
import NotFound from "@/pages/not-found";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "@/components/dashboard/Dashboard";
import ProjectsDashboard from "@/components/dashboard/ProjectsDashboard";
import CardEditor from "@/components/cards/CardEditor";
import AdvancedCanvasEditor from "@/components/editor/AdvancedCanvasEditor";
import AdminDashboard from "@/components/admin/AdminDashboard";
import TemplateGallery from "@/pages/TemplateGallery";
import PremiumTemplates from "@/pages/PremiumTemplates";
import TemplatePreview from "@/pages/TemplatePreview";
import AIGenerateForm from "@/components/AIGenerateForm";
import CreateEditor from "@/components/CreateEditor";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { User } from "@shared/schema";
import { getTemplateById } from "@shared/templates";

function Router({ user }: { user: User | null }) {
  const [, setLocation] = useLocation();

  const handleSelectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      // Navigate to create page with template data
      setLocation(`/create?templateId=${templateId}`);
    }
  };

  // Public routes accessible without authentication
  if (!user) {
    return (
      <Switch>
        <Route path="/premium-templates" component={PremiumTemplates} />
        <Route path="/templates/:id/preview" component={TemplatePreview} />
        <Route component={() => <LoginForm />} />
      </Switch>
    );
  }

  return (
    <Switch>
      {/* Main Dashboard */}
      <Route path="/" component={() => <ProjectsDashboard userId={user.id} />} />
      <Route path="/dashboard" component={() => <ProjectsDashboard userId={user.id} />} />
      
      {/* Templates */}
      <Route path="/templates" component={() => (
        <TemplateGallery 
          userId={user.id}
          onSelectTemplate={handleSelectTemplate}
        />
      )} />
      <Route path="/premium-templates" component={PremiumTemplates} />
      <Route path="/templates/:id/preview" component={TemplatePreview} />
      
      {/* Card Management */}
      <Route path="/cards" component={() => <ProjectsDashboard userId={user.id} />} />
      <Route path="/create" component={CreateEditor} />
      <Route path="/ai-generate" component={() => (
        <AIGenerateForm
          onGenerate={(prompt, style) => {
            console.log('Generating with:', prompt, style);
          }}
        />
      )} />
      
      {/* Admin */}
      {user.role === 'admin' && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/users" component={AdminDashboard} />
        </>
      )}
      
      {/* Settings & Profile */}
      <Route path="/profile" component={() => (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-lg capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )} />
      <Route path="/settings" component={() => (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Application Settings</h1>
          <p className="text-muted-foreground">Configure your application preferences and account settings.</p>
        </div>
      )} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.getMe();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/premium-templates', '/templates/:id/preview'];
  const isPublicRoute = publicRoutes.some(route => {
    const pattern = route.replace(/:[\w]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(location);
  });

  if (!user && !isPublicRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginForm onLogin={checkAuth} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Custom sidebar width for business card application
  const style = {
    "--sidebar-width": "18rem",        // 288px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar user={user} onLogout={handleLogout} />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <h1 className="font-semibold text-lg">CardCraft AI</h1>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Router user={user} />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
