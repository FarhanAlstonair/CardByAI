import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Download, Sparkles, LayoutGrid } from 'lucide-react';
import { cardProjectsApi, type CardProject } from '@/lib/supabase';
import CanvasEditor from '@/components/editor/CanvasEditor';
import { templates } from '@shared/templates';

interface ProjectsDashboardProps {
  userId: string;
}

export default function ProjectsDashboard({ userId }: ProjectsDashboardProps) {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<CardProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CardProject | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const loadProjects = async () => {
    try {
      const data = await cardProjectsApi.getAll(userId);
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const newProject = await cardProjectsApi.create({
        user_id: userId,
        title: 'New Business Card',
        canvas_data: { elements: [] },
        width: 400,
        height: 240
      });
      
      setSelectedProject(newProject);
      setShowEditor(true);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const saveProject = async (canvasData: any) => {
    if (!selectedProject) return;
    
    try {
      const updated = await cardProjectsApi.update(selectedProject.id, {
        canvas_data: canvasData
      });
      
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setShowEditor(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await cardProjectsApi.delete(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (showEditor) {
    return (
      <div className="h-screen">
        <div className="border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {selectedProject?.title || 'New Card'}
          </h1>
          <Button variant="outline" onClick={() => setShowEditor(false)} className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
            Back to Projects
          </Button>
        </div>
        <CanvasEditor
          projectId={selectedProject?.id}
          onSave={saveProject}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Business Cards</h1>
          <p className="text-muted-foreground">Create and manage your professional cards</p>
        </div>
        <Button onClick={createNewProject} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          New Card
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="space-y-8">
          {/* Empty state with quick actions */}
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-3">Start Creating Amazing Cards</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Choose how you want to begin your design journey
            </p>
            
            {/* Quick Start Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => setLocation('/templates')}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LayoutGrid className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Browse Templates</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose from {templates.length}+ professional designs
                  </p>
                  <Button variant="outline" className="w-full border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                    Explore Templates
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => setLocation('/ai-generate')}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Generate with AI</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Describe your vision and let AI create
                  </p>
                  <Button variant="outline" className="w-full border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                    Use AI Designer
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={createNewProject}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Start from Scratch</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Design your card from a blank canvas
                  </p>
                  <Button variant="outline" className="w-full border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                    Blank Canvas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Popular Templates Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Popular Templates</h3>
              <Button variant="ghost" onClick={() => setLocation('/templates')} className="text-primary hover:bg-primary/5">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates.slice(0, 4).map((template) => (
                <Card 
                  key={template.id}
                  className="group hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setLocation(`/templates`)}
                >
                  <CardContent className="p-0">
                    <div 
                      className="h-32 flex items-center justify-center"
                      style={{ background: template.thumbnail }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{template.category}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[5/3] bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">Card Preview</div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowEditor(true);
                    }}
                    className="flex-1 border-border hover:bg-primary/5 hover:text-primary hover:border-primary"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  
                  <Button size="sm" variant="outline" className="border-border hover:bg-primary/5 hover:text-primary hover:border-primary">
                    <Download className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteProject(project.id)}
                    className="text-destructive hover:text-destructive border-border hover:bg-destructive/5 hover:border-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}