import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Type, Image, Square, Download, Save } from 'lucide-react';

interface CanvasEditorProps {
  projectId?: string;
  onSave?: (canvasData: any) => void;
}

export default function CanvasEditor({ projectId, onSave }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addText = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Click to edit',
      x: 50,
      y: 50,
      fontSize: 20,
      color: '#000000',
      fontFamily: 'Inter'
    };
    setElements([...elements, newElement]);
  };

  const addRectangle = () => {
    const newElement = {
      id: Date.now(),
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 100,
      height: 60,
      color: '#3b82f6'
    };
    setElements([...elements, newElement]);
  };

  const addQRCode = () => {
    const newElement = {
      id: Date.now(),
      type: 'qr',
      x: 300,
      y: 50,
      size: 80,
      data: 'https://cardcraft.ai'
    };
    setElements([...elements, newElement]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newElement = {
        id: Date.now(),
        type: 'image',
        src: event.target?.result as string,
        x: 150,
        y: 50,
        width: 100,
        height: 100
      };
      setElements([...elements, newElement]);
    };
    reader.readAsDataURL(file);
  };

  const exportToPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'business-card.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const saveProject = () => {
    const canvasData = { elements, width: 400, height: 240 };
    onSave?.(canvasData);
  };

  const handleMouseDown = (e: React.MouseEvent, element: any) => {
    setSelectedElement(element);
    setDraggedElement(element);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(elements.map(el => 
      el.id === draggedElement.id 
        ? { ...el, x: x - 50, y: y - 25 }
        : el
    ));
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 400, 240);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 240);

    // Draw elements
    elements.forEach(element => {
      if (element.type === 'text') {
        ctx.font = `${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;
        ctx.fillText(element.content, element.x, element.y + element.fontSize);
      } else if (element.type === 'rectangle') {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.width, element.height);
      } else if (element.type === 'qr') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(element.x, element.y, element.size, element.size);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('QR', element.x + 30, element.y + 45);
      }
    });
  }, [elements]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Toolbar */}
      <div className="w-64 border-r bg-card p-4 space-y-4">
        <h3 className="font-semibold text-lg">Elements</h3>
        
        <div className="space-y-2">
          <Button onClick={addText} className="w-full justify-start" variant="outline">
            <Type className="mr-2 h-4 w-4" />
            Add Text
          </Button>
          
          <Button onClick={addRectangle} className="w-full justify-start" variant="outline">
            <Square className="mr-2 h-4 w-4" />
            Add Shape
          </Button>
          
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full justify-start" 
            variant="outline"
          >
            <Image className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          
          <Button onClick={addQRCode} className="w-full justify-start" variant="outline">
            <Square className="mr-2 h-4 w-4" />
            Add QR Code
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Properties Panel */}
        {selectedElement && (
          <Card className="p-4 space-y-3">
            <h4 className="font-medium">Properties</h4>
            
            {selectedElement.type === 'text' && (
              <>
                <div>
                  <label className="text-sm font-medium">Text</label>
                  <Input
                    value={selectedElement.content}
                    onChange={(e) => {
                      setElements(elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, content: e.target.value }
                          : el
                      ));
                      setSelectedElement({ ...selectedElement, content: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <Input
                    type="number"
                    value={selectedElement.fontSize}
                    onChange={(e) => {
                      const fontSize = parseInt(e.target.value);
                      setElements(elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, fontSize }
                          : el
                      ));
                      setSelectedElement({ ...selectedElement, fontSize });
                    }}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="text-sm font-medium">Color</label>
              <Input
                type="color"
                value={selectedElement.color}
                onChange={(e) => {
                  setElements(elements.map(el => 
                    el.id === selectedElement.id 
                      ? { ...el, color: e.target.value }
                      : el
                  ));
                  setSelectedElement({ ...selectedElement, color: e.target.value });
                }}
              />
            </div>
          </Card>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Card Editor</h2>
          
          <div className="flex gap-2">
            <Button onClick={saveProject} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            
            <Button onClick={exportToPNG}>
              <Download className="mr-2 h-4 w-4" />
              Export PNG
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
          <div className="border-2 border-dashed border-border rounded-lg p-4">
            <canvas 
              ref={canvasRef}
              width={400}
              height={240}
              className="border border-border rounded shadow-lg bg-white cursor-pointer"
              onMouseDown={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const clickedElement = elements.find(el => 
                  x >= el.x && x <= el.x + (el.width || 100) &&
                  y >= el.y && y <= el.y + (el.height || el.fontSize || 60)
                );
                
                if (clickedElement) {
                  handleMouseDown(e, clickedElement);
                }
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}