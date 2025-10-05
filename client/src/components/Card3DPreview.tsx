import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import type { TemplateCanvas } from "@shared/schema";

interface Card3DPreviewProps {
  front: TemplateCanvas;
  back?: TemplateCanvas;
  className?: string;
}

export function Card3DPreview({ front, back, className = "" }: Card3DPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const renderCanvas = (canvas: TemplateCanvas) => {
    const aspectRatio = canvas.height / canvas.width;
    
    return (
      <div 
        className="w-full h-full relative overflow-hidden rounded-lg shadow-lg"
        style={{ backgroundColor: canvas.backgroundColor || "#ffffff" }}
      >
        {canvas.elements.map((element) => {
          const leftPercent = (element.left / canvas.width) * 100;
          const topPercent = (element.top / canvas.height) * 100;
          const widthPercent = element.width ? (element.width / canvas.width) * 100 : 20;
          const heightPercent = element.height ? (element.height / canvas.height) * 100 : 10;

          if (element.type === "text") {
            return (
              <div
                key={element.id}
                className="absolute whitespace-pre-wrap"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                  fontFamily: element.style?.fontFamily || "Inter",
                  fontSize: `${(element.style?.fontSize || 14) / 16}rem`,
                  color: element.style?.color || element.style?.fill || "#000000",
                  transform: `rotate(${element.rotation || 0}deg)`,
                  fontWeight: element.style?.fontFamily?.includes("Bold") ? "bold" : "normal",
                }}
              >
                {element.content}
              </div>
            );
          }

          if (element.type === "rect" || element.type === "circle") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: element.style?.fill || "#000000",
                  borderRadius: element.type === "circle" ? "50%" : "0",
                  transform: `rotate(${element.rotation || 0}deg)`,
                }}
              />
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* 3D Flip Container */}
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            aspectRatio: `${front.width} / ${front.height}`,
          }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
            data-testid="card-front"
          >
            {renderCanvas(front)}
          </div>

          {/* Back Side */}
          {back && (
            <div
              className="absolute inset-0 backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              data-testid="card-back"
            >
              {renderCanvas(back)}
            </div>
          )}
        </div>
      </div>

      {/* Flip Button */}
      {back && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setIsFlipped(!isFlipped)}
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="button-flip-card"
          >
            <RotateCw className="w-4 h-4" />
            {isFlipped ? "Show Front" : "Show Back"}
          </Button>
        </div>
      )}
    </div>
  );
}
