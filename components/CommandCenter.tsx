import React, { useState, useEffect, useRef } from 'react';
import { CreatorMode, ChatMessage, IDEView, Agent, DeploymentConfig } from '../types';
import { MODE_CONFIG } from '../constants';
import { generateLocobotResponse } from '../services/geminiService';
import PreviewFrame from './PreviewFrame';
import { 
  Send, Sparkles, Play, 
  Settings, Bot, FileCode, Github, 
  Layout, Mic, Rocket, Activity,
  Users, Terminal, Code2, Cpu,
  CheckCircle, Loader2, StopCircle
} from 'lucide-react';

const INITIAL_GREETING = "LOCOBOT v4.5 Online. Engine: Gemini 3 Pro (Coding Optimized).";

// Mock Agents for the "Agent Teams" feature
const AGENTS_LIST: Agent[] = [
  { id: '1', name: 'Orchestrator', role: 'Team Lead', status: 'IDLE', color: 'bg-blue-500' },
  { id: '2', name: 'Frontend', role: 'UI/UX', status: 'IDLE', color: 'bg-purple-500' },
  { id: '3', name: 'Backend', role: 'Logic', status: 'IDLE', color: 'bg-green-500' },
  { id: '4', name: 'QA Bot', role: 'Testing', status: 'IDLE', color: 'bg-red-500' },
  { id: '5', name: 'Security', role: 'Auth', status: 'IDLE', color: 'bg-yellow-500' },
  { id: '6', name: 'DevOps', role: 'Deploy', status: 'IDLE', color: 'bg-orange-500' },
  { id: '7', name: 'Database', role: 'SQL', status: 'IDLE', color: 'bg-cyan-500' },
  { id: '8', name: 'Docs', role: 'Writer', status: 'IDLE', color: 'bg-pink-500' },
];

