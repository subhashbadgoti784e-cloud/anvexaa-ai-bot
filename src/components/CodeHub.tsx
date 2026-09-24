import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderArchive, 
  FileText, 
  Terminal, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { DELIVERABLE_FILES } from '../data/deliverables';
import { downloadSingleFile, downloadProjectZip } from '../utils/zipDownloader';

export const CodeHub: React.FC = () => {
  const [selectedFilename, setSelectedFilename] = useState<string>('main.py');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const selectedFile = DELIVERABLE_FILES.find((f) => f.filename === selectedFilename) || DELIVERABLE_FILES[0];

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const getFileBadgeColor = (filename: string) => {
    if (filename.endsWith('.py')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    if (filename.endsWith('.csv')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (filename.endsWith('.md')) return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
    return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileCode className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">Project Deliverables & Source Code</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              6 files complete
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Har file production-ready hai aur spec ke rules (no hardcoded tokens, safe error handling, test mode, Hinglish bot) ko follow karti hai.
          </p>
        </div>

        <button
          onClick={downloadProjectZip}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
        >
          <FolderArchive className="w-4 h-4" />
          <span>Download All Files (.ZIP)</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: File Explorer List (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 shadow-xl">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-mono px-3 py-1">
            Required Deliverables
          </p>

          <div className="space-y-1">
            {DELIVERABLE_FILES.map((file) => {
              const isSelected = selectedFilename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFilename(file.filename)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/50 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-mono text-xs font-semibold truncate">{file.filename}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${getFileBadgeColor(file.filename)}`}>
                        {file.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {file.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Summary Card */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-2 mt-3">
            <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rules Checklist</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>✅ Tokens strictly from <code className="text-emerald-300">.env</code></li>
              <li>✅ 3-number test mode by default</li>
              <li>✅ Duplicate skip enabled in bulk sender</li>
              <li>✅ Hinglish menu (1, 2, 3, 4 + fallback)</li>
              <li>✅ Full ngrok deploy guide in Hinglish</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Code Viewer & Actions (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header of Viewer */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{selectedFile.filename}</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                — {selectedFile.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(selectedFile.filename, selectedFile.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all active:scale-95"
              >
                {copiedFile === selectedFile.filename ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadSingleFile(selectedFile.filename, selectedFile.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-all"
                title={`Download ${selectedFile.filename}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-400">
            {selectedFile.description}
          </div>

          {/* Code Viewer Body */}
          <div className="relative overflow-x-auto max-h-[580px] bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200">
            <pre className="text-[11px] text-emerald-300/90 whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
