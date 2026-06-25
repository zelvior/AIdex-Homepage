import React, { useState } from "react";
import Terminal from "./components/Terminal";
import InstallationGuide from "./components/InstallationGuide";
import ParticleCanvas from "./components/ParticleCanvas";
import { 
  Cpu, 
  Zap, 
  Workflow, 
  Layers, 
  Activity, 
  Globe, 
  Laptop,
  CheckCircle2,
  Terminal as TerminalIcon,
  Maximize2,
  Sliders,
  Github,
  ShieldCheck,
  ZapOff
} from "lucide-react";

export default function App() {
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [theme, setTheme] = useState<"cyber" | "matrix" | "classic" | "light">("cyber");

  // Interactive 3D Card Hover / Tilt states
  const [cardRotX, setCardRotX] = useState(0);
  const [cardRotY, setCardRotY] = useState(0);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within element
    const y = e.clientY - rect.top;  // y coordinate within element

    // Calculate rotation angles based on mouse position relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12;  // max 12deg rotation on Y axis
    const rotateX = -((y - centerY) / centerY) * 12; // max 12deg rotation on X axis

    setCardRotX(rotateX);
    setCardRotY(rotateY);
  };

  const handleCardMouseLeave = () => {
    setCardRotX(0);
    setCardRotY(0);
  };

  // Callback to fire the interactive feedback trigger
  const triggerPulse = () => {
    setPulseTrigger((prev) => prev + 1);
  };

  const handleThemeChange = (newTheme: "cyber" | "matrix" | "classic" | "light") => {
    setTheme(newTheme);
    triggerPulse();
  };

  // Helper values to style the UI depending on active theme
  const getThemeClasses = () => {
    switch (theme) {
      case "matrix":
        return {
          bg: "bg-[#030704] text-emerald-100",
          accentText: "text-emerald-400",
          accentBg: "bg-emerald-500/10 border-emerald-500/20",
          accentHover: "hover:border-emerald-500/60",
          btnPrimary: "bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/10",
          cardBorder: "border-emerald-500/20",
          glowText: "glow-text-green",
          badgeColor: "bg-emerald-400/10 text-emerald-400 border-emerald-500/20",
          gradientText: "bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-600 bg-clip-text text-transparent",
          textStrokeClass: "text-stroke-green",
          brandColor: "text-emerald-500",
          gridPattern: "bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)]",
          glows: (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-green-500/3 blur-[120px] pointer-events-none z-0" />
            </>
          )
        };
      case "classic":
        return {
          bg: "bg-[#030914] text-blue-100",
          accentText: "text-blue-400",
          accentBg: "bg-blue-500/10 border-blue-500/20",
          accentHover: "hover:border-blue-500/60",
          btnPrimary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10",
          cardBorder: "border-blue-500/20",
          glowText: "glow-text-blue",
          badgeColor: "bg-blue-400/10 text-blue-400 border-blue-500/20",
          gradientText: "bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent",
          textStrokeClass: "text-stroke-cyan",
          brandColor: "text-blue-500",
          gridPattern: "bg-[linear-gradient(to_right,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)]",
          glows: (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/3 blur-[120px] pointer-events-none z-0" />
            </>
          )
        };
      case "light":
        return {
          bg: "bg-zinc-50 text-zinc-800",
          accentText: "text-zinc-600",
          accentBg: "bg-zinc-100 border-zinc-200",
          accentHover: "hover:border-zinc-400",
          btnPrimary: "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md",
          cardBorder: "border-zinc-200",
          glowText: "",
          badgeColor: "bg-zinc-50 text-zinc-700 border-zinc-200",
          gradientText: "bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-900 bg-clip-text text-transparent",
          textStrokeClass: "text-stroke-white",
          brandColor: "text-zinc-800",
          gridPattern: "bg-[linear-gradient(to_right,rgba(9,9,11,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.03)_1px,transparent_1px)]",
          glows: (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-zinc-200/50 blur-[100px] pointer-events-none z-0" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-100/30 blur-[100px] pointer-events-none z-0" />
            </>
          )
        };
      case "cyber":
      default:
        return {
          bg: "bg-[#050505] text-zinc-100", // Sleek editorial dark pitch black
          accentText: "text-indigo-400",
          accentBg: "bg-indigo-500/10 border-indigo-500/20",
          accentHover: "hover:border-indigo-500/40",
          btnPrimary: "bg-indigo-600 hover:bg-indigo-500 text-zinc-100 shadow-xl shadow-indigo-600/10",
          cardBorder: "border-zinc-800",
          glowText: "glow-text-cyan",
          badgeColor: "bg-indigo-400/10 text-indigo-400 border-indigo-500/20",
          gradientText: "bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent",
          textStrokeClass: "text-stroke-white",
          brandColor: "text-indigo-500",
          gridPattern: "bg-[linear-gradient(to_right,rgba(129,140,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(129,140,248,0.02)_1px,transparent_1px)]",
          glows: (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/3 blur-[120px] pointer-events-none z-0" />
            </>
          )
        };
    }
  };

  const c = getThemeClasses();

  return (
    <div className={`min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 ${c.bg}`}>
      
      {/* 3D Mathematical Particle Canvas */}
      <ParticleCanvas pulseTrigger={pulseTrigger} theme={theme} />

      {/* Dynamic Ambient Background Glows */}
      {c.glows}

      {/* Grid pattern overlay (faint background layout texture) */}
      <div className={`absolute inset-0 ${c.gridPattern} bg-[size:60px_60px] pointer-events-none z-0`} />

      {/* 2. Editorial Top Header Navigation */}
      <header className={`relative z-30 border-b ${theme === "light" ? "border-zinc-200/80 bg-white/70 text-zinc-800" : "border-zinc-900 bg-zinc-950/40"} backdrop-blur-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
          
          {/* Logo with Editorial Italic styling */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter italic text-white uppercase select-none">
              AIDEX<span className={c.brandColor}>_</span>
            </span>
            <span className={`text-[9px] font-mono tracking-[0.25em] py-1 px-2.5 rounded-sm bg-white/5 uppercase border border-white/10 hidden md:inline-block ${c.accentText}`}>
              ENGINE_v2.4
            </span>
          </div>

          {/* Links: Editorial spacing and uppercase */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 font-mono">
            <a href="https://github.com/zelvior/AIdex" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Github size={13} className="text-white" />
              <span>GitHub Code</span>
            </a>
            <a href="#bento-features" className="hover:text-white transition-colors">Specifications</a>
            <a href="#cli-interactive-terminal" className="hover:text-white transition-colors">TUI Terminal</a>
            <span className={c.accentText}>v2.4.0</span>
          </div>

          {/* Theme Dropdown Selector */}
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline select-none">
              AESTHETIC:
            </label>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value as any)}
              className={`font-mono text-xs p-1.5 px-3 rounded-none border outline-none cursor-pointer transition-all ${theme === "light" ? "border-zinc-300 text-zinc-800 bg-white" : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700"}`}
              id="theme-select-dropdown"
            >
              <option value="cyber">EDITORIAL BLACK</option>
              <option value="matrix">THE MATRIX</option>
              <option value="classic">STELLAR BLUE</option>
              <option value="light">SLATE MINIMAL</option>
            </select>
          </div>

        </div>
      </header>

      {/* 3. Main Landing Layout */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-12 md:py-20 space-y-28">
        
        {/* Hero & Interactive CLI split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left Block: Editorial Narrative */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="mb-4 flex items-center gap-2">
              <span className="px-3 py-1.5 border border-zinc-700 rounded-full text-[10px] uppercase tracking-widest text-zinc-400 font-bold bg-transparent select-none">
                Original Creator: Zelvior
              </span>
              <a 
                href="https://github.com/zelvior/AIdex" 
                target="_blank" 
                rel="noreferrer" 
                className="p-1 px-2.5 rounded-full border border-indigo-500/30 text-[10px] uppercase tracking-widest text-indigo-400 font-bold bg-indigo-950/20 hover:bg-indigo-950/50 transition-all select-none"
              >
                GitHub ⭐
              </a>
            </div>

            {/* Editorial styled oversized typography with text-stroke support */}
            <h1 className="text-[54px] sm:text-[76px] lg:text-[100px] leading-[0.85] font-black tracking-tighter text-white uppercase">
              COMMAND<br/>
              <span className={`text-stroke-white border-t-2 border-zinc-800 pt-5 mt-3 block overflow-visible ${c.textStrokeClass}`}>THE FUTURE</span>
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-md ${theme === "light" ? "text-zinc-600" : "text-zinc-400"}`}>
              AIdex is a fully-featured, professional CLI AI coding agent running in your terminal. Connect to OpenRouter, Groq, OpenAI, Anthropic, or fully local Ollama. Build, edit, and search code natively on any platform.
            </p>

            {/* Actions: Sharp non-rounded Editorial Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#installation-guide"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-center px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-none select-none"
                id="btn-editorial-pulse"
              >
                ⚡ DEPLOY LOCALLY
              </a>
              <a
                href="https://github.com/zelvior/AIdex"
                target="_blank"
                rel="noreferrer"
                className="border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-center px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-none select-none"
              >
                Get Original Source
              </a>
            </div>
          </div>

          {/* Right Block: Live Interactive CLI */}
          <div id="cli-interactive-terminal" className="lg:col-span-7">
            <div className="relative">
              {/* Abstract glowing circles in the background */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0" />
              
              {/* Terminal Window Wrapper with Interactive 3D Perspective Tilt */}
              <div 
                className="relative z-10 transition-transform duration-150 ease-out cursor-default"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${cardRotX}deg) rotateY(${cardRotY}deg)`,
                  transformStyle: "preserve-3d"
                }}
              >
                <Terminal 
                  onCommandPulse={triggerPulse}
                  onThemeChange={handleThemeChange}
                  currentTheme={theme}
                />
              </div>
            </div>
          </div>

        </div>

        {/* 3.5. Interactive Installation Guide */}
        <section className="relative z-10">
          <InstallationGuide theme={theme} />
        </section>

        {/* 4. Editorial Global Stats section */}
        <section className="z-10 border-t border-zinc-900 bg-zinc-950/50 rounded-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Universal Compatibility</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light tracking-tight text-white">Win XP &rarr; Win 11</span>
                <span className="text-green-500 text-[10px] font-bold uppercase tracking-tighter">Linux / macOS</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-12">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Model Providers</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light tracking-tight text-indigo-400">5 Platforms</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">100+ MODELS</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-12">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Offline Capacity</span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] text-zinc-400 font-mono font-semibold">
                  <span>OLLAMA LOCAL CORE</span>
                  <span className="text-indigo-400">100% OFFLINE</span>
                </div>
                <div className="h-2 bg-zinc-900 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-full animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Minimal Features Grid */}
        <section id="bento-features" className="space-y-12 scroll-mt-24 pt-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl tracking-tight text-white uppercase">
              Sleek, Secure, Sovereign.
            </h2>
            <p className={`text-sm leading-relaxed ${theme === "light" ? "text-zinc-600" : "text-zinc-400"}`}>
              AIdex delivers high-performance autonomous terminal capabilities. Fully offline-friendly with zero local telemetry or forced external connections. Just professional, raw terminal power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature Card 1: Multi-Provider Support */}
            <div className={`p-8 rounded-none bg-black/30 backdrop-blur-xl border ${c.cardBorder} transition-all duration-300 hover:border-indigo-500/40 space-y-5`}>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Workflow className="text-indigo-400" size={20} />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Multi-Provider AI Hub</h3>
              <p className={`text-xs leading-relaxed ${theme === "light" ? "text-zinc-600" : "text-zinc-400"}`}>
                Connect seamlessly to OpenRouter, Groq, Anthropic, OpenAI, or run fully offline using local Ollama. No credit cards or keys are strictly required to start coding.
              </p>
            </div>

            {/* Feature Card 2: Smart File Edits */}
            <div className={`p-8 rounded-none bg-black/30 backdrop-blur-xl border ${c.cardBorder} transition-all duration-300 hover:border-indigo-500/40 space-y-5`}>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Zap className="text-purple-400" size={20} />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Pristine Local Edits</h3>
              <p className={`text-xs leading-relaxed ${theme === "light" ? "text-zinc-600" : "text-zinc-400"}`}>
                Performs precision file modifications. Uses intelligent `str_replace`-style substitutions with live side-by-side terminal diff previews to keep your target codebase immaculate.
              </p>
            </div>

            {/* Feature Card 3: Universal Portability */}
            <div className={`p-8 rounded-none bg-black/30 backdrop-blur-xl border ${c.cardBorder} transition-all duration-300 hover:border-indigo-500/40 space-y-5`}>
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Laptop className="text-pink-400" size={20} />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Universal Portability</h3>
              <p className={`text-xs leading-relaxed ${theme === "light" ? "text-zinc-600" : "text-zinc-400"}`}>
                Built to run anywhere. Operates beautifully on modern Apple Silicon down to vintage 32-bit Windows XP environments, with smart fallbacks for scarce memory.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 5. Editorial Footer */}
      <footer className={`relative z-20 border-t ${theme === "light" ? "border-zinc-200 bg-white text-zinc-600" : "border-zinc-900 bg-zinc-950/60 text-zinc-400"} backdrop-blur-md transition-colors duration-300 mt-20`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <TerminalIcon size={14} className="text-indigo-400" />
            </div>
            <span className="font-display font-bold text-sm text-white">AIdex Developer CLI Suite</span>
          </div>
          <div className="font-mono text-[11px]">
            Originally created by <a href="https://github.com/zelvior" target="_blank" rel="noreferrer" className="underline hover:text-indigo-400">Zelvior</a> &bull; Licensed & Available at <a href="https://github.com/zelvior/AIdex" target="_blank" rel="noreferrer" className="underline hover:text-indigo-400">https://github.com/zelvior/AIdex</a>.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-500">
            <a href="https://github.com/zelvior/AIdex" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">GitHub Repository</a>
            <span>&bull;</span>
            <a href="https://github.com/zelvior/AIdex/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">License</a>
            <span>&bull;</span>
            <span className="text-indigo-400 font-bold">v2.4.0-stable</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
