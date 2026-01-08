import React from 'react';
import { X, Monitor, Command } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">How to Use & Install</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* Installation Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-600 flex items-center gap-2">
              <Monitor size={20} />
              Installation
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>Install this website as a native app on your PC for the best experience.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click the <strong>"Install App"</strong> button in the top header (if visible).</li>
                <li>Or look for the <strong>Install Icon</strong> (computer with download arrow) in your browser's address bar on the right side.</li>
                <li>Or open the browser menu (⋮) <span className="text-slate-400">→</span> Apps <span className="text-slate-400">→</span> Install SnapEquation.</li>
              </ul>
            </div>
          </section>

          {/* Usage Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-600 flex items-center gap-2">
              <Command size={20} />
              Workflow
            </h3>
            <ol className="relative border-l border-slate-200 ml-3 space-y-6">
              <li className="ml-6 relative">
                <span className="absolute -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white text-sm font-semibold text-slate-600">
                  1
                </span>
                <h4 className="font-medium text-slate-900">Capture</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Press <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">Win</kbd> + <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">Shift</kbd> + <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">S</kbd> to take a screenshot of the equation.
                </p>
              </li>
              <li className="ml-6 relative">
                <span className="absolute -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white text-sm font-semibold text-slate-600">
                  2
                </span>
                <h4 className="font-medium text-slate-900">Paste</h4>
                <p className="text-sm text-slate-500 mt-1">
                   Click in this app and press <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">Ctrl</kbd> + <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">V</kbd>.
                </p>
              </li>
              <li className="ml-6 relative">
                 <span className="absolute -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white text-sm font-semibold text-slate-600">
                  3
                </span>
                <h4 className="font-medium text-slate-900">Copy to Word</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Click the <strong>Copy for Word</strong> button (MathML).
                </p>
              </li>
              <li className="ml-6 relative">
                 <span className="absolute -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-4 ring-white text-sm font-bold">
                  4
                </span>
                <h4 className="font-medium text-slate-900">Insert</h4>
                <p className="text-sm text-slate-500 mt-1">
                  In Word, press <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">Alt</kbd> + <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-xs">=</kbd> to create an equation box, then Paste.
                </p>
              </li>
            </ol>
          </section>

        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;