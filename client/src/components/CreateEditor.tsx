import { useState, useEffect } from 'react';
import AdvancedCanvasEditor from '@/components/editor/AdvancedCanvasEditor';
import { getTemplateById } from '@shared/templates';

export default function CreateEditor() {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const params = new URLSearchParams(window.location.search);
  const templateId = params.get('templateId');
  const isAI = params.get('ai') === 'true';
  const aiData = params.get('data') ? (() => {
    try {
      return JSON.parse(decodeURIComponent(params.get('data')!));
    } catch (e) {
      console.error('Failed to parse AI data:', e);
      return null;
    }
  })() : null;
  
  useEffect(() => {
    if (isAI) {
      // AI generation - create template from AI data
      const data = aiData?.data || {};
      const aiTemplate = {
        canvasData: {
          width: 1050,
          height: 600,
          backgroundColor: data.backgroundColor || '#ffffff',
          elements: [
            { type: 'text', id: 'name', x: 80, y: 120, content: data.name || 'Your Name', fontSize: 32, fontFamily: 'Inter', fontWeight: 'bold', fill: data.textColor || '#1f2937', zIndex: 1000 },
            { type: 'text', id: 'title', x: 80, y: 170, content: data.jobTitle || 'Your Title', fontSize: 18, fill: data.accentColor || '#de6712', zIndex: 1001 },
            { type: 'text', id: 'company', x: 80, y: 200, content: data.company || 'Your Company', fontSize: 16, fill: data.textColor || '#1f2937', zIndex: 1002 },
            { type: 'text', id: 'email', x: 80, y: 280, content: data.email || 'your.email@company.com', fontSize: 14, fill: data.textColor || '#475569', zIndex: 1003 },
            { type: 'text', id: 'phone', x: 80, y: 310, content: data.phone || '+1 (555) 123-4567', fontSize: 14, fill: data.textColor || '#475569', zIndex: 1004 },
            { type: 'text', id: 'website', x: 80, y: 340, content: data.website || 'https://company.com', fontSize: 14, fill: data.accentColor || '#de6712', zIndex: 1005 }
          ]
        }
      };
      setTemplate(aiTemplate);
      setLoading(false);
    } else if (templateId) {
      // Try local templates first
      const localTemplate = getTemplateById(templateId);
      if (localTemplate) {
        setTemplate(localTemplate);
        setLoading(false);
      } else {
        // Fetch from API for generated templates
        fetch(`/api/templates/${templateId}`)
          .then(res => res.json())
          .then(data => {
            setTemplate(data);
            setLoading(false);
          })
          .catch(() => {
            // Fallback to basic template
            setTemplate({
              canvasData: {
                width: 1050,
                height: 600,
                backgroundColor: '#ffffff',
                elements: [
                  { type: 'text', id: 'name', x: 80, y: 180, content: 'Your Name', fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1f2937' },
                  { type: 'text', id: 'title', x: 80, y: 240, content: 'Your Title', fontSize: 20, fill: '#64748b' }
                ]
              }
            });
            setLoading(false);
          });
      }
    } else {
      // No template, start blank
      setLoading(false);
    }
  }, [templateId, isAI]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Loading your design studio...</p>
        </div>
      </div>
    );
  }
  
  // Transform template data to match AdvancedCanvasEditor expected format
  const initialTemplate = template ? {
    canvasData: {
      width: template.canvasData?.width || template.front?.width || 1050,
      height: template.canvasData?.height || template.front?.height || 600,
      backgroundColor: template.canvasData?.backgroundColor || template.front?.backgroundColor || '#ffffff',
      elements: (template.canvasData?.elements || template.front?.elements || []).map((el, index) => ({
        ...el,
        id: el.id || `element-${index}`,
        content: el.text || el.content || '',
        x: el.x || el.left || 0,
        y: el.y || el.top || 0,
        color: el.color || el.fill || el.style?.fill || '#000000',
        fontSize: el.fontSize || el.style?.fontSize || 16,
        fontFamily: el.fontFamily || el.style?.fontFamily || 'Inter',
        zIndex: el.zIndex || (1000 + index)
      }))
    },
    backData: template.back ? {
      width: template.back.width || 1050,
      height: template.back.height || 600,
      backgroundColor: template.back.backgroundColor || '#ffffff',
      elements: (template.back.elements || []).map((el, index) => ({
        ...el,
        id: el.id || `back-element-${index}`,
        content: el.text || el.content || '',
        x: el.x || el.left || 0,
        y: el.y || el.top || 0,
        color: el.color || el.fill || el.style?.fill || '#000000',
        fontSize: el.fontSize || el.style?.fontSize || 16,
        fontFamily: el.fontFamily || el.style?.fontFamily || 'Inter',
        zIndex: el.zIndex || (2000 + index)
      }))
    } : null
  } : undefined;
  
  return (
    <AdvancedCanvasEditor
      initialTemplate={initialTemplate}
      onSave={async (canvasData) => {
        console.log('Saving design:', canvasData);
      }}
    />
  );
}