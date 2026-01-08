import React, { useState } from 'react';
import DropZone from './components/DropZone';
import EquationViewer from './components/EquationViewer';
import InstallPWA from './components/InstallPWA';
import HelpModal from './components/HelpModal';
import { processEquationImage } from './services/gemini';
import { EquationResponse, ProcessingState } from './types';
import { Loader2, Zap, AlertCircle, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [result, setResult] = useState<EquationResponse | null>(null);
  const [state, setState] = useState<ProcessingState>({ status: 'idle' });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleImageSelected = async (base64: string) => {
    setCurrentImage(base64);
    setState({ status: 'processing' });
    setResult(null);

    try {
      const data = await processEquationImage(base64);
      setResult(data);
      setState({ status: 'success' });
    } catch (error: any) {
      console.error(error);
      setState({ 
        status: 'error', 
        message: error.message || "Failed to process the equation." 
      });
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setResult(null);
    setState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 app-drag-region">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2 rounded-lg text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">
              SnapEquation
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <InstallPWA />
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
              title="Help & Installation"
            >
              <HelpCircle size={20} />
            </button>
            <div className="text-sm text-slate-500 hidden sm:block border-l border-slate-200 pl-3">
              Gemini 3 Powered
            </div>
          </div>
        </div>
      </header>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Intro Text */}
        {state.status === 'idle' && (
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Convert Screenshots to <span className="text-brand-600">Math</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-lg">
              Instantly transform images of equations into editable LaTeX and Word-ready MathML.
            </p>
          </div>
        )}

        {/* Processing State */}
        {state.status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-50"></div>
              <Loader2 size={64} className="text-brand-600 animate-spin relative z-10" />
            </div>
            <p className="mt-8 text-lg font-medium text-slate-700">Analyzing equation...</p>
            <p className="text-slate-400 text-sm mt-2">Converting pixels to math logic</p>
          </div>
        )}

        {/* Success State */}
        {state.status === 'success' && result && currentImage && (
          <EquationViewer 
            data={result} 
            originalImage={currentImage} 
            onReset={handleReset} 
          />
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <div className="max-w-lg mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 text-red-600 rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Analysis Failed</h3>
            <p className="text-red-700 mb-6">{state.message}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Idle State - Dropzone */}
        {(state.status === 'idle' || state.status === 'error') && (
           <div className="max-w-2xl mx-auto">
             <DropZone 
               onImageSelected={handleImageSelected} 
               isProcessing={false} 
             />
             
             {/* Feature Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4 font-bold text-lg">
                   Tx
                 </div>
                 <h3 className="font-semibold text-slate-800 mb-1">LaTeX Export</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Get clean, semantic LaTeX code compatible with Overleaf and TeX editors.
                 </p>
               </div>
               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 font-bold text-lg">
                   W
                 </div>
                 <h3 className="font-semibold text-slate-800 mb-1">Word Ready</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Copy MathML to paste perfectly formatted equations directly into MS Word.
                 </p>
               </div>
               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 font-bold text-lg">
                   ⚡
                 </div>
                 <h3 className="font-semibold text-slate-800 mb-1">Fast Paste</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Just screenshot your screen and <kbd className="font-sans px-1 bg-slate-100 rounded text-xs border border-slate-200">Ctrl+V</kbd> anywhere on the page.
                 </p>
               </div>
             </div>
           </div>
        )}

      </main>

      <footer className="border-t border-slate-200 py-6 mt-auto bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SnapEquation. All calculations performed by AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;