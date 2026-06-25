import React, { useState } from "react";
import { Copy, Check, Terminal, Shield, Cpu, RefreshCw, Layers } from "lucide-react";

interface InstallationGuideProps {
  theme?: "matrix" | "classic" | "cyber" | "light";
}

export default function InstallationGuide({ theme = "cyber" }: InstallationGuideProps) {
  const [activeTab, setActiveTab] = useState<"quick" | "windows" | "unix" | "flags">("quick");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 3D Card Hover / Tilt states
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 4;  // subtle 4deg rotation on Y axis
    const rotateX = -((y - centerY) / centerY) * 4; // subtle 4deg rotation on X axis

    setRotX(rotateX);
    setRotY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "matrix":
        return {
          border: "border-emerald-500/20",
          bg: "bg-[#050c06]/60",
          textAccent: "text-emerald-400",
          tabActive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/50",
          tabInactive: "text-emerald-500/60 hover:text-emerald-300 hover:bg-emerald-500/5 border-transparent",
          codeBg: "bg-[#030604] border-emerald-500/10",
          tagBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        };
      case "classic":
        return {
          border: "border-blue-500/20",
          bg: "bg-[#050b18]/60",
          textAccent: "text-blue-400",
          tabActive: "bg-blue-500/10 text-blue-400 border-blue-500/50",
          tabInactive: "text-blue-400/60 hover:text-blue-300 hover:bg-blue-500/5 border-transparent",
          codeBg: "bg-[#020612] border-blue-500/10",
          tagBg: "bg-blue-500/10 text-blue-400 border-blue-500/20"
        };
      case "light":
        return {
          border: "border-zinc-200",
          bg: "bg-white",
          textAccent: "text-zinc-800",
          tabActive: "bg-zinc-900 text-white border-zinc-900",
          tabInactive: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border-transparent",
          codeBg: "bg-zinc-50 border-zinc-200",
          tagBg: "bg-zinc-100 text-zinc-800 border-zinc-200"
        };
      case "cyber":
      default:
        return {
          border: "border-zinc-800",
          bg: "bg-zinc-950/40",
          textAccent: "text-indigo-400",
          tabActive: "bg-indigo-500/10 text-indigo-400 border-indigo-500/40",
          tabInactive: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border-transparent",
          codeBg: "bg-black/45 border-zinc-900",
          tagBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
        };
    }
  };

  const c = getThemeClasses();

  const codeSnippets = {
    quick: `# Clone or download\ngit clone https://github.com/Zelvior/AIdex\ncd AIdex\n\n# Run the installer (handles dependencies where possible, never hard-fails)\npython install.py\n\n# Start AIdex\npython aidex.py`,
    windows: `:: Windows Installer & Boot Script\npython install.py\naidex.bat`,
    unix: `# Linux/macOS Installation\npython3 install.py\n\n# Execution (direct script or compiled launcher)\n./aidex\n# or\npython3 aidex.py`,
    flags: `# Forcing a specific TUI interface on startup\npython aidex.py --plain   # zero-dependency text UI (XP, 32-bit, minimal Python)\npython aidex.py --full    # Rich/prompt_toolkit UI (requires those packages)`
  };

  return (
    <div 
      id="installation-guide" 
      className={`p-6 sm:p-8 rounded-none border ${c.border} ${c.bg} backdrop-blur-xl space-y-6 transition-transform duration-150 ease-out cursor-default`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transformStyle: "preserve-3d"
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono py-1 px-2.5 rounded-sm uppercase border tracking-widest ${c.tagBg}`}>
              DEPLOY_LOCAL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">OFFICIAL REPO</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white uppercase">
            AIdex Installation Manual
          </h3>
          <p className="text-xs text-zinc-400">
            Follow these direct commands to deploy and run the agent locally on any machine.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <Shield size={12} className={c.textAccent} />
          <span>No root privileges required &bull; Offline safe</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900/20 pb-2">
        <button
          onClick={() => setActiveTab("quick")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all border rounded-none ${
            activeTab === "quick" ? c.tabActive : c.tabInactive
          }`}
        >
          🚀 QUICK START
        </button>
        <button
          onClick={() => setActiveTab("windows")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all border rounded-none ${
            activeTab === "windows" ? c.tabActive : c.tabInactive
          }`}
        >
          💻 WINDOWS
        </button>
        <button
          onClick={() => setActiveTab("unix")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all border rounded-none ${
            activeTab === "unix" ? c.tabActive : c.tabInactive
          }`}
        >
          🍎 LINUX / MACOS
        </button>
        <button
          onClick={() => setActiveTab("flags")}
          className={`px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all border rounded-none ${
            activeTab === "flags" ? c.tabActive : c.tabInactive
          }`}
        >
          🛠️ INTERFACE FLAGS
        </button>
      </div>

      {/* Code Area */}
      <div className="space-y-4">
        <div className="relative">
          <button
            onClick={() => copyToClipboard(codeSnippets[activeTab], activeTab)}
            className="absolute top-3 right-3 p-1.5 px-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800 transition-all flex items-center gap-1.5 z-10"
          >
            {copiedText === activeTab ? (
              <>
                <Check size={12} className="text-green-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-green-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span className="text-[10px] font-mono uppercase tracking-wider">COPY BLOCK</span>
              </>
            )}
          </button>

          <pre className={`p-5 rounded-none font-mono text-xs sm:text-sm overflow-x-auto border text-left leading-relaxed ${c.codeBg}`}>
            <code className={theme === "light" ? "text-zinc-800" : "text-zinc-200"}>
              {codeSnippets[activeTab]}
            </code>
          </pre>
        </div>

        {/* Dynamic Context Description Helper */}
        <div className="p-4 bg-black/20 rounded-none border border-zinc-900/30 font-mono text-[11px] leading-relaxed text-zinc-400 space-y-1">
          {activeTab === "quick" && (
            <>
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase mb-1">
                <Terminal size={12} className={c.textAccent} />
                <span>Primary local workflow</span>
              </div>
              <p>Clones the original repository created by <span className="text-zinc-200 font-semibold">Zelvior</span> and invokes the smart Python installer which checks dependencies, downloads optional prompt_toolkit packages, and boots up instantly.</p>
            </>
          )}
          {activeTab === "windows" && (
            <>
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase mb-1">
                <Cpu size={12} className={c.textAccent} />
                <span>Legacy & Modern Windows Support</span>
              </div>
              <p>Works flawlessly across Windows versions including Windows XP, Vista, 7, 8, 10, and 11. The batch script automatically selects the correct active Python executable environment.</p>
            </>
          )}
          {activeTab === "unix" && (
            <>
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase mb-1">
                <RefreshCw size={12} className={c.textAccent} />
                <span>Linux, BSD, & macOS Support</span>
              </div>
              <p>Ensures shell permission safety. The installer automatically checks whether the rich dependency packages build successfully on macOS (Apple Silicon or Intel) or Raspberry Pi Linux.</p>
            </>
          )}
          {activeTab === "flags" && (
            <>
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase mb-1">
                <Layers size={12} className={c.textAccent} />
                <span>Zero-Dependency Failback Engine</span>
              </div>
              <p>Use <code className="text-zinc-300 font-bold">--plain</code> to bypass missing dependencies on extremely low-resource environments (such as vintage 32-bit boxes or minimalist Python 2.7 nodes) to enjoy identical coding capabilities.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
