import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { cardProjectsApi, type CardProject } from '@/lib/supabase';
import CanvasEditor from '@/components/editor/CanvasEditor';

interface ProjectsDashboardProps {
  userId: string;
}

export default function ProjectsDashboard({ userId }: ProjectsDashboardProps) {
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
          <Button variant="outline" onClick={() => setShowEditor(false)}>
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
        <Button onClick={createNewProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Card
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first professional business card
          </p>
          <Button onClick={createNewProject}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Card
          </Button>
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
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteProject(project.id)}
                    className="text-destructive hover:text-destructive"
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