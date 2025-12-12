'use client';

import { useState, useRef, useEffect } from 'react';

interface VisualEditorProps {
  initialHtml: string;
  onUpdate: (newHtml: string) => void;
}

export function VisualEditor({ initialHtml, onUpdate }: VisualEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const htmlContent = useRef(initialHtml);

  useEffect(() => {
    htmlContent.current = initialHtml;
    if (containerRef.current) {
      containerRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  useEffect(() => {
    if (containerRef.current && isEditing) {
      // Make text elements editable
      const textElements = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, li, td, th');
      textElements.forEach(element => {
        element.setAttribute('contenteditable', 'true');
      });
    }
  }, [isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (containerRef.current) {
      const newHtml = containerRef.current.innerHTML;
      if (newHtml !== htmlContent.current) {
        htmlContent.current = newHtml;
        onUpdate(newHtml);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full outline-none ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: initialHtml }}
    />
  );
}