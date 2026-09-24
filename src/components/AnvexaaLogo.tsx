import React from 'react';
import { Bot, Cpu, MessageSquare, Video, Cog } from 'lucide-react';

interface AnvexaaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'avatar';
  showSubtitle?: boolean;
  showServices?: boolean;
  className?: string;
}

export const AnvexaaLogoGlyph: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/40 via-cyan-400/30 to-purple-600/40 blur-md pointer-events-none transform -scale-95" 
      />

      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main 3D Gradient Cyan to Purple */}
          <linearGradient id="anvexaa-main-grad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="85%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          {/* Slicing Wing Accent Gradient */}
          <linearGradient id="anvexaa-wing-grad" x1="160" y1="60" x2="60" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Highlights & Specular */}
          <linearGradient id="anvexaa-light-edge" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#7DD3FC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </linearGradient>

          {/* Inner Shadow / 3D Bevel */}
          <filter id="anvexaa-bevel" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Futuristic 3D "A" Geometry */}
        {/* Left upright leg & apex */}
        <path
          d="M 100 24 
             C 106 24, 112 28, 116 34
             L 174 136
             C 178 143, 175 152, 168 156
             L 142 170
             C 136 174, 128 172, 124 165
             L 100 120
             L 74 165
             C 70 172, 62 174, 56 170
             L 30 156
             C 23 152, 20 143, 24 136
             L 84 34
             C 88 28, 94 24, 100 24 Z"
          fill="url(#anvexaa-main-grad)"
          filter="url(#anvexaa-bevel)"
        />

        {/* Sharp Dynamic Cross Wing Slash */}
        <path
          d="M 52 118
             L 168 76
             C 176 73, 184 79, 182 87
             L 146 142
             C 142 148, 134 150, 128 146
             L 52 118 Z"
          fill="url(#anvexaa-wing-grad)"
          opacity="0.95"
        />

        {/* Negative space core triangle */}
        <polygon 
          points="100,58 128,108 72,108" 
          fill="#020617" 
          opacity="0.95"
        />

        {/* Gloss highlight edge */}
        <path
          d="M 98 26 L 86 36 L 28 136"
          stroke="url(#anvexaa-light-edge)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Bottom bright flare center */}
        <circle cx="100" cy="180" r="1.5" fill="#67E8F9" filter="drop-shadow(0 0 6px #38BDF8)" />
      </svg>
    </div>
  );
};

export const AnvexaaLogo: React.FC<AnvexaaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showServices = false,
  className = ''
}) => {
  if (size === 'avatar') {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-slate-950 border border-cyan-500/30 p-1 shadow-lg shadow-cyan-500/20 ${className}`}>
        <AnvexaaLogoGlyph size={36} />
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="relative flex items-center justify-center rounded-lg bg-slate-950 border border-cyan-500/40 p-0.5 shadow-md shadow-cyan-500/25">
          <AnvexaaLogoGlyph size={28} />
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-center text-sm font-black tracking-[0.2em] font-sans">
            <span className="text-white">ANVE</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent px-0.5 font-extrabold">X</span>
            <span className="text-white">AA</span>
          </div>
          {showSubtitle && (
            <span className="text-[8px] tracking-[0.15em] text-cyan-400/90 uppercase font-semibold mt-0.5">
              AI Solutions
            </span>
          )}
        </div>
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative flex items-center justify-center rounded-xl bg-slate-950 border border-cyan-500/40 p-1 shadow-lg shadow-cyan-500/25 ring-1 ring-white/10">
          <AnvexaaLogoGlyph size={38} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-base sm:text-lg font-black tracking-[0.25em] font-sans">
            <span className="text-white">ANVE</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent px-0.5 font-extrabold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">X</span>
            <span className="text-white">AA</span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-[1px] w-3 bg-gradient-to-r from-transparent to-cyan-400/60" />
              <span className="text-[9px] tracking-[0.2em] text-cyan-300 font-semibold uppercase">
                AI Solutions for the Future
              </span>
              <span className="h-[1px] w-3 bg-gradient-to-l from-transparent to-cyan-400/60" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hero / Card Showcase Mode (matches exact user uploaded branding banner)
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-cyan-500/30 p-6 sm:p-8 text-center shadow-2xl shadow-cyan-500/10 ${className}`}>
      {/* Top blue/purple ambient lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-cyan-500/25 to-purple-600/15 blur-3xl pointer-events-none rounded-full" />
      
      {/* Large 3D Glyph */}
      <div className="flex justify-center mb-4">
        <div className="relative p-2 rounded-2xl bg-slate-950/80 border border-cyan-400/30 shadow-2xl shadow-cyan-500/30 ring-1 ring-cyan-400/20">
          <AnvexaaLogoGlyph size={96} />
        </div>
      </div>

      {/* Main Brand Name */}
      <div className="flex items-center justify-center text-3xl sm:text-4xl font-black tracking-[0.3em] font-sans">
        <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">ANVE</span>
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent px-1 font-extrabold drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">X</span>
        <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">AA</span>
      </div>

      {/* Subtitle with divider lines */}
      <div className="flex items-center justify-center gap-3 mt-2 max-w-md mx-auto">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-400" />
        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase whitespace-nowrap">
          AI Solutions For The Future
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-purple-500/50 to-purple-400" />
      </div>

      {/* 5 Service Badges from official Logo */}
      {showServices && (
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-1.5">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">AI Agents</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-1.5">
              <Cog className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">Automation</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/40 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-1.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">AI Chatbots</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-1.5">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">AI Video</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-pink-500/20 hover:border-pink-500/40 transition-all group col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform mb-1.5">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">Custom AI</span>
          </div>
        </div>
      )}
    </div>
  );
};
