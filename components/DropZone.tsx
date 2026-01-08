import React, { useState, useCallback, useEffect } from 'react';
import { Upload, ClipboardPaste, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onImageSelected: (base64: string) => void;
  isProcessing: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onImageSelected, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove data URL prefix for API
      const base64 = result.split(',')[1];
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (isProcessing) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          processFile(blob);
          e.preventDefault(); 
        }
        break;
      }
    }
  }, [processFile, isProcessing]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer transition-all duration-300 ease-in-out
        border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center
        min-h-[300px] bg-white shadow-sm
        ${isDragging 
          ? 'border-brand-500 bg-brand-50' 
          : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'}
          transition-colors duration-300
        `}>
          {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-700">
            Paste or Drop Screenshot
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Take a screenshot <kbd className="font-sans px-2 py-1 bg-slate-100 rounded border border-slate-200 text-xs text-slate-500">Win+Shift+S</kbd> or <kbd className="font-sans px-2 py-1 bg-slate-100 rounded border border-slate-200 text-xs text-slate-500">Cmd+Shift+4</kbd> and paste it here <kbd className="font-sans px-2 py-1 bg-slate-100 rounded border border-slate-200 text-xs text-slate-500">Ctrl+V</kbd>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mt-2">
          <ClipboardPaste size={14} />
          <span>Clipboard Ready</span>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