const CommandCenter: React.FC = () => {
  // State
  const [activeView, setActiveView] = useState<IDEView>(IDEView.CHAT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [activeMode] = useState<CreatorMode>(CreatorMode.WEB_ARCHITECT);
  
  // Advanced Features State
  const [isPlanMode, setIsPlanMode] = useState(false);
  const [isArenaMode, setIsArenaMode] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(AGENTS_LIST);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployConfig, setDeployConfig] = useState<DeploymentConfig>({ step: 0, status: 'IDLE', logs: [] });
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: 'init',
      role: 'assistant',
      text: INITIAL_GREETING,
      timestamp: Date.now()
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Voice Input Logic
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInputValue(prev => prev + (prev ? ' ' : '') + "Create a dashboard with a dark theme and a realtime chart.");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userText = inputValue;
    setInputValue('');
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsProcessing(true);

    setAgents(prev => prev.map(a => ({ ...a, status: 'THINKING' })));

    try {
      const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`);
      
      const aiResponseText = await generateLocobotResponse(
        userText, 
        activeMode, 
        historyText, 
        currentCode,
        isPlanMode
      );

      setAgents(prev => prev.map(a => ({ ...a, status: 'WORKING' })));

      // Handle Plan vs Code
      if (isPlanMode) {
        const newAiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: aiResponseText,
          timestamp: Date.now(),
          isPlan: true
        };
        setMessages(prev => [...prev, newAiMsg]);
      } else {
        // Code Extraction
        const codeBlockMatch = aiResponseText.match(/```html\n([\s\S]*?)```/) || aiResponseText.match(/```\n([\s\S]*?)```/);
        let extractedCode = codeBlockMatch ? codeBlockMatch[1] : null;

        if (!extractedCode) {
          const fallbackMatch = aiResponseText.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
          if (fallbackMatch) extractedCode = fallbackMatch[0];
        }

        let cleanText = aiResponseText;
        if (extractedCode && codeBlockMatch) {
           cleanText = aiResponseText.replace(codeBlockMatch[0], '').trim();
        }
        if (!cleanText && extractedCode) {
          cleanText = "Code generated successfully. Preview updated.";
        }

        if (extractedCode) {
          setCurrentCode(extractedCode);
        }

        const newAiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: cleanText,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newAiMsg]);
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: "Agent Orchestration Failed. Please retry.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
      setAgents(prev => prev.map(a => ({ ...a, status: 'IDLE' })));
    }
  };

  const startDeployment = () => {
    setIsDeploying(true);
    setDeployConfig({ step: 1, status: 'PROVISIONING', logs: ['> Initializing Vercel Container...'] });
    
    // Deployment Simulation
    const steps = [
      { t: 1000, log: '> Allocating CPU/RAM...', step: 1 },
      { t: 2500, log: '> Setting up PostgreSQL Database...', step: 2 },
      { t: 4000, log: '> Configuring Authentication (Supabase)...', step: 3 },
      { t: 5500, log: '> Running Build Command...', step: 4 },
      { t: 7000, log: '> Deploying to Edge Network...', step: 5 },
      { t: 8500, log: '> Verifying SSL Certificates...', step: 5 },
      { t: 9500, log: '> DEPLOYMENT COMPLETE: https://locobot-app-v4.vercel.app', status: 'LIVE' },
    ];

    steps.forEach(({ t, log, step, status }) => {
      setTimeout(() => {
        setDeployConfig(prev => ({
          ...prev,
          step: step || prev.step,
          status: (status as any) || prev.status,
          logs: [...prev.logs, log]
        }));
      }, t);
    });

    setTimeout(() => setIsDeploying(false), 12000);
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-[#e3e3e3] font-sans overflow-hidden">
      
      {/* 1. ACTIVITY BAR (Far Left) */}
      <div className="w-12 border-r border-[#222] bg-[#111] flex flex-col items-center py-4 gap-4 z-20">
        <div className="mb-4 text-blue-500"><Bot className="w-6 h-6" /></div>
        <IconButton icon={<Code2 />} active={activeView === IDEView.CHAT} onClick={() => setActiveView(IDEView.CHAT)} tooltip="Code & Chat" />
        <IconButton icon={<Users />} active={activeView === IDEView.AGENTS} onClick={() => setActiveView(IDEView.AGENTS)} tooltip="Agent Teams" />
        <IconButton icon={<Github />} active={activeView === IDEView.GITHUB} onClick={() => setActiveView(IDEView.GITHUB)} tooltip="GitHub Workspace" />
        <IconButton icon={<Layout />} active={activeView === IDEView.PLAN} onClick={() => setActiveView(IDEView.PLAN)} tooltip="Architect Plan" />
        <div className="mt-auto flex flex-col gap-4">
          <IconButton icon={<Settings />} active={activeView === IDEView.SETTINGS} onClick={() => setActiveView(IDEView.SETTINGS)} tooltip="Settings" />
        </div>
      </div>

      {/* 2. SIDEBAR PANEL (Dynamic) */}
      <div className="w-[380px] flex flex-col border-r border-[#222] bg-[#161616] z-10 transition-all">
        {/* Sidebar Header */}
        <div className="h-12 border-b border-[#222] flex items-center justify-between px-4">
          <span className="font-semibold text-xs tracking-widest text-gray-400 uppercase">
            {activeView === IDEView.CHAT ? 'COMPOSER' : activeView}
          </span>
          {activeView === IDEView.CHAT && (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsArenaMode(!isArenaMode)}
                className={`p-1 rounded ${isArenaMode ? 'bg-purple-900 text-purple-200' : 'text-gray-500 hover:text-white'}`}
                title="Arena Mode (Compare Models)"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={startDeployment}
                className="p-1 text-green-500 hover:text-green-400"
                title="Instant Deploy"
              >
                <Rocket className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          
          {/* VIEW: CHAT / COMPOSER */}
          {activeView === IDEView.CHAT && (
            <>
              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                   <MessageBubble key={msg.id} msg={msg} />
                ))}
                {isProcessing && (
                  <div className="flex flex-col gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Agents working...
                    </div>
                    <div className="h-1 w-full bg-[#333] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 animate-progress" style={{width: '60%'}}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* SuperComplete Context Hint */}
              <div className="px-3 py-1 bg-[#111] border-y border-[#222] text-[10px] text-gray-500 flex justify-between items-center">
                 <span>Context: {activeMode}</span>
                 <span>Predicted: Update UI</span>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-[#161616]">
                <div className="bg-[#1e1e1e] border border-[#333] rounded-lg focus-within:border-blue-600/50 transition-colors p-2">
                  
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
                     <button 
                       onClick={() => setIsPlanMode(!isPlanMode)}
                       className={`text-[10px] px-2 py-0.5 rounded border ${
                         isPlanMode ? 'bg-blue-900/30 border-blue-500 text-blue-200' : 'border-[#333] text-gray-400'
                       }`}
                       title="Enable to see detailed plans before code"
                     >
                       PLAN MODE: {isPlanMode ? 'ON' : 'OFF'}
                     </button>
                     <span className="text-[10px] text-gray-600">|</span>
                     <span className="text-[10px] text-gray-500">Gemini 3 Pro</span>
                  </div>

                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Describe your app or game..."
                    className="w-full bg-transparent text-sm text-gray-200 h-20 resize-none focus:outline-none custom-scrollbar"
                  />
                  
                  <div className="flex justify-between items-center mt-2">
                    <button 
                      onClick={toggleVoice}
                      className={`p-1.5 rounded-md transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'text-gray-400 hover:text-white'}`}
                    >
                      {isListening ? <StopCircle className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW: AGENTS */}
          {activeView === IDEView.AGENTS && (
            <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
               {agents.map(agent => (
                 <div key={agent.id} className="bg-[#1e1e1e] border border-[#333] p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-300">{agent.name}</span>
                       <div className={`w-2 h-2 rounded-full ${agent.status === 'WORKING' ? 'animate-pulse bg-green-500' : 'bg-gray-600'}`} />
                    </div>
                    <span className="text-[10px] text-gray-500">{agent.role}</span>
                    <div className="mt-1 text-[10px] px-2 py-0.5 bg-[#222] rounded text-center border border-[#333]">
                      {agent.status}
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* VIEW: GITHUB */}
          {activeView === IDEView.GITHUB && (
            <div className="p-4 flex flex-col gap-4 text-center text-gray-500 mt-10">
               <Github className="w-12 h-12 mx-auto opacity-20" />
               <p className="text-sm">Connect a Repository to enable Workspace features.</p>
               <button className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#333] rounded text-xs text-white">
                 Authenticate GitHub
               </button>
            </div>
          )}

          {/* VIEW: PLAN */}
          {activeView === IDEView.PLAN && (
            <div className="p-4 overflow-y-auto h-full text-gray-300 text-sm markdown-body">
              {messages.filter(m => m.isPlan).length > 0 ? (
                messages.filter(m => m.isPlan).reverse().map(m => (
                  <div key={m.id} className="mb-8 border-b border-[#333] pb-4">
                     <div className="text-[10px] text-blue-500 mb-2 font-mono">PLAN GENERATED AT {new Date(m.timestamp).toLocaleTimeString()}</div>
                     <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
                  </div>
                ))
              ) : (
                 <div className="text-center mt-10 text-gray-600">
                    <Layout className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No architectural plans generated yet. <br/> Switch to "Plan Mode" in Chat.
                 </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 3. MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col bg-[#0d0d0d] relative">
        {currentCode ? (
          <PreviewFrame code={currentCode} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-700 space-y-4">
            <div className="w-24 h-24 rounded-full bg-[#111] border border-[#222] flex items-center justify-center animate-pulse">
              <Code2 className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-sm font-mono tracking-widest uppercase">Workspace Idle</p>
          </div>
        )}
        
        {/* Bottom Terminal Panel (Visual only for Agent Logs) */}
        <div className="h-32 border-t border-[#222] bg-[#111] flex flex-col">
           <div className="h-8 border-b border-[#222] px-4 flex items-center gap-4 text-xs text-gray-500">
              <span className="hover:text-white cursor-pointer border-b border-blue-500 text-white pb-2 pt-2">TERMINAL</span>
              <span className="hover:text-white cursor-pointer pb-2 pt-2">OUTPUT</span>
              <span className="hover:text-white cursor-pointer pb-2 pt-2">PROBLEMS</span>
              <span className="ml-auto">Gemini 3 Core: Active</span>
           </div>
           <div className="flex-1 p-2 font-mono text-[10px] text-gray-400 overflow-y-auto">
              <div className="text-green-500">➜ locobot-engine initialized</div>
              {isProcessing && (
                <>
                  <div className="text-blue-400">➜ [ORCHESTRATOR] Analyzing prompt intent...</div>
                  <div className="text-purple-400">➜ [FRONTEND_AGENT] Drafting component tree...</div>
                  <div className="text-yellow-400">➜ [QA_BOT] Scanning for edge cases...</div>
                </>
              )}
              {deployConfig.logs.map((log, i) => (
                 <div key={i} className="text-cyan-500">{log}</div>
              ))}
           </div>
        </div>
      </div>

      {/* 4. DEPLOYMENT MODAL */}
      {isDeploying && (
         <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="w-[500px] bg-[#161616] border border-[#333] rounded-xl overflow-hidden shadow-2xl">
               <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    {deployConfig.status === 'LIVE' ? <CheckCircle className="text-green-500"/> : <Loader2 className="animate-spin text-blue-500"/>}
                    {deployConfig.status === 'LIVE' ? 'Deployment Successful' : 'Deploying to Production'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">Locobot is provisioning cloud resources...</p>
                  
                  {/* Stepper */}
                  <div className="space-y-4">
                     {[1, 2, 3, 4, 5].map(step => (
                        <div key={step} className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${
                              deployConfig.step > step ? 'bg-green-500 border-green-500 text-black' : 
                              deployConfig.step === step ? 'border-blue-500 text-blue-500 animate-pulse' :
                              'border-[#333] text-gray-600'
                           }`}>
                             {deployConfig.step > step ? <CheckCircle className="w-3.5 h-3.5"/> : step}
                           </div>
                           <div className={`h-1 flex-1 rounded-full ${
                              deployConfig.step > step ? 'bg-green-900' : 'bg-[#222]'
                           }`}>
                             {deployConfig.step === step && <div className="h-full bg-blue-500 animate-progress w-1/2"></div>}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Logs Window */}
                  <div className="mt-6 h-32 bg-black rounded border border-[#333] p-3 font-mono text-[10px] text-green-400 overflow-y-auto">
                     {deployConfig.logs.map((l, i) => <div key={i}>{l}</div>)}
                     {deployConfig.status !== 'LIVE' && <span className="animate-pulse">_</span>}
                  </div>
               </div>
               {deployConfig.status === 'LIVE' && (
                  <div className="p-4 bg-[#111] border-t border-[#333] flex justify-end">
                     <button onClick={() => setIsDeploying(false)} className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200">
                        View Live Site
                     </button>
                  </div>
               )}
            </div>
         </div>
      )}

    </div>
  );
};

// UI Helpers
const IconButton = ({ icon, active, onClick, tooltip }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all relative group ${
      active ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-[#222]'
    }`}
  >
    {React.cloneElement(icon, { size: 20 })}
    {/* Tooltip */}
    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#333] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
      {tooltip}
    </div>
  </button>
);

const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[90%] rounded-lg p-3 text-sm leading-relaxed border ${
        isUser 
          ? 'bg-[#222] border-[#333] text-white' 
          : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300'
      }`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
            {msg.isPlan ? <Layout className="w-3 h-3"/> : <Sparkles className="w-3 h-3" />}
            {msg.isPlan ? 'Architect Plan' : 'Locobot Output'}
          </div>
        )}
        <div className="whitespace-pre-wrap">{msg.text}</div>
      </div>
    </div>
  );
}

export default CommandCenter;