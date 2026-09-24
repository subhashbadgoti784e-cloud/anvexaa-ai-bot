import React, { useState } from 'react';
import { Github, Copy, Check, ExternalLink, Terminal, ArrowRight, X, ShieldCheck, UploadCloud } from 'lucide-react';

interface GitHubUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubUploadModal: React.FC<GitHubUploadModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const cleanUrl = repoUrl.trim();
  const effectiveUrl = cleanUrl || 'https://github.com/<your-username>/anvexaa-ai-bot.git';

  const step1 = `git init`;
  const step2 = `git add .`;
  const step3 = `git commit -m "Anvexaa AI WhatsApp Auto-Bot and Bulk Sender"`;
  const step4 = `git branch -M main`;
  const step5 = `git remote add origin ${effectiveUrl}`;
  const step6 = `git push -u origin main`;

  const fullOneLiner = `git init && git add . && git commit -m "Anvexaa AI WhatsApp Auto-Bot" && git branch -M main && git remote add origin ${effectiveUrl} && git push -u origin main`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center">
            <Github className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Upload All Data to GitHub</h3>
            <p className="text-xs text-slate-400">Apne project ke saare files aur codes ko GitHub repo par push karein</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 text-xs">
          {/* Step A: Create Repo */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">Step 1: GitHub par New Repository Banayein</span>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-teal-300 hover:underline flex items-center gap-1"
              >
                <span>github.com/new</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              1. <strong>github.com/new</strong> par jayein.<br />
              2. Repository name likhein: <code className="text-teal-300">anvexaa-ai-bot</code><br />
              3. <strong>"Create repository"</strong> green button par click karein.
            </p>
          </div>

          {/* Step B: Paste Remote URL */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">
              Step 2: Apni GitHub Repo ka URL daalein (Optional):
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/subhashbadgoti/anvexaa-ai-bot.git"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Step C: Commands Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Step 3: Ye Commands Terminal / Termux mein Run Karein</span>
              </span>
              <button
                onClick={() => copyToClipboard(fullOneLiner, 'full')}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/40 font-semibold transition-all"
              >
                {copiedKey === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'full' ? 'Copied 1-Liner!' : 'Copy 1-Liner Command'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
              <p className="text-slate-500"># 1. Sabhi files commit ho chuki hain</p>
              <p className="text-teal-300">git remote add origin {effectiveUrl}</p>
              <p className="text-teal-300">git branch -M main</p>
              <p className="text-emerald-400 font-bold">git push -u origin main</p>
            </div>
          </div>

          {/* Security Note */}
          <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>
              <strong>Security Guaranteed:</strong> <code className="text-white">.gitignore</code> file already active hai, isliye aapke WhatsApp tokens ya private secrets GitHub par kabhi public nahi honge!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2">
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
