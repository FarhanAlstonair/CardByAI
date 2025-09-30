import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Move, RotateCw, Maximize2, Minimize2, 
  FlipHorizontal, FlipVertical, Crop, 
  Scissors, Download, RefreshCw
} from 'lucide-react';

interface BackgroundImageEditorProps {
  imageUrl: string;
  canvasSize: { width: number; height: number };
  settings: {
    scale: number;
    offsetX: number;
    offsetY: number;
    fit: string;
    rotation?: number;
    flipX?: boolean;
    flipY?: boolean;
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
  onSettingsChange: (settings: any) => void;
  onRemove: () => void;
}

export default function BackgroundImageEditor({
  imageUrl,
  canvasSize,
  settings,
  onSettingsChange,
  onRemove
}: BackgroundImageEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    updateSetting('offsetX', settings.offsetX + deltaX);
    updateSetting('offsetY', settings.offsetY + deltaY);
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    onSettingsChange({
      ...settings,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      flipX: false,
      flipY: false
    });
  };

  const fitToCanvas = (fitType: 'cover' | 'contain' | 'fill') => {
    updateSetting('fit', fitType);
    updateSetting('offsetX', 0);
    updateSetting('offsetY', 0);
    updateSetting('scale', 1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Background Image Editor
          <Button size="sm" variant="destructive" onClick={onRemove}>
            Remove
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="relative">
          <div 
            ref={previewRef}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-move relative bg-gray-50"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform"
              style={{
                backgroundImage: `url(${imageUrl})`,
                transform: `
                  scale(${settings.scale}) 
                  translate(${settings.offsetX}px, ${settings.offsetY}px) 
                  rotate(${settings.rotation || 0}deg)
                  ${settings.flipX ? 'scaleX(-1)' : ''} 
                  ${settings.flipY ? 'scaleY(-1)' : ''}
                `,
                filter: `
                  brightness(${settings.brightness || 100}%) 
                  contrast(${settings.contrast || 100}%) 
                  saturate(${settings.saturation || 100}%)
                `,
                backgroundSize: settings.fit === 'fill' ? '100% 100%' : settings.fit
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                Drag to reposition
              </div>
            </div>
          </div>
        </div>

        {/* Fit Controls */}
        <div>
          <label className="text-xs font-medium mb-2 block">Image Fit</label>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              size="sm" 
              variant={settings.fit === 'cover' ? 'default' : 'outline'}
              onClick={() => fitToCanvas('cover')}
              className="text-xs"
            >
              Cover
            </Button>
            <Button 
              size="sm" 
              variant={settings.fit === 'contain' ? 'default' : 'outline'}
              onClick={() => fitToCanvas('contain')}
              className="text-xs"
            >
              Contain
            </Button>
            <Button 
              size="sm" 
              variant={settings.fit === 'fill' ? 'default' : 'outline'}
              onClick={() => fitToCanvas('fill')}
              className="text-xs"
            >
              Fill
            </Button>
          </div>
        </div>

        {/* Scale Control */}
        <div>
          <label className="text-xs font-medium">Scale: {Math.round(settings.scale * 100)}%</label>
          <Slider
            value={[settings.scale * 100]}
            onValueChange={(value) => updateSetting('scale', value[0] / 100)}
            min={10}
            max={300}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Position Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Position X</label>
            <Input
              type="number"
              value={settings.offsetX}
              onChange={(e) => updateSetting('offsetX', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
              step={5}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Position Y</label>
            <Input
              type="number"
              value={settings.offsetY}
              onChange={(e) => updateSetting('offsetY', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
              step={5}
            />
          </div>
        </div>

        {/* Transform Controls */}
        <div>
          <label className="text-xs font-medium mb-2 block">Transform</label>
          <div className="grid grid-cols-4 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateSetting('rotation', (settings.rotation || 0) + 90)}
              className="h-8"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant={settings.flipX ? 'default' : 'outline'}
              onClick={() => updateSetting('flipX', !settings.flipX)}
              className="h-8"
            >
              <FlipHorizontal className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant={settings.flipY ? 'default' : 'outline'}
              onClick={() => updateSetting('flipY', !settings.flipY)}
              className="h-8"
            >
              <FlipVertical className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={resetPosition}
              className="h-8"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Color Adjustments */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium">Brightness: {settings.brightness || 100}%</label>
            <Slider
              value={[settings.brightness || 100]}
              onValueChange={(value) => updateSetting('brightness', value[0])}
              min={0}
              max={200}
              step={5}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Contrast: {settings.contrast || 100}%</label>
            <Slider
              value={[settings.contrast || 100]}
              onValueChange={(value) => updateSetting('contrast', value[0])}
              min={0}
              max={200}
              step={5}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Saturation: {settings.saturation || 100}%</label>
            <Slider
              value={[settings.saturation || 100]}
              onValueChange={(value) => updateSetting('saturation', value[0])}
              min={0}
              max={200}
              step={5}
              className="mt-2"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <Button 
            size="sm" 
            variant="outline"
            onClick={resetPosition}
            className="text-xs"
          >
            Reset All
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Center the image
              updateSetting('offsetX', 0);
              updateSetting('offsetY', 0);
              updateSetting('scale', 1);
            }}
            className="text-xs"
          >
            Center Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}