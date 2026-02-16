import { GoogleGenAI } from "@google/genai";
import { CreatorMode } from '../types';
import { MODE_CONFIG } from '../constants';

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// ---------------------------------------------------------------------------
// QUOTA MANAGEMENT SYSTEM
// ---------------------------------------------------------------------------
const DAILY_LIMIT = 1000;

const checkAndIncrementQuota = (): { allowed: boolean; message?: string } => {
  if (typeof window === 'undefined') return { allowed: true }; // Server-side safety

  const today = new Date().toDateString();
  const lastDate = localStorage.getItem('locobot_last_usage_date');
  let count = parseInt(localStorage.getItem('locobot_daily_count') || '0', 10);

  if (lastDate !== today) {
    count = 0;
    localStorage.setItem('locobot_last_usage_date', today);
    localStorage.setItem('locobot_daily_count', '0');
  }

  if (count >= DAILY_LIMIT) {
    return { 
      allowed: false, 
      message: `DAILY LIMIT REACHED: You have used ${count}/${DAILY_LIMIT} generations today. Quota resets at midnight.` 
    };
  }

  localStorage.setItem('locobot_daily_count', (count + 1).toString());
  return { allowed: true };
};

export const generateLocobotResponse = async (
  prompt: string, 
  mode: CreatorMode,
  history: string[],
  currentCode: string | null,
  isPlanMode: boolean = false
): Promise<string> => {
  if (!ai) {
    return "Neural core offline. Please configure API_KEY.";
  }

  const quotaStatus = checkAndIncrementQuota();
  if (!quotaStatus.allowed) {
    return quotaStatus.message || "Daily quota exceeded.";
  }

  const modeConfig = MODE_CONFIG[mode];
  
  // -------------------------------------------------------------------------
  // PLAN MODE PROMPT (Only if explicitly enabled)
  // -------------------------------------------------------------------------
  if (isPlanMode) {
    const planPrompt = `
      You are LOCOBOT's Principal Architect.
      
      GOAL: Generate a detailed, step-by-step implementation plan for: "${prompt}".
      
      OUTPUT FORMAT: Markdown.
      
      STRUCTURE:
      1. **Executive Summary**: High-level approach.
      2. **Architecture**: Tech stack, components, state management.
      3. **Step-by-Step Plan**:
         - Phase 1: Core Setup
         - Phase 2: Logic Implementation
         - Phase 3: UI/UX Polish
      4. **Risk Assessment**: Potential bugs or edge cases.
      
      Do NOT generate HTML code yet. Focus on the roadmap.
    `;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: planPrompt,
      });
      return response.text || "Failed to generate plan.";
    } catch (e) {
      return "Plan generation failed. System overloaded.";
    }
  }

  // -------------------------------------------------------------------------
  // CODE GENERATION PROMPT (DEFAULT)
  // -------------------------------------------------------------------------
  const baseInstruction = `
    You are LOCOBOT, an elite Senior Frontend Engineer and Game Developer.
    
    GOAL:
    Create or Modify a single-file HTML application based on: "${prompt}"
    
    CRITICAL RULES:
    1. OUTPUT: Return ONLY a valid HTML string starting with \`\`\`html and ending with \`\`\`. Do NOT write explanations before or after the code.
    2. ARCHITECTURE: Single-file React application using ES Modules and Babel Standalone.
    3. STYLE: Use Tailwind CSS via CDN.
    4. ROBUSTNESS: 
       - Destructure all React hooks (useState, useEffect, etc) from 'React'.
       - Handle all errors gracefully.
       - Use 'lucide-react' for icons.
    
    FOR GAMES:
    - Use HTML5 Canvas API (<canvas>) or SVG.
    - Implement 'requestAnimationFrame' loop.
    - Handle Keyboard/Mouse events properly.
    - CLEANUP event listeners in useEffect!
    
    BOILERPLATE (Use exactly this structure to prevent Runtime Errors):
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      
      <!-- IMPORT MAP to fix React Version Conflicts -->
      <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@18.2.0",
          "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
          "lucide-react": "https://esm.sh/lucide-react@0.263.0?deps=react@18.2.0"
        }
      }
      </script>
      
      <script>
        window.onerror = function(msg, url, line, col, error) {
          document.body.innerHTML = '<div style="color:#ff5555; background:#1a0000; padding:20px; font-family:monospace; border-left: 4px solid red;"><h3>Runtime Error</h3><p>'+msg+'</p><p>Line: '+line+'</p></div>';
        };
      </script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <style>
        body { font-family: 'Inter', sans-serif; background: #0f0f0f; color: #fff; overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div id="root" class="h-screen w-screen"></div>
      
      <script type="text/babel" data-type="module">
        import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
        import { createRoot } from 'react-dom/client';
        import * as Lucide from 'lucide-react';
        
        // Error Boundary
        class ErrorBoundary extends React.Component {
          constructor(props) { super(props); this.state = { hasError: false, error: null }; }
          static getDerivedStateFromError(error) { return { hasError: true, error }; }
          render() {
            if (this.state.hasError) {
              return <div className="p-4 text-red-400 bg-red-900/20 border border-red-500/50 rounded m-4">
                <h2 className="font-bold mb-2">System Critical Error</h2>
                <pre className="text-xs whitespace-pre-wrap">{this.state.error.toString()}</pre>
              </div>;
            }
            return this.props.children;
          }
        }

        const App = () => {
          // ... GENERATED CODE GOES HERE ...
          // If using Lucide icons, use Lucide.IconName (e.g., <Lucide.Home />)
          
          return (
             <div className="flex items-center justify-center h-full text-white">App Loading...</div>
          );
        };

        const root = createRoot(document.getElementById('root'));
        root.render(<ErrorBoundary><App /></ErrorBoundary>);
      </script>
    </body>
    </html>
  `;

  const fullPrompt = `
    ${baseInstruction}
    
    CONTEXT:
    Mode: ${modeConfig.label}
    Previous Code Length: ${currentCode ? currentCode.length : 0} chars
    
    PREVIOUS_CODE_CONTEXT (Modify this if provided):
    ${currentCode ? currentCode : "No previous code. Start fresh."}
    
    Generate the full, valid HTML file now. Do not include markdown plans.
  `;

  try {
    // Using Gemini 3 Pro for Best Coding Performance
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt, 
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "Error: No response generated.";
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    // Fallback logic
    if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: fullPrompt,
        });
        return fallbackResponse.text || "Error: Flash engine empty."; 
      } catch (fbError: any) {
        return "CRITICAL FAILURE: " + (fbError.message || "");
      }
    }
    return "Generation Failed: " + errorMsg;
  }
};