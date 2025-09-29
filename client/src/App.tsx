import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Page components
import NotFound from "@/pages/not-found";
import LoginFormExample from "@/components/examples/LoginForm";
import UserDashboardExample from "@/components/examples/UserDashboard";
import CardEditorExample from "@/components/examples/CardEditor";
import AdminDashboardExample from "@/components/examples/AdminDashboard";

function Router() {
  return (
    <Switch>
      {/* Authentication */}
      <Route path="/login" component={LoginFormExample} />
      
      {/* Main Dashboard */}
      <Route path="/" component={UserDashboardExample} />
      <Route path="/dashboard" component={UserDashboardExample} />
      
      {/* Card Management */}
      <Route path="/cards" component={UserDashboardExample} />
      <Route path="/create" component={CardEditorExample} />
      <Route path="/edit/:cardId" component={CardEditorExample} />
      <Route path="/ai-generate" component={CardEditorExample} />
      
      {/* Admin */}
      <Route path="/admin" component={AdminDashboardExample} />
      <Route path="/admin/users" component={AdminDashboardExample} />
      
      {/* Settings & Profile */}
      <Route path="/profile" component={() => (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your profile information and preferences.</p>
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
  // Custom sidebar width for business card application
  const style = {
    "--sidebar-width": "18rem",        // 288px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const handleLogout = () => {
    console.log('User logged out');
    // In a real app, this would clear auth state and redirect to login
    window.location.href = '/login';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar onLogout={handleLogout} />
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
                <Router />
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
