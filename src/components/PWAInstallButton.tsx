import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Check, X } from 'lucide-react';

interface PWAInstallButtonProps {
  onOpenAndroidGuide?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenAndroidGuide }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside installed standalone PWA, show an installed badge
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed on Mobile</span>
        <span className="sm:hidden">Installed</span>
      </div>
    );
  }

  // Chromium / Android Flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        title="Install Anvexaa AI App on Android / Desktop"
      >
        <Smartphone className="w-3.5 h-3.5 fill-current" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add to Phone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Install on iPhone / iPad</span>
                </h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>1. Safari mein bottom bar mein <strong>Share icon</strong> (box with arrow up) dabayein.</p>
                <p>2. Scroll down karke <strong>Add to Home Screen</strong> select karein.</p>
                <p>3. Top-right mein <strong>Add</strong> dabayein. App aapke home screen par icon ke sath aa jayegi!</p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Theek Hai, Samjh Gaya
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button to open Android app guide
  return (
    <button
      onClick={onOpenAndroidGuide}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:border-emerald-500/40"
      title="Android phone par chalane ke nirdesh aur APK/Termux setup"
    >
      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
      <span className="hidden sm:inline">📱 Android App</span>
      <span className="sm:hidden">App</span>
    </button>
  );
};
