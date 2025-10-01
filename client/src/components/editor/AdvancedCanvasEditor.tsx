import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Type, Image, Square, Circle, Star, Zap, Palette, 
  Download, Save, Upload, Layers, RotateCcw, Copy,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2,
  Undo, Redo, ImageIcon, Grid, Move, RotateCw, Maximize2,
  Eye, EyeOff, Lock, Unlock, Sparkles, Wand2, MoreHorizontal
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUndoRedo } from '@/hooks/useUndoRedo';

interface AdvancedCanvasEditorProps {
  projectId?: string;
  initialTemplate?: {
    canvasData?: {
      width?: number;
      height?: number;
      backgroundColor?: string;
      elements?: any[];
    };
  };
  onSave?: (canvasData: any) => void;
}

export default function AdvancedCanvasEditor({ projectId, initialTemplate, onSave }: AdvancedCanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Initialize from template or use defaults
  const [canvasSize, setCanvasSize] = useState({ 
    width: initialTemplate?.canvasData?.width || 350, 
    height: initialTemplate?.canvasData?.height || 200 
  });
  const [zoom, setZoom] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState(
    initialTemplate?.canvasData?.backgroundColor || '#ffffff'
  );
  
  // Enhanced undo/redo with proper state management
  const {
    currentState: elements,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo<any[]>(initialTemplate?.canvasData?.elements || [], 100);
  
  const setElements = (newElements: any[]) => {
    saveToHistory(newElements, 100);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('elements');
  const [showMoreTabs, setShowMoreTabs] = useState(false);
  const [showMoreTemplates, setShowMoreTemplates] = useState(false);
  
  // Background image settings
  const [backgroundImageSettings, setBackgroundImageSettings] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    fit: 'cover',
    rotation: 0,
    flipX: false,
    flipY: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    customWidth: initialTemplate?.canvasData?.width || 400,
    customHeight: initialTemplate?.canvasData?.height || 240,
    aspectRatio: true
  });
  
  const [showSizePresets, setShowSizePresets] = useState(false);
  const [editingSize, setEditingSize] = useState(false);
  const [tempSize, setTempSize] = useState({ 
    width: initialTemplate?.canvasData?.width || 400, 
    height: initialTemplate?.canvasData?.height || 240 
  });

  // Premium font families
  const fontFamilies = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro', 
    'Oswald', 'Raleway', 'Ubuntu', 'Nunito', 'Playfair Display', 'Merriweather', 'Lora', 
    'PT Sans', 'Crimson Text', 'Libre Baskerville', 'Cormorant Garamond', 'Fira Sans',
    'Work Sans', 'DM Sans', 'Plus Jakarta Sans', 'Manrope', 'Space Grotesk', 'Lexend',
    'Outfit', 'Satoshi', 'Geist', 'JetBrains Mono', 'Fira Code', 'Source Code Pro',
    'IBM Plex Sans', 'IBM Plex Serif', 'Rubik', 'Karla', 'Barlow', 'Quicksand',
    'Comfortaa', 'Righteous', 'Bebas Neue', 'Anton', 'Fredoka One', 'Pacifico'
  ];

  // Premium templates with proper z-index
  const templates = [
    { name: 'Modern Tech', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', zIndex: -1 },
    { name: 'Corporate', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', zIndex: -1 },
    { name: 'Creative', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', zIndex: -1 },
    { name: 'Elegant', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', zIndex: -1 },
    { name: 'Sunset', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', zIndex: -1 },
    { name: 'Ocean', bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', zIndex: -1 },
    { name: 'Forest', bg: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', zIndex: -1 },
    { name: 'Galaxy', bg: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', zIndex: -1 },
    { name: 'Fire', bg: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', zIndex: -1 },
    { name: 'Ice', bg: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)', zIndex: -1 },
    { name: 'Neon', bg: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)', zIndex: -1 },
    { name: 'Mint', bg: 'linear-gradient(135deg, #00f5ff 0%, #00d4aa 100%)', zIndex: -1 },
    { name: 'Rose Gold', bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', zIndex: -1 },
    { name: 'Purple Haze', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', zIndex: -1 },
    { name: 'Cosmic', bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', zIndex: -1 },
    { name: 'Emerald', bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', zIndex: -1 }
  ];

  const sizePresets = {
    'Visiting Cards': [
      { name: 'US Standard (Landscape)', width: 350, height: 200, desc: '3.5" × 2"' },
      { name: 'US Standard (Portrait)', width: 200, height: 350, desc: '2" × 3.5"' },
      { name: 'EU Standard (Landscape)', width: 340, height: 220, desc: '85mm × 55mm' },
      { name: 'EU Standard (Portrait)', width: 220, height: 340, desc: '55mm × 85mm' }
    ],
    'Posters': [
      { name: 'A4', width: 794, height: 1123, desc: '210mm × 297mm' },
      { name: 'A3', width: 1123, height: 1587, desc: '297mm × 420mm' },
      { name: 'A2', width: 1587, height: 2245, desc: '420mm × 594mm' },
      { name: 'Large Display', width: 2400, height: 3600, desc: '24" × 36"' }
    ],
    'Social Media': [
      { name: 'Instagram Portrait', width: 1080, height: 1350, desc: '4:5 Ratio' },
      { name: 'Instagram Story', width: 1080, height: 1920, desc: '9:16 Portrait' },
      { name: 'Instagram Square', width: 1080, height: 1080, desc: '1:1 Square' },
      { name: 'LinkedIn Banner', width: 1584, height: 396, desc: '4:1 Ratio' },
      { name: 'Twitter/X Header', width: 1500, height: 500, desc: '3:1 Ratio' }
    ],
    'Flyers & Pamphlets': [
      { name: 'A5', width: 559, height: 794, desc: '148mm × 210mm' },
      { name: 'Half-Letter', width: 550, height: 850, desc: '5.5" × 8.5"' }
    ],
    'Event Materials': [
      { name: 'Invitation Card', width: 500, height: 700, desc: '5" × 7"' },
      { name: 'Certificate (A4 Horizontal)', width: 1123, height: 794, desc: '297mm × 210mm' }
    ],
    'Digital Business': [
      { name: 'Email Signature', width: 600, height: 200, desc: '600px × 200px' },
      { name: 'NFC Card Template', width: 350, height: 200, desc: '3.5" × 2"' }
    ],
    'Future Templates': [
      { name: 'Resume/CV', width: 794, height: 1123, desc: 'A4 Portrait' },
      { name: 'Pitch Deck Slide', width: 1920, height: 1080, desc: '16:9 Format' },
      { name: 'T-Shirt Mockup', width: 1200, height: 1200, desc: 'Square Format' },
      { name: 'Mug Mockup', width: 800, height: 600, desc: '4:3 Ratio' }
    ]
  };

  // Enhanced element management
  const updateElements = (updater: (elements: any[]) => any[]) => {
    const newElements = updater(elements);
    setElements(newElements);
  };

  const addAdvancedText = (style: string) => {
    const styles = {
      heading: { fontSize: 24, fontWeight: 'bold', color: '#000000', strokeColor: '#ffffff', strokeWidth: 3 },
      subheading: { fontSize: 16, fontWeight: '600', color: '#1f2937', strokeColor: '#ffffff', strokeWidth: 2 },
      body: { fontSize: 14, fontWeight: 'normal', color: '#374151', strokeColor: '#ffffff', strokeWidth: 2 }
    };

    const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex || 0)) : 0;
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Your Text Here',
      x: 50,
      y: 50,
      ...styles[style as keyof typeof styles],
      fontFamily: 'Inter',
      opacity: 1,
      zIndex: Math.max(maxZ + 1, 1000)
    };
    updateElements(prev => [...prev, newElement]);
  };

  const addShape = (shapeType: string) => {
    const shapes = {
      rectangle: { width: 120, height: 80 },
      roundedRect: { width: 120, height: 80, borderRadius: 12 },
      circle: { width: 80, height: 80 },
      star: { width: 80, height: 80 }
    };

    const newElement = {
      id: Date.now(),
      type: 'shape',
      shapeType,
      x: 100,
      y: 100,
      color: '#3b82f6',
      opacity: 1,
      zIndex: Math.max(500, ...elements.map(el => el.zIndex || 0)) + 1,
      ...shapes[shapeType as keyof typeof shapes]
    };
    updateElements(prev => [...prev, newElement]);
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
        height: 100,
        opacity: 1,
        zIndex: Math.max(100, ...elements.map(el => el.zIndex || 0)) + 1
      };
      updateElements(prev => [...prev, newElement]);
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newBackgroundElement = {
        id: Date.now(),
        type: 'backgroundImage',
        src: event.target?.result as string,
        x: 0,
        y: 0,
        width: canvasSize.width,
        height: canvasSize.height,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        fit: 'cover',
        rotation: 0,
        flipX: false,
        flipY: false,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        opacity: 1,
        zIndex: -1000 // Always behind other elements
      };
      
      // Remove any existing background image and add new one
      const elementsWithoutBg = elements.filter(el => el.type !== 'backgroundImage');
      updateElements(() => [...elementsWithoutBg, newBackgroundElement]);
    };
    reader.readAsDataURL(file);
  };

  const moveElementLayer = (elementId: number, direction: 'up' | 'down') => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    const newZIndex = direction === 'up' ? element.zIndex + 1 : element.zIndex - 1;
    updateElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, zIndex: Math.max(1, newZIndex) } : el
    ));
  };

  const updateElement = (property: string, value: any) => {
    if (!selectedElement) return;
    
    const updated = { ...selectedElement, [property]: value };
    updateElements(prev => prev.map(el => el.id === selectedElement.id ? updated : el));
    setSelectedElement(updated);
  };

  const duplicateElement = () => {
    if (!selectedElement) return;
    const newElement = {
      ...selectedElement,
      id: Date.now(),
      x: selectedElement.x + 20,
      y: selectedElement.y + 20
    };
    updateElements(prev => [...prev, newElement]);
  };

  const deleteElement = () => {
    if (!selectedElement) return;
    updateElements(prev => prev.filter(el => el.id !== selectedElement.id));
    setSelectedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, element: any) => {
    e.preventDefault();
    setSelectedElement(element);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setDragOffset({
      x: x - element.x,
      y: y - element.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const newX = Math.max(0, Math.min(canvasSize.width - (selectedElement.width || 100), x - dragOffset.x));
    const newY = Math.max(0, Math.min(canvasSize.height - (selectedElement.height || selectedElement.fontSize || 60), y - dragOffset.y));
    
    updateElements(prev => prev.map(el => 
      el.id === selectedElement.id 
        ? { ...el, x: newX, y: newY }
        : el
    ));
    setSelectedElement({ ...selectedElement, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedElement) {
      deleteElement();
    }
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  const exportHighRes = (format: string) => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `design-${format}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw solid color or gradient background
    if (backgroundColor.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    } else if (!backgroundColor.includes('url(')) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    }
    
    // Render pipeline: background images → shapes → regular images → text
    const backgroundImages = elements.filter(el => el.type === 'backgroundImage').sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const shapes = elements.filter(el => el.type === 'shape').sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const images = elements.filter(el => el.type === 'image').sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const texts = elements.filter(el => el.type === 'text').sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    const renderQueue = [...backgroundImages, ...shapes, ...images, ...texts];
    
    renderQueue.forEach((element) => {
      ctx.save();
      ctx.globalAlpha = element.opacity || 1;
      
      if (element.type === 'backgroundImage') {
        // Handle background image element
        const img = document.createElement('img');
        img.onload = () => {
          ctx.save();
          
          // Apply color filters
          ctx.filter = `brightness(${element.brightness || 100}%) contrast(${element.contrast || 100}%) saturate(${element.saturation || 100}%)`;
          
          // Calculate image dimensions based on fit
          let drawWidth, drawHeight, x, y;
          const scale = element.scale || 1;
          const offsetX = element.offsetX || 0;
          const offsetY = element.offsetY || 0;
          const fit = element.fit || 'cover';
          
          if (fit === 'fill') {
            drawWidth = canvasSize.width * scale;
            drawHeight = canvasSize.height * scale;
            x = offsetX;
            y = offsetY;
          } else if (fit === 'contain') {
            const imgAspect = img.width / img.height;
            const canvasAspect = canvasSize.width / canvasSize.height;
            
            if (imgAspect > canvasAspect) {
              drawWidth = canvasSize.width * scale;
              drawHeight = (canvasSize.width / imgAspect) * scale;
            } else {
              drawWidth = (canvasSize.height * imgAspect) * scale;
              drawHeight = canvasSize.height * scale;
            }
            
            x = (canvasSize.width - drawWidth) / 2 + offsetX;
            y = (canvasSize.height - drawHeight) / 2 + offsetY;
          } else {
            // Cover
            const imgAspect = img.width / img.height;
            const canvasAspect = canvasSize.width / canvasSize.height;
            
            if (imgAspect > canvasAspect) {
              drawWidth = (canvasSize.height * imgAspect) * scale;
              drawHeight = canvasSize.height * scale;
            } else {
              drawWidth = canvasSize.width * scale;
              drawHeight = (canvasSize.width / imgAspect) * scale;
            }
            
            x = (canvasSize.width - drawWidth) / 2 + offsetX;
            y = (canvasSize.height - drawHeight) / 2 + offsetY;
          }
          
          // Apply transformations
          ctx.translate(x + drawWidth / 2, y + drawHeight / 2);
          
          if (element.rotation) {
            ctx.rotate((element.rotation * Math.PI) / 180);
          }
          
          if (element.flipX || element.flipY) {
            ctx.scale(element.flipX ? -1 : 1, element.flipY ? -1 : 1);
          }
          
          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          
          ctx.restore();
        };
        img.src = element.src;
      } else {
        ctx.translate(element.x, element.y);
        
        if (element.type === 'text') {
          ctx.font = `${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'} ${element.fontSize}px ${element.fontFamily}`;
          ctx.textAlign = element.textAlign || 'left';
          
          // Apply letter spacing
          if (element.letterSpacing) {
            ctx.letterSpacing = `${element.letterSpacing}px`;
          }
          
          // Handle multi-line text with line height
          const textContent = element.content || element.text || '';
          const lines = textContent.split('\n');
          const lineHeight = (element.lineHeight || 1.2) * element.fontSize;
          
          lines.forEach((line: string, index: number) => {
            const y = element.fontSize + (index * lineHeight);
            
            // Draw text stroke (outline) for visibility
            ctx.strokeStyle = element.strokeColor || '#ffffff';
            ctx.lineWidth = element.strokeWidth || 3;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(line, 0, y);
            
            // Draw text fill
            ctx.fillStyle = element.color;
            ctx.fillText(line, 0, y);
            
            // Add underline if specified
            if (element.textDecoration === 'underline') {
              const textWidth = ctx.measureText(line).width;
              ctx.beginPath();
              ctx.moveTo(0, y + 2);
              ctx.lineTo(textWidth, y + 2);
              ctx.strokeStyle = element.color;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        } else if (element.type === 'shape') {
          ctx.fillStyle = element.color;
          if (element.shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(element.width / 2, element.height / 2, element.width / 2, 0, 2 * Math.PI);
            ctx.fill();
          } else {
            ctx.fillRect(0, 0, element.width, element.height);
          }
        } else if (element.type === 'image') {
          const img = document.createElement('img');
          img.onload = () => {
            ctx.save();
            
            // Apply border radius if specified
            if (element.borderRadius) {
              ctx.beginPath();
              ctx.roundRect(0, 0, element.width, element.height, element.borderRadius);
              ctx.clip();
            }
            
            // Handle object fit
            const objectFit = element.objectFit || 'cover';
            
            if (objectFit === 'fill') {
              ctx.drawImage(img, 0, 0, element.width, element.height);
            } else if (objectFit === 'contain') {
              const imgAspect = img.width / img.height;
              const elementAspect = element.width / element.height;
              
              let drawWidth, drawHeight, offsetX, offsetY;
              
              if (imgAspect > elementAspect) {
                drawWidth = element.width;
                drawHeight = element.width / imgAspect;
                offsetX = 0;
                offsetY = (element.height - drawHeight) / 2;
              } else {
                drawWidth = element.height * imgAspect;
                drawHeight = element.height;
                offsetX = (element.width - drawWidth) / 2;
                offsetY = 0;
              }
              
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            } else {
              // Cover (default)
              const imgAspect = img.width / img.height;
              const elementAspect = element.width / element.height;
              
              let drawWidth, drawHeight, offsetX, offsetY;
              
              if (imgAspect > elementAspect) {
                drawWidth = element.height * imgAspect;
                drawHeight = element.height;
                offsetX = (element.width - drawWidth) / 2;
                offsetY = 0;
              } else {
                drawWidth = element.width;
                drawHeight = element.width / imgAspect;
                offsetX = 0;
                offsetY = (element.height - drawHeight) / 2;
              }
              
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
            
            ctx.restore();
          };
          img.src = element.src;
        }
      }
      
      ctx.restore();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCanvas(ctx);
  }, [elements, backgroundColor, canvasSize, backgroundImageSettings]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Left Panel - Tools */}
      <div className="w-80 bg-[rgb(35,39,47)] border-r border-gray-700/30 shadow-xl overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="pb-4 border-b border-gray-600/30">
            <h2 className="text-xl font-bold text-white mb-1">
              Design Studio
            </h2>
            <p className="text-xs text-gray-400">Professional design tools</p>
          </div>

          <div className="w-full">
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1 mb-4">
              <button
                onClick={() => {
                  console.log('Switching to elements tab');
                  setActiveTab('elements');
                }}
                className={`flex-1 text-xs px-2 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'elements' ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Elements
              </button>
              <button
                onClick={() => {
                  console.log('Switching to text tab');
                  setActiveTab('text');
                }}
                className={`flex-1 text-xs px-2 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'text' ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => {
                  console.log('Switching to design tab');
                  setActiveTab('design');
                }}
                className={`flex-1 text-xs px-2 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'design' ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Design
              </button>
              <button
                onClick={() => {
                  console.log('Switching to layers tab');
                  setActiveTab('layers');
                }}
                className={`flex-1 text-xs px-2 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'layers' ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Layers
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMoreTabs(!showMoreTabs)}
                  className={`px-2 py-2 rounded-md transition-all duration-200 ${
                    activeTab === 'export' || showMoreTabs ? 'bg-blue-600 shadow-sm text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {showMoreTabs && (
                  <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-24">
                    <button
                      onClick={() => {
                        setActiveTab('export');
                        setShowMoreTabs(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    >
                      Export
                    </button>
                  </div>
                )}
              </div>
            </div>

            {activeTab === 'elements' && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                <Card className="border-gray-600/30 rounded-xl shadow-sm bg-gray-800/50">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-200">Shapes</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 pt-0">
                    <Button variant="outline" onClick={() => addShape('rectangle')} className="h-12 rounded-xl border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20 transition-all duration-200">
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => addShape('roundedRect')} className="h-12 rounded-xl border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20 transition-all duration-200">
                      <Square className="h-4 w-4 rounded" />
                    </Button>
                    <Button variant="outline" onClick={() => addShape('circle')} className="h-12 rounded-xl border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20 transition-all duration-200">
                      <Circle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => addShape('star')} className="h-12 rounded-xl border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20 transition-all duration-200">
                      <Star className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-600/30 rounded-xl shadow-sm bg-gray-800/50">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-200">Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full justify-start rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => bgImageInputRef.current?.click()}
                      className="w-full justify-start rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Background Image
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                <Card className="border-gray-600/30 rounded-xl shadow-sm bg-gray-800/50">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-200">Text Styles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <Button variant="outline" onClick={() => addAdvancedText('heading')} className="w-full justify-start rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20">
                      <Type className="mr-2 h-4 w-4" />
                      Heading
                    </Button>
                    <Button variant="outline" onClick={() => addAdvancedText('subheading')} className="w-full justify-start rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20">
                      <Type className="mr-2 h-4 w-4" />
                      Subheading
                    </Button>
                    <Button variant="outline" onClick={() => addAdvancedText('body')} className="w-full justify-start rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400 hover:bg-blue-600/20">
                      <Type className="mr-2 h-4 w-4" />
                      Body Text
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                <Card className="border-gray-200">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-700">Background</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <Button
                      variant={backgroundColor === '#ffffff' ? 'default' : 'outline'}
                      onClick={() => {
                        setBackgroundColor('#ffffff');
                        saveToHistory(elements, 0);
                      }}
                      className={`w-full h-12 border-2 transition-all rounded-lg ${
                        backgroundColor === '#ffffff' 
                          ? 'border-blue-500 bg-blue-600/20 text-blue-400' 
                          : 'border-gray-600 bg-gray-700/50 text-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <span className="text-xs font-medium">None (White Background)</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => bgImageInputRef.current?.click()}
                      className="w-full justify-start h-12 border-2 border-dashed border-gray-300 hover:border-blue-300"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-xs font-medium">Custom Background Image</div>
                        <div className="text-xs text-gray-500">Upload & customize</div>
                      </div>
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {templates.map((template, index) => {
                        const isSelected = backgroundColor === template.bg;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => {
                              // Remove existing background image elements
                              const elementsWithoutBg = elements.filter(el => el.type !== 'backgroundImage');
                              setBackgroundColor(template.bg);
                              updateElements(() => elementsWithoutBg);
                            }}
                            className={`h-16 p-2 border-2 transition-all relative overflow-hidden rounded-lg ${
                              isSelected 
                                ? 'border-blue-400 ring-2 ring-blue-400/30' 
                                : 'border-gray-600 hover:border-blue-400'
                            }`}
                            style={{ background: template.bg }}
                          >
                            <span className="text-white text-xs font-medium drop-shadow-md relative z-10">
                              {template.name}
                            </span>
                            {isSelected && (
                              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Background Image Controls */}
                {backgroundColor.includes('url(') && (
                  <Card className="border-gray-200 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
                        Background Image Settings
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setBackgroundColor('#ffffff')}
                          className="h-6 text-xs"
                        >
                          Remove
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      {/* Fit Options */}
                      <div>
                        <label className="text-xs font-medium mb-2 block">Image Fit</label>
                        <div className="grid grid-cols-3 gap-1">
                          <Button 
                            size="sm" 
                            variant={backgroundImageSettings.fit === 'cover' ? 'default' : 'outline'}
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, fit: 'cover', offsetX: 0, offsetY: 0, scale: 1 }))}
                            className="text-xs h-8"
                          >
                            Cover
                          </Button>
                          <Button 
                            size="sm" 
                            variant={backgroundImageSettings.fit === 'contain' ? 'default' : 'outline'}
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, fit: 'contain', offsetX: 0, offsetY: 0, scale: 1 }))}
                            className="text-xs h-8"
                          >
                            Contain
                          </Button>
                          <Button 
                            size="sm" 
                            variant={backgroundImageSettings.fit === 'fill' ? 'default' : 'outline'}
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, fit: 'fill', offsetX: 0, offsetY: 0, scale: 1 }))}
                            className="text-xs h-8"
                          >
                            Fill
                          </Button>
                        </div>
                      </div>

                      {/* Scale Control */}
                      <div>
                        <label className="text-xs font-medium">Scale: {Math.round(backgroundImageSettings.scale * 100)}%</label>
                        <Slider
                          value={[backgroundImageSettings.scale * 100]}
                          onValueChange={(value) => setBackgroundImageSettings(prev => ({ ...prev, scale: value[0] / 100 }))}
                          min={10}
                          max={300}
                          step={5}
                          className="mt-2"
                        />
                      </div>

                      {/* Position Controls */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium">Position X</label>
                          <Input
                            type="number"
                            value={backgroundImageSettings.offsetX}
                            onChange={(e) => setBackgroundImageSettings(prev => ({ ...prev, offsetX: parseInt(e.target.value) || 0 }))}
                            className="h-8 text-xs"
                            step={5}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Position Y</label>
                          <Input
                            type="number"
                            value={backgroundImageSettings.offsetY}
                            onChange={(e) => setBackgroundImageSettings(prev => ({ ...prev, offsetY: parseInt(e.target.value) || 0 }))}
                            className="h-8 text-xs"
                            step={5}
                          />
                        </div>
                      </div>

                      {/* Transform Controls */}
                      <div>
                        <label className="text-xs font-medium mb-2 block">Transform</label>
                        <div className="grid grid-cols-4 gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, rotation: (prev.rotation || 0) + 90 }))}
                            className="h-8"
                            title="Rotate 90°"
                          >
                            <RotateCw className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={backgroundImageSettings.flipX ? 'default' : 'outline'}
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, flipX: !prev.flipX }))}
                            className="h-8"
                            title="Flip Horizontal"
                          >
                            ↔
                          </Button>
                          <Button 
                            size="sm" 
                            variant={backgroundImageSettings.flipY ? 'default' : 'outline'}
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, flipY: !prev.flipY }))}
                            className="h-8"
                            title="Flip Vertical"
                          >
                            ↕
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setBackgroundImageSettings(prev => ({ ...prev, rotation: 0, flipX: false, flipY: false }))}
                            className="h-8"
                            title="Reset Transform"
                          >
                            ↻
                          </Button>
                        </div>
                      </div>

                      {/* Color Adjustments */}
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-medium">Brightness: {backgroundImageSettings.brightness || 100}%</label>
                          <Slider
                            value={[backgroundImageSettings.brightness || 100]}
                            onValueChange={(value) => setBackgroundImageSettings(prev => ({ ...prev, brightness: value[0] }))}
                            min={0}
                            max={200}
                            step={5}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Contrast: {backgroundImageSettings.contrast || 100}%</label>
                          <Slider
                            value={[backgroundImageSettings.contrast || 100]}
                            onValueChange={(value) => setBackgroundImageSettings(prev => ({ ...prev, contrast: value[0] }))}
                            min={0}
                            max={200}
                            step={5}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Saturation: {backgroundImageSettings.saturation || 100}%</label>
                          <Slider
                            value={[backgroundImageSettings.saturation || 100]}
                            onValueChange={(value) => setBackgroundImageSettings(prev => ({ ...prev, saturation: value[0] }))}
                            min={0}
                            max={200}
                            step={5}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setBackgroundImageSettings({ scale: 1, offsetX: 0, offsetY: 0, fit: 'cover', rotation: 0, flipX: false, flipY: false, brightness: 100, contrast: 100, saturation: 100, customWidth: 400, customHeight: 240, aspectRatio: true })}
                          className="text-xs h-8"
                        >
                          Reset All
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setBackgroundImageSettings(prev => ({ ...prev, offsetX: 0, offsetY: 0, scale: 1 }))}
                          className="text-xs h-8"
                        >
                          Center
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                <Card className="border-gray-200">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      Layers ({elements.length})
                      <Button size="sm" variant="outline" onClick={() => {
                        updateElements(() => []);
                        setSelectedElement(null);
                      }} className="h-6 text-xs">
                        Clear All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    {elements
                      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                      .map((element, index) => (
                      <div 
                        key={element.id} 
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                          selectedElement?.id === element.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedElement(element)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-4 h-4 rounded border flex items-center justify-center text-xs font-mono bg-white">
                            {elements.length - index}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">
                              {element.type === 'text' ? element.content.slice(0, 20) + (element.content.length > 20 ? '...' : '') : 
                               element.type === 'image' ? 'Image' : 
                               element.type === 'backgroundImage' ? 'Background Image' :
                               element.shapeType || 'Shape'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {element.type === 'backgroundImage' ? 'background' : element.type} • z:{element.zIndex || 0}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateElements(prev => prev.map(el => 
                                el.id === element.id ? { ...el, opacity: el.opacity === 0 ? 1 : 0 } : el
                              ));
                            }} 
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                            title={element.opacity === 0 ? 'Show' : 'Hide'}
                          >
                            {element.opacity === 0 ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateElements(prev => prev.filter(el => el.id !== element.id));
                              if (selectedElement?.id === element.id) setSelectedElement(null);
                            }} 
                            className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {elements.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div>No layers yet</div>
                        <div className="text-xs mt-1">Add elements to see them here</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-3 transition-all duration-200 ease-in-out">
                {/* Canvas Size Controls */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      Canvas Size
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowSizePresets(!showSizePresets)}
                        className="h-6 text-xs"
                      >
                        {showSizePresets ? 'Hide' : 'Presets'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {/* Current Size Display */}
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      Current: {canvasSize.width} × {canvasSize.height} px
                    </div>
                    
                    {/* Custom Size Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium">Width (px)</label>
                        <Input
                          type="number"
                          value={editingSize ? tempSize.width : canvasSize.width}
                          onChange={(e) => {
                            const width = parseInt(e.target.value) || 400;
                            if (editingSize) {
                              setTempSize(prev => ({ ...prev, width }));
                            } else {
                              setEditingSize(true);
                              setTempSize({ width, height: canvasSize.height });
                            }
                          }}
                          onBlur={() => {
                            if (editingSize) {
                              setCanvasSize(tempSize);
                              setEditingSize(false);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editingSize) {
                              setCanvasSize(tempSize);
                              setEditingSize(false);
                            }
                          }}
                          className="h-8 text-xs"
                          min={100}
                          max={5000}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Height (px)</label>
                        <Input
                          type="number"
                          value={editingSize ? tempSize.height : canvasSize.height}
                          onChange={(e) => {
                            const height = parseInt(e.target.value) || 240;
                            if (editingSize) {
                              setTempSize(prev => ({ ...prev, height }));
                            } else {
                              setEditingSize(true);
                              setTempSize({ width: canvasSize.width, height });
                            }
                          }}
                          onBlur={() => {
                            if (editingSize) {
                              setCanvasSize(tempSize);
                              setEditingSize(false);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && editingSize) {
                              setCanvasSize(tempSize);
                              setEditingSize(false);
                            }
                          }}
                          className="h-8 text-xs"
                          min={100}
                          max={5000}
                        />
                      </div>
                    </div>
                    
                    {/* Size Presets */}
                    {showSizePresets && (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.entries(sizePresets).map(([category, sizes]) => (
                          <div key={category}>
                            <h4 className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1">{category}</h4>
                            <div className="space-y-1">
                              {sizes.map((size, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  onClick={() => {
                                    setCanvasSize({ width: size.width, height: size.height });
                                    setShowSizePresets(false);
                                  }}
                                  className="w-full justify-start h-auto p-2 text-left"
                                >
                                  <div>
                                    <div className="text-xs font-medium">{size.name}</div>
                                    <div className="text-xs text-gray-500">{size.desc}</div>
                                    <div className="text-xs text-blue-600">{size.width} × {size.height}px</div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Export Options */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-gray-700">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <Button onClick={() => exportHighRes('web')} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Web Quality
                    </Button>
                    <Button onClick={() => exportHighRes('print')} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Print Quality
                    </Button>
                    <Button onClick={() => onSave?.({ elements, backgroundColor, canvasSize })} variant="outline" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Properties Panel */}
          {selectedElement && (
            <Card className="border-gray-600/30 border-t-2 border-t-blue-500 rounded-xl shadow-sm bg-gray-800/50">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {selectedElement.type === 'text' ? 'Text Properties' : 'Element Properties'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={duplicateElement}
                    className="flex-1 hover:bg-blue-50 border-blue-200 rounded-lg"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={deleteElement}
                    className="flex-1 bg-red-500 hover:bg-red-600 rounded-lg"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {selectedElement.type === 'text' && (
                  <div className="space-y-3">
                    {/* Text Content */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Content</label>
                      <Input
                        value={selectedElement.content}
                        onChange={(e) => updateElement('content', e.target.value)}
                        className="text-sm rounded-lg bg-gray-700/50 border-gray-600 text-gray-200"
                        placeholder="Enter text..."
                      />
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Font Family</label>
                      <Select 
                        value={selectedElement.fontFamily || 'Inter'}
                        onValueChange={(value) => updateElement('fontFamily', value)}
                      >
                        <SelectTrigger className="h-8 text-xs rounded-lg bg-gray-700/50 border-gray-600 text-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-48 bg-gray-800 border-gray-600">
                          {fontFamilies.map((font) => (
                            <SelectItem key={font} value={font} className="text-xs text-gray-200" style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Font Size: {selectedElement.fontSize}px</label>
                      <Slider
                        value={[selectedElement.fontSize || 16]}
                        onValueChange={(value) => updateElement('fontSize', value[0])}
                        min={8}
                        max={120}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>8px</span>
                        <span>120px</span>
                      </div>
                    </div>

                    {/* Font Weight */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Font Weight</label>
                      <Select 
                        value={selectedElement.fontWeight || 'normal'}
                        onValueChange={(value) => updateElement('fontWeight', value)}
                      >
                        <SelectTrigger className="h-8 text-xs rounded-lg bg-gray-700/50 border-gray-600 text-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="300" className="text-xs text-gray-200">Light (300)</SelectItem>
                          <SelectItem value="normal" className="text-xs text-gray-200">Regular (400)</SelectItem>
                          <SelectItem value="500" className="text-xs text-gray-200">Medium (500)</SelectItem>
                          <SelectItem value="600" className="text-xs text-gray-200">Semi Bold (600)</SelectItem>
                          <SelectItem value="bold" className="text-xs text-gray-200">Bold (700)</SelectItem>
                          <SelectItem value="800" className="text-xs text-gray-200">Extra Bold (800)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Text Style Buttons */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-2 block">Text Style</label>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                          onClick={() => updateElement('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
                          className="h-8 w-8 p-0 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          <Italic className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                          onClick={() => updateElement('textDecoration', selectedElement.textDecoration === 'underline' ? 'none' : 'underline')}
                          className="h-8 w-8 p-0 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          U
                        </Button>
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-2 block">Text Align</label>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                          onClick={() => updateElement('textAlign', 'left')}
                          className="h-8 w-8 p-0 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          <AlignLeft className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                          onClick={() => updateElement('textAlign', 'center')}
                          className="h-8 w-8 p-0 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          <AlignCenter className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                          onClick={() => updateElement('textAlign', 'right')}
                          className="h-8 w-8 p-0 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          <AlignRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Letter Spacing */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Letter Spacing: {selectedElement.letterSpacing || 0}px</label>
                      <Slider
                        value={[selectedElement.letterSpacing || 0]}
                        onValueChange={(value) => updateElement('letterSpacing', value[0])}
                        min={-2}
                        max={10}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>

                    {/* Line Height */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Line Height: {selectedElement.lineHeight || 1.2}</label>
                      <Slider
                        value={[selectedElement.lineHeight || 1.2]}
                        onValueChange={(value) => updateElement('lineHeight', value[0])}
                        min={0.8}
                        max={3}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>

                    {/* Text Stroke/Outline */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-2 block">Text Outline</label>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-300 mb-1 block">Stroke Width: {selectedElement.strokeWidth || 2}px</label>
                          <Slider
                            value={[selectedElement.strokeWidth || 2]}
                            onValueChange={(value) => updateElement('strokeWidth', value[0])}
                            min={0}
                            max={10}
                            step={0.5}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-300 mb-1 block">Stroke Color</label>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="color"
                              value={selectedElement.strokeColor || '#ffffff'}
                              onChange={(e) => updateElement('strokeColor', e.target.value)}
                              className="h-8 w-16 rounded-lg bg-gray-700/50 border-gray-600"
                            />
                            <Input
                              type="text"
                              value={selectedElement.strokeColor || '#ffffff'}
                              onChange={(e) => updateElement('strokeColor', e.target.value)}
                              className="h-8 text-xs rounded-lg bg-gray-700/50 border-gray-600 text-gray-200"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'backgroundImage' && (
                  <div className="space-y-3">
                    {/* Fit Options */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-2 block">Image Fit</label>
                      <div className="grid grid-cols-3 gap-1">
                        <Button 
                          size="sm" 
                          variant={selectedElement.fit === 'cover' ? 'default' : 'outline'}
                          onClick={() => updateElement('fit', 'cover')}
                          className="text-xs h-8 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Cover
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.fit === 'contain' ? 'default' : 'outline'}
                          onClick={() => updateElement('fit', 'contain')}
                          className="text-xs h-8 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Contain
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.fit === 'fill' ? 'default' : 'outline'}
                          onClick={() => updateElement('fit', 'fill')}
                          className="text-xs h-8 rounded-lg border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Fill
                        </Button>
                      </div>
                    </div>

                    {/* Scale Control */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-1 block">Scale: {Math.round((selectedElement.scale || 1) * 100)}%</label>
                      <Slider
                        value={[(selectedElement.scale || 1) * 100]}
                        onValueChange={(value) => updateElement('scale', value[0] / 100)}
                        min={10}
                        max={300}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    {/* Position Controls */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Position X</label>
                        <Input
                          type="number"
                          value={selectedElement.offsetX || 0}
                          onChange={(e) => updateElement('offsetX', parseInt(e.target.value) || 0)}
                          className="h-8 text-xs bg-gray-700/50 border-gray-600 text-gray-200"
                          step={5}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Position Y</label>
                        <Input
                          type="number"
                          value={selectedElement.offsetY || 0}
                          onChange={(e) => updateElement('offsetY', parseInt(e.target.value) || 0)}
                          className="h-8 text-xs bg-gray-700/50 border-gray-600 text-gray-200"
                          step={5}
                        />
                      </div>
                    </div>

                    {/* Transform Controls */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-2 block">Transform</label>
                      <div className="grid grid-cols-4 gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateElement('rotation', (selectedElement.rotation || 0) + 90)}
                          className="h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                          title="Rotate 90°"
                        >
                          <RotateCw className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.flipX ? 'default' : 'outline'}
                          onClick={() => updateElement('flipX', !selectedElement.flipX)}
                          className="h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                          title="Flip Horizontal"
                        >
                          ↔
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedElement.flipY ? 'default' : 'outline'}
                          onClick={() => updateElement('flipY', !selectedElement.flipY)}
                          className="h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                          title="Flip Vertical"
                        >
                          ↕
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            updateElement('rotation', 0);
                            updateElement('flipX', false);
                            updateElement('flipY', false);
                          }}
                          className="h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                          title="Reset Transform"
                        >
                          ↻
                        </Button>
                      </div>
                    </div>

                    {/* Color Adjustments */}
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Brightness: {selectedElement.brightness || 100}%</label>
                        <Slider
                          value={[selectedElement.brightness || 100]}
                          onValueChange={(value) => updateElement('brightness', value[0])}
                          min={0}
                          max={200}
                          step={5}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Contrast: {selectedElement.contrast || 100}%</label>
                        <Slider
                          value={[selectedElement.contrast || 100]}
                          onValueChange={(value) => updateElement('contrast', value[0])}
                          min={0}
                          max={200}
                          step={5}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Saturation: {selectedElement.saturation || 100}%</label>
                        <Slider
                          value={[selectedElement.saturation || 100]}
                          onValueChange={(value) => updateElement('saturation', value[0])}
                          min={0}
                          max={200}
                          step={5}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-600">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          updateElement('scale', 1);
                          updateElement('offsetX', 0);
                          updateElement('offsetY', 0);
                          updateElement('rotation', 0);
                          updateElement('flipX', false);
                          updateElement('flipY', false);
                          updateElement('brightness', 100);
                          updateElement('contrast', 100);
                          updateElement('saturation', 100);
                        }}
                        className="text-xs h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                      >
                        Reset All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          updateElement('offsetX', 0);
                          updateElement('offsetY', 0);
                          updateElement('scale', 1);
                        }}
                        className="text-xs h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                      >
                        Center
                      </Button>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'image' && (
                  <div className="space-y-3">
                    {/* Image Size Controls */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Width</label>
                        <Input
                          type="number"
                          value={selectedElement.width || 100}
                          onChange={(e) => updateElement('width', parseInt(e.target.value) || 100)}
                          className="h-8 text-xs bg-gray-700/50 border-gray-600 text-gray-200"
                          min={10}
                          max={1000}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-200 mb-1 block">Height</label>
                        <Input
                          type="number"
                          value={selectedElement.height || 100}
                          onChange={(e) => updateElement('height', parseInt(e.target.value) || 100)}
                          className="h-8 text-xs bg-gray-700/50 border-gray-600 text-gray-200"
                          min={10}
                          max={1000}
                        />
                      </div>
                    </div>

                    {/* Quick Size Presets */}
                    <div>
                      <label className="text-xs font-medium text-gray-200 mb-2 block">Quick Sizes</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            updateElement('width', 50);
                            updateElement('height', 50);
                          }}
                          className="text-xs h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Icon (50x50)
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            updateElement('width', 100);
                            updateElement('height', 100);
                          }}
                          className="text-xs h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Logo (100x100)
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            updateElement('width', 150);
                            updateElement('height', 100);
                          }}
                          className="text-xs h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Banner (150x100)
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            updateElement('width', 80);
                            updateElement('height', 120);
                          }}
                          className="text-xs h-8 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-blue-600/20"
                        >
                          Portrait (80x120)
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Picker - Only for non-background elements */}
                {selectedElement.type !== 'backgroundImage' && selectedElement.color && (
                  <div>
                    <label className="text-xs font-medium text-gray-200 mb-1 block">Color</label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => updateElement('color', e.target.value)}
                        className="h-8 w-16 rounded-lg bg-gray-700/50 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={selectedElement.color}
                        onChange={(e) => updateElement('color', e.target.value)}
                        className="h-8 text-xs rounded-lg bg-gray-700/50 border-gray-600 text-gray-200"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}

                {/* Opacity */}
                <div>
                  <label className="text-xs font-medium text-gray-200 mb-1 block">Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%</label>
                  <Slider
                    value={[(selectedElement.opacity || 1) * 100]}
                    onValueChange={(value) => updateElement('opacity', value[0] / 100)}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-[rgb(35,39,47)] border-b border-gray-700/30 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-white">
              CardCraft Studio
            </h1>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={undo}
                disabled={!canUndo}
                className="flex items-center gap-2 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
              >
                <Undo className="h-4 w-4" />
                <span className="hidden sm:inline">Undo</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={redo}
                disabled={!canRedo}
                className="flex items-center gap-2 border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
              >
                <Redo className="h-4 w-4" />
                <span className="hidden sm:inline">Redo</span>
              </Button>
            </div>
          </div>
          
          {/* Canvas Size Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-300">Canvas:</span>
              <Select 
                value=""
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setEditingSize(true);
                    setTempSize({ width: canvasSize.width, height: canvasSize.height });
                    return;
                  }
                  const [width, height] = value.split('x').map(Number);
                  setCanvasSize({ width, height });
                }}
              >
                <SelectTrigger className="w-32 h-8 text-xs bg-gray-700/50 border border-gray-600 text-gray-200 hover:border-blue-400 focus:border-blue-500 rounded-lg shadow-sm">
                  <SelectValue placeholder="Presets" />
                </SelectTrigger>
                <SelectContent className="max-h-80 w-72 bg-gray-800 border border-gray-600 rounded-xl shadow-xl">
                  {Object.entries(sizePresets).map(([category, sizes]) => (
                    <div key={category}>
                      <div className="px-3 py-2 text-xs font-semibold text-blue-400 bg-gray-700/50 rounded-t-lg">{category}</div>
                      {sizes.map((size, index) => (
                        <SelectItem key={`${category}-${index}`} value={`${size.width}x${size.height}`} className="text-xs py-2 text-gray-200 hover:bg-gray-700 rounded-lg mx-1">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">{size.name}</span>
                            <span className="text-gray-500 text-xs">{size.width}×{size.height}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                  <SelectItem value="custom" className="text-xs font-medium text-blue-400 py-2 border-t border-gray-600 hover:bg-gray-700 rounded-lg mx-1">
                    ⚙️ Custom Size...
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {editingSize ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tempSize.width}
                    onChange={(e) => setTempSize(prev => ({ ...prev, width: parseInt(e.target.value) || 400 }))}
                    onBlur={() => {
                      setCanvasSize(tempSize);
                      setEditingSize(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCanvasSize(tempSize);
                        setEditingSize(false);
                      }
                      if (e.key === 'Escape') {
                        setEditingSize(false);
                        setTempSize({ width: canvasSize.width, height: canvasSize.height });
                      }
                    }}
                    className="w-16 h-7 text-xs px-1 text-center"
                    autoFocus
                  />
                  <span className="text-xs text-gray-500">×</span>
                  <Input
                    type="number"
                    value={tempSize.height}
                    onChange={(e) => setTempSize(prev => ({ ...prev, height: parseInt(e.target.value) || 240 }))}
                    onBlur={() => {
                      setCanvasSize(tempSize);
                      setEditingSize(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCanvasSize(tempSize);
                        setEditingSize(false);
                      }
                      if (e.key === 'Escape') {
                        setEditingSize(false);
                        setTempSize({ width: canvasSize.width, height: canvasSize.height });
                      }
                    }}
                    className="w-16 h-7 text-xs px-1 text-center"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingSize(true);
                    setTempSize({ width: canvasSize.width, height: canvasSize.height });
                  }}
                  className="text-xs text-gray-200 bg-gray-700/50 border border-gray-600 hover:border-blue-400 hover:bg-gray-600 px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                  title="Click to edit size"
                >
                  {canvasSize.width} × {canvasSize.height}px
                </button>
              )}
            </div>
            
            {/* Custom Size Modal */}
            {editingSize && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-xl shadow-2xl w-96 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Canvas Size</h3>
                    <button 
                      onClick={() => setEditingSize(false)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Width</label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={tempSize.width}
                            onChange={(e) => setTempSize(prev => ({ ...prev, width: parseInt(e.target.value) || 400 }))}
                            min={100}
                            max={5000}
                            className="pr-8"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">px</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Height</label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={tempSize.height}
                            onChange={(e) => setTempSize(prev => ({ ...prev, height: parseInt(e.target.value) || 240 }))}
                            min={100}
                            max={5000}
                            className="pr-8"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">px</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Preview: {tempSize.width} × {tempSize.height} pixels
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button 
                      onClick={() => {
                        setCanvasSize(tempSize);
                        setEditingSize(false);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Size
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingSize(false);
                        setTempSize({ width: canvasSize.width, height: canvasSize.height });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div 
            className="relative shadow-2xl rounded-2xl overflow-hidden"
            style={{ 
              transform: `scale(${zoom / 100})`,
              maxWidth: '90vw',
              maxHeight: '80vh'
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="border border-gray-200/30 cursor-pointer bg-white rounded-2xl"
              style={{
                backgroundImage: backgroundColor.includes('gradient') ? backgroundColor : undefined
              }}
              onMouseDown={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                
                const scale = zoom / 100;
                const x = (e.clientX - rect.left) / scale;
                const y = (e.clientY - rect.top) / scale;
                
                // Find clicked element with proper hit detection
                const clickedElement = elements
                  .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)) // Check highest z-index first
                  .find(el => {
                    if (el.type === 'text') {
                      // Text hit area
                      const textWidth = el.content ? el.content.length * (el.fontSize || 16) * 0.6 : 100;
                      const textHeight = (el.fontSize || 16) * 1.2;
                      return x >= el.x && x <= el.x + textWidth &&
                             y >= el.y && y <= el.y + textHeight;
                    } else if (el.type === 'backgroundImage') {
                      // Background image covers full canvas
                      return x >= 0 && x <= canvasSize.width &&
                             y >= 0 && y <= canvasSize.height;
                    } else {
                      // Regular elements (shapes, images)
                      return x >= el.x && x <= el.x + (el.width || 100) &&
                             y >= el.y && y <= el.y + (el.height || 60);
                    }
                  });
                
                if (clickedElement) {
                  handleMouseDown(e, clickedElement);
                } else {
                  setSelectedElement(null);
                }
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {selectedElement && (
              <div
                className="absolute border-2 border-blue-500 pointer-events-none rounded-lg shadow-lg"
                style={{
                  left: selectedElement.x,
                  top: selectedElement.y,
                  width: selectedElement.width || 100,
                  height: selectedElement.height || selectedElement.fontSize || 60,
                  transform: 'translate(-2px, -2px)',
                }}
              >
                <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {selectedElement.type === 'text' ? 'Text' : selectedElement.type === 'image' ? 'Image' : 'Shape'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={bgImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundImageUpload}
        className="hidden"
      />
    </div>
  );
}