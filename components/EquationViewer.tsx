import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { Copy, Check, FileText, Code, RefreshCw } from 'lucide-react';
import { EquationResponse } from '../types';

interface EquationViewerProps {
  data: EquationResponse;
  originalImage: string; // base64
  onReset: () => void;
}

const EquationViewer: React.FC<EquationViewerProps> = ({ data, originalImage, onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedMathml, setCopiedMathml] = useState(false);

  useEffect(() => {
    if (containerRef.current && data.latex) {
      try {
        katex.render(data.latex, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        console.error("Katex Error", e);
        containerRef.current.innerHTML = "<span class='text-red-500'>Error rendering equation preview.</span>";
      }
    }
  }, [data.latex]);

  const copyToClipboard = async (text: string, type: 'latex' | 'mathml') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'latex') {
        setCopiedLatex(true);
        setTimeout(() => setCopiedLatex(false), 2000);
      } else {
        setCopiedMathml(true);
        setTimeout(() => setCopiedMathml(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Top Bar: Navigation / Explanation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Equation Captured</h2>
           <p className="text-slate-500 text-sm">{data.explanation || "Mathematical Expression"}</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={16} />
          Scan Another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Source Image */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Image</label>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[200px]">
            <img 
              src={`data:image/png;base64,${originalImage}`} 
              alt="Source" 
              className="max-h-[300px] w-auto object-contain"
            />
          </div>
        </div>

        {/* Right Col: Preview */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rendered Preview</label>
           <div 
             className="rounded-xl border border-slate-200 bg-white flex items-center justify-center min-h-[200px] p-6 shadow-sm overflow-x-auto"
           >
             <div ref={containerRef} className="text-lg md:text-xl text-slate-800" />
           </div>
        </div>
      </div>

      {/* Output Formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        
        {/* Word / MathML Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">MS Word</h3>
              <p className="text-xs text-slate-500">
                Press <kbd className="font-sans px-1 bg-slate-100 border border-slate-300 rounded text-[10px]">Alt</kbd> + <kbd className="font-sans px-1 bg-slate-100 border border-slate-300 rounded text-[10px]">=</kbd> in Word, then Paste
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded p-3 text-xs text-slate-500 font-mono break-all h-24 overflow-y-auto border border-slate-100">
            {data.mathml}
          </div>
          <button
            onClick={() => copyToClipboard(data.mathml, 'mathml')}
            className={`
              mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all
              ${copiedMathml 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
              }
            `}
          >
            {copiedMathml ? <><Check size={16} /> Copied MathML</> : <><Copy size={16} /> Copy for Word</>}
          </button>
        </div>

        {/* LaTeX Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Code size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">LaTeX</h3>
              <p className="text-xs text-slate-500">For TeX editors or Word Equation editor</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded p-3 text-xs text-slate-600 font-mono break-all h-24 overflow-y-auto border border-slate-100">
            {data.latex}
          </div>
          <button
             onClick={() => copyToClipboard(data.latex, 'latex')}
             className={`
              mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all
              ${copiedLatex 
                ? 'bg-green-100 text-green-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
              }
            `}
          >
            {copiedLatex ? <><Check size={16} /> Copied LaTeX</> : <><Copy size={16} /> Copy LaTeX Code</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EquationViewer;