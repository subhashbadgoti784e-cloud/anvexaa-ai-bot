import React, { useState } from 'react';
import { Smartphone, Download, Terminal, CheckCircle2, Play, Sparkles, X, Copy, Check, ExternalLink } from 'lucide-react';
import { downloadSingleFile, downloadProjectZip } from '../utils/zipDownloader';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidRunnerModal: React.FC<AndroidRunnerModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const termuxCommand = `pkg update && pkg install python git -y && pip install fastapi uvicorn requests python-dotenv && python main.py`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 text-white my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Anvexaa AI Android Mobile Setup</h3>
            <p className="text-xs text-slate-400">Android phone mein direct download aur run karne ke 2 aasan tareeqe</p>
          </div>
        </div>

        {/* Method 1: Install as Native Android App (PWA) */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-xs text-emerald-300">Method 1: Direct Android App Install (WebAPK)</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
              Sabse Aasan (No PC)
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Aap is dashboard ko direct apne Android phone par <strong>Native App</strong> ki tarah install kar sakte hain. Ye bina Chrome URL bar ke full-screen chalegi aur home screen par Anvexaa AI ka official icon ban jayega!
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {isInstallable ? (
              <button
                onClick={install}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-4 h-4 fill-current" />
                <span>Install on Android Phone Now</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex-1">
                📱 Android Chrome browser mein top-right <strong>3 dots (⋮)</strong> par click karein aur <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> select karein.
              </div>
            )}
          </div>
        </div>

        {/* Method 2: Termux Python Runner on Android */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-xs text-teal-300">Method 2: Android Termux Python Bot Runner</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium font-mono">
              Termux Script
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Agar aap Python bot (`main.py` aur `bulk.py`) direct apne Android phone ke andar chalana chahte hain:
          </p>

          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Google Play Store ya F-Droid se <strong className="text-white">Termux</strong> app install karein.</li>
            <li>Neeche diya gaya command Termux mein paste karke Enter dabayein:</li>
          </ol>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-400">
            <span className="truncate max-w-[340px]">{termuxCommand}</span>
            <button
              onClick={() => copyCommand(termuxCommand, 'termux')}
              className="text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded text-[11px] shrink-0 ml-2"
            >
              {copiedCmd === 'termux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                downloadSingleFile('anvexaa_termux.sh', `#!/data/data/com.termux/files/usr/bin/bash\npkg update -y && pkg install python -y\npip install fastapi uvicorn requests python-dotenv\npython main.py`, 'application/x-sh');
              }}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download anvexaa_termux.sh</span>
            </button>

            <button
              onClick={downloadProjectZip}
              className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/40 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All ZIP</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
