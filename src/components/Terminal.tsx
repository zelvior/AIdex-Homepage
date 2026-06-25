import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Copy, Check, Cpu, Send, RefreshCw, Code2 } from "lucide-react";

interface TerminalProps {
  onCommandPulse: () => void;
  onThemeChange: (theme: "matrix" | "classic" | "cyber" | "light") => void;
  currentTheme: "matrix" | "classic" | "cyber" | "light";
}

interface TerminalHistoryEntry {
  type: "input" | "output" | "system" | "error";
  text: string;
  command?: string;
  timestamp: string;
}

export default function Terminal({ onCommandPulse, onThemeChange, currentTheme }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([
    {
      type: "system",
      text: "Initializing AIdex TUI Daemon v2.4.0...",
      timestamp: "22:00:13",
    },
    {
      type: "system",
      text: "✔ Originally developed by Zelvior. Source: https://github.com/zelvior/AIdex",
      timestamp: "22:00:13",
    },
    {
      type: "system",
      text: "✔ Multi-provider engine configured (Ollama Offline, Groq, OpenRouter, Anthropic, OpenAI).",
      timestamp: "22:00:14",
    },
    {
      type: "system",
      text: "✔ Interactive 3D visual particle matrix initialized successfully.",
      timestamp: "22:00:14",
    },
    {
      type: "system",
      text: "Enter a command (e.g. 'help', 'aidex doctor') or type a prompt for automated file edits.",
      timestamp: "22:00:14",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const executeCommand = async (commandText: string) => {
    if (!commandText.trim()) return;

    const trimmed = commandText.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Append user input to history
    setHistory((prev) => [
      ...prev,
      {
        type: "input",
        text: trimmed,
        timestamp,
      },
    ]);

    setIsLoading(true);
    setInput("");
    
    // Trigger visual pulse wave in the 3D particles canvas!
    onCommandPulse();

    try {
      // Local theme configuration shortcut
      if (trimmed.toLowerCase().startsWith("theme ")) {
        const t = trimmed.split(" ")[1]?.toLowerCase();
        if (t === "matrix" || t === "classic" || t === "cyber" || t === "light") {
          onThemeChange(t as any);
          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              text: `✔ Visual theme updated successfully. System synchronized to: ${t.toUpperCase()}`,
              timestamp,
            },
          ]);
          setIsLoading(false);
          return;
        }
      }

      // Special local clear command
      if (trimmed.toLowerCase() === "clear") {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      // Send to full-stack backend
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Edge proxy network failure.");
      }

      const data = await response.json();
      
      // Simulate real CLI processing latency
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            text: data.output,
            timestamp,
          },
        ]);
        setIsLoading(false);
        // Secondary pulse when output arrives for double-feedback tactile feel
        onCommandPulse();
      }, 750);

    } catch (error: any) {
      setHistory((prev) => [
        ...prev,
        {
          type: "error",
          text: `⚠ Error executing command: ${error.message || "Failed to contact autonomous daemon."}\nEnsure server-side routes are fully active.`,
          timestamp,
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handlePresetClick = (preset: string) => {
    executeCommand(preset);
  };

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("git clone https://github.com/zelvior/AIdex.git");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeTextClass = () => {
    switch (currentTheme) {
      case "matrix":
        return "text-green-400";
      case "classic":
        return "text-blue-400";
      case "light":
        return "text-slate-900";
      case "cyber":
      default:
        return "text-cyan-400";
    }
  };

  const getThemeBorderClass = () => {
    switch (currentTheme) {
      case "matrix":
        return "border-green-500/30";
      case "classic":
        return "border-blue-500/30";
      case "light":
        return "border-slate-300";
      case "cyber":
      default:
        return "border-purple-500/30";
    }
  };

  const presets = [
    { label: "aidex status", cmd: "aidex status", desc: "Check Active Providers" },
    { label: "aidex doctor", cmd: "aidex doctor", desc: "System Diagnostic" },
    { label: "aidex init", cmd: "aidex init", desc: "Initialize Workspace" },
    { label: "sysinfo", cmd: "sysinfo", desc: "Platform Specs" },
    { label: "help", cmd: "help", desc: "Interactive Manual" },
  ];

  return (
    <div id="aidex-terminal-wrapper" className="w-full flex flex-col gap-4">
      {/* Installation bar */}
      <div className={`flex items-center justify-between p-3 px-4 rounded-xl bg-black/40 backdrop-blur-xl border ${getThemeBorderClass()} transition-all duration-300`}>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="text-purple-400">➜</span>
          <span>git clone https://github.com/zelvior/AIdex.git</span>
        </div>
        <button
          onClick={copyInstallCommand}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-1.5 px-3 rounded-lg border border-white/10"
          id="btn-copy-install"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[10px]">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span className="font-mono text-[10px]">COPY CLONE URI</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Window */}
      <div 
        id="cli-terminal-window"
        className={`relative flex flex-col h-[460px] md:h-[500px] w-full rounded-2xl bg-black/75 backdrop-blur-2xl border ${getThemeBorderClass()} shadow-2xl transition-all duration-500 overflow-hidden glow-box-${currentTheme === "matrix" ? "green" : currentTheme === "classic" ? "blue" : "purple"}`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <TerminalIcon size={12} className={getThemeTextClass()} />
            <span>faizudemon@aidex:~</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-mono font-medium tracking-wide border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE AGENT</span>
          </div>
        </div>

        {/* Scanline overlay for retro CRT monitor feel */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-linear-to-b from-transparent to-black/5 opacity-40"></div>
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

        {/* Console logs area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 font-mono text-xs md:text-[13px] leading-relaxed text-slate-300 space-y-4 terminal-scrollbar">
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-1">
              {entry.type === "input" && (
                <div className="flex items-start gap-2 text-white">
                  <span className="text-purple-400 select-none">faizudemon@aidex:~$</span>
                  <span className="font-semibold">{entry.text}</span>
                  <span className="ml-auto text-[10px] text-slate-500 select-none">{entry.timestamp}</span>
                </div>
              )}
              
              {entry.type === "system" && (
                <div className="text-slate-400 italic bg-white/5 border-l-2 border-slate-500/50 py-1.5 px-2.5 rounded-r">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider font-semibold">
                    <Cpu size={10} />
                    <span>System Daemon</span>
                  </div>
                  <div>{entry.text}</div>
                </div>
              )}

              {entry.type === "output" && (
                <div className="text-slate-100 whitespace-pre-wrap bg-white/5/20 rounded-xl p-3 border border-white/5 leading-relaxed font-mono font-normal">
                  <div className="flex items-center gap-1 text-[10px] text-purple-400/80 mb-2 uppercase tracking-wider font-semibold border-b border-white/5 pb-1 select-none">
                    <Code2 size={10} />
                    <span>AIdex Response Payload</span>
                  </div>
                  {entry.text}
                </div>
              )}

              {entry.type === "error" && (
                <div className="text-rose-400 whitespace-pre-wrap bg-rose-950/20 border-l-2 border-rose-500 py-2 px-3 rounded-r font-mono">
                  {entry.text}
                </div>
              )}
            </div>
          ))}

          {/* Loader */}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 select-none">
              <span className="text-purple-400">faizudemon@aidex:~$</span>
              <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 px-3 animate-pulse">
                <RefreshCw size={13} className="animate-spin text-purple-400" />
                <span className="text-xs">AIdex is processing query...</span>
              </div>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Console Input area */}
        <form 
          onSubmit={handleFormSubmit}
          className="flex items-center gap-2 p-3 bg-black/40 border-t border-white/10 z-20"
        >
          <span className="text-purple-400 font-mono text-xs select-none pl-1">faizudemon@aidex:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type 'aidex status', 'help' or any custom code prompt..."
            className="flex-1 bg-transparent border-0 outline-hidden ring-0 text-white font-mono text-xs md:text-[13px] placeholder-slate-500 disabled:opacity-50"
            id="terminal-cli-input"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-30 disabled:hover:bg-purple-600 text-white font-mono text-xs flex items-center gap-1 transition-all"
            id="btn-cli-submit"
          >
            <span className="hidden sm:inline">RUN</span>
            <Send size={11} />
          </button>
        </form>
      </div>

      {/* Preset / Quick Commands Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 select-none font-mono">
            ⚡ Quick Command Presets (Click to Auto-Run & Spark 3D Waves)
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Supports Tab-completion</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.cmd}
              onClick={() => handlePresetClick(preset.cmd)}
              disabled={isLoading}
              className={`flex flex-col items-start p-2.5 rounded-xl border border-white/5 bg-black/30 hover:bg-white/5 hover:border-purple-500/40 text-left transition-all duration-200 group disabled:opacity-50`}
            >
              <code className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors font-mono">
                {preset.label}
              </code>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 leading-tight select-none">
                {preset.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
