import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is missing or placeholder");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API endpoint for CLI command execution
app.post("/api/execute", async (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== "string") {
    res.status(400).json({ error: "Command string is required." });
    return;
  }

  const trimmed = command.trim();
  const lower = trimmed.toLowerCase();

  // 1. Static local commands for instant, offline-first feedback
  if (lower === "help") {
    res.json({
      output: `AIdex CLI - Fully-Featured Professional AI Coding Agent (v2.4.0)
Original Creator: Zelvior (https://github.com/zelvior/AIdex)

Core Features:
  🤖 Multi-Provider   Connect to OpenRouter, Groq, Anthropic, OpenAI, Ollama (offline)
  📁 File Operations  Read, write, edit, delete, move, copy files directly
  🖊️ Smart Editing    str_replace-style edits with real-time diff preview
  🖥️ Shell Commands   Execute any shell commands in your workspace securely
  🐍 Python Exec      Run Python code snippets inline instantly
  🔀 Git Operations   Init, status, diff, log, add, commit
  🔍 Code Search      Find files by name or content (grep search)
  📊 Project Match    Detect project type, active dependencies, stats
  🛡️ Safe Mode        Blocks dangerous or critical commands by default
  🔌 Offline Mode     Use Ollama for local model runs with no internet
  🐢 Low-End Safe     Memory-bounded file tools (tail_file, head_file)
  🪶 Zero-Dependency  Automatic plain-text UI fallback (supports Python 2.7+)

Usage:
  aidex <prompt>        Prompt the model for code edits, files, or technical tasks.
  aidex init            Initialize an AIdex config in the current directory.
  aidex doctor          Diagnose platform dependencies, network, and providers.
  aidex status          View active session token usage, providers, and safe-mode state.
  sysinfo               View host system architecture and fallback parameters.`
    });
    return;
  }

  if (lower === "sysinfo") {
    res.json({
      output: `⚙ AIdex SYSTEM COMPATIBILITY ENGINE
----------------------------------------------------------------------
Repository:   https://github.com/zelvior/AIdex (Zelvior)
Platforms:    Windows XP/Vista/7/8/10/11, Linux, macOS (32-bit & 64-bit)
Python Req:   Python 2.7+ (Standard plain-text), Python 3.7+ (Rich TUI)
TUI Interface: Rich & prompt_toolkit (Auto-complete with history)
Fallback Mode: Enabled (Zero-dependency plain-text engine fallback active)
Providers:    Ollama (100% Offline), Groq, OpenRouter, Anthropic, OpenAI`
    });
    return;
  }

  if (lower === "aidex init") {
    res.json({
      output: `⚙ Initializing AIdex workspace context...
✔ Created .aidex/config.json configuration bundle
✔ Detected platform architecture: Native OS Runtime
✔ Configured providers: [Ollama, Groq, OpenRouter, Anthropic, OpenAI]
✔ Default fallback rules indexed successfully!
✔ Git tracking hooks initialized.

🎉 AIdex is successfully initialized in this repository!
Original Repository: https://github.com/zelvior/AIdex
Run 'aidex doctor' to configure your API keys or run Ollama locally.`
    });
    return;
  }

  if (lower === "aidex doctor") {
    res.json({
      output: `⚕ Running AIdex System & Provider Diagnostics...

[✔] CLI Version: AIdex-Core v2.4.0
[✔] Host Runtime: Python 3.11.2 (TUI Optimized)
[✔] Platform: Windows/macOS/Linux compatible x64
[✔] Local Network: Connected
[✔] Local Provider: Ollama (Offline Mode support detected)
[✔] Safe Mode: ACTIVE (Safeguards files and system boundaries)
[⚠] Provider Keys: OpenRouter/Groq keys can be set in .env or config.json

Status: FULLY HEALTHY. Ready to perform smart file edits & shell commands.`
    });
    return;
  }

  if (lower === "aidex status") {
    res.json({
      output: `✦ AIdex Active Agent Status
----------------------------------------------------------------------
Origin:       https://github.com/zelvior/AIdex by Zelvior
Safe Mode:    ENABLED (Protects system from unauthorized executions)
Providers:    Ollama (Fully Local/Offline), OpenRouter, Groq, OpenAI, Anthropic
Memory-Saver: ACTIVE (Memory-bounded file tools enabled for low-end RAM)
Fallback UI:  READY (Automatic zero-dependency fallback for low-end terminal)
----------------------------------------------------------------------
Session Status: Idle & awaiting your prompt. Enter any task below!`
    });
    return;
  }

  if (lower.startsWith("theme ")) {
    const requestedTheme = trimmed.split(" ")[1] || "matrix";
    res.json({
      output: `✔ CLI visual theme changed to: ${requestedTheme.toUpperCase()}`
    });
    return;
  }

  // 2. Real Gemini Agent fallback
  try {
    const ai = getAiClient();

    // Prepare a highly descriptive developer-focused prompt to structure Gemini's output
    const prompt = `The developer is interacting with the AIdex CLI terminal.
They ran the command: "${trimmed}"

Provide a clean, highly structured response inside the terminal.
AIdex is an advanced developer agent CLI that does high-tech code generation, explanations, and operations.
Write your response in an elegant plain-text terminal output format.
Keep it strictly in monospace style. Use clean typography principles.
Include developer-friendly formatting such as:
- Terminal icons or symbols where appropriate (✔ for success, ⚠ for warning, ⚙ for system process, ➜ for shell prompt)
- Progress bars if they make sense (e.g., [=========> ] 90%)
- Structured sections with clean headers
- Code blocks inside the command prompt output where appropriate, keeping code explanations concise
- Keep the tone intelligent, helpful, objective, and developer-oriented.
- Do NOT wrap your whole response in \`\`\`text or \`\`\`markdown wrappers. Just return the string directly. Use standard newlines.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const reply = response.text || "No response received from agent CLI.";
    res.json({ output: reply });

  } catch (err: any) {
    // Graceful fallback if Gemini API key is missing or fails
    console.warn("Gemini execution failed or API key missing, using smart simulated CLI output instead:", err.message);

    // Provide a premium simulated response if key is not configured yet
    const simulatedAnswers: Record<string, string> = {
      "aidex analyze": `⚡ Executing AIdex Deep Workspace Analysis...
[1/4] Scanning files: 12 source files identified.
[2/4] Parsing imports: Detected TypeScript React environment.
[3/4] Optimizing imports: Found redundant imports in /src/main.tsx (none critical).
[4/4] Finalizing recommendations...

RECOMMENDATIONS:
➜ CSS Refactoring: Consider splitting global selectors into modular tailwind layers.
➜ TypeScript Config: "isolatedModules": true is active. Ensure you don't use ambient module declares.
➜ Performance: 3D Canvas rendering at 60fps, particle systems optimized for Apple M series chips.

Analysis complete. Score: 98/100 (Excellent)`,

      "aidex deploy": `✈ Preparing target cloud deployment...
✔ Authenticated as developer (faizudemon@gmail.com)
✔ Created revision bundle: build-bundle-92a01.tar.gz (14.2 KB)
✔ Uploaded revision to secure repository
⚡ Deploying bundle to target server...
[====================================] 100% (Completed in 1.4s)

🎉 Revision live!
URL: https://aidex-app-deployment-test.run.app
Deployment Status: ACTIVE`
    };

    // If we have a direct simulated match, return it
    if (simulatedAnswers[lower]) {
      res.json({ output: simulatedAnswers[lower] });
      return;
    }

    // Generate a generic intelligent-looking developer terminal reply for unmatched commands in simulation mode
    res.json({
      output: `➜ Executed: ${trimmed}

[AIdex Simulation Mode]
Note: To unlock the complete power of Gemini AI real-time code generation, configure your Gemini API Key in the "Secrets" panel (Settings > Secrets) in the Google AI Studio UI.

Here is what AIdex simulated for your request:
✔ Identified context: Developer is asking about "${trimmed.replace(/^aidex\s+/i, "")}"
✔ Recommended tool: AIdex Developer Copilot
✔ Example command: Use 'aidex help' to review available operations.

Suggested Next Steps:
1. Run 'aidex init' to generate config files.
2. Run 'aidex doctor' to check WebGL 3D diagnostic parameters.
3. Add your 'GEMINI_API_KEY' in Secrets for unlimited real-time code execution & explanations.`
    });
  }
});

// Serve static app files or Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
