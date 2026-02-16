import React, { useState } from 'react';
import { Eye, Code, RefreshCw, ExternalLink, Github, CheckCircle, Loader2 } from 'lucide-react';

interface PreviewFrameProps {
  code: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [key, setKey] = useState(0); 
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubStatus, setGithubStatus] = useState<'idle' | 'connecting' | 'connected' | 'pushing' | 'pushed'>('idle');

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locobot-app-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGithubClick = () => {
    if (githubStatus === 'idle') {
      setIsGithubModalOpen(true);
    } else if (githubStatus === 'connected') {
      simulatePush();
    }
  };

  const simulateConnection = () => {
    setGithubStatus('connecting');
    setTimeout(() => {
      setGithubStatus('connected');
      setIsGithubModalOpen(false);
    }, 1500);
  };

  const simulatePush = () => {
    setGithubStatus('pushing');
    setTimeout(() => {
      setGithubStatus('pushed');
      setTimeout(() => setGithubStatus('connected'), 3000); // Reset after success
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#131313] relative">
      {/* Header */}
      <div className="h-12 border-b border-[#333] flex items-center justify-between px-4 bg-[#1e1e1e]">
        <div className="flex items-center gap-1 bg-[#2a2a2a] p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'preview' ? 'bg-[#444] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'code' ? 'bg-[#444] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Code
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* GitHub Action */}
          <button 
            onClick={handleGithubClick}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all
              ${githubStatus === 'pushed' 
                ? 'bg-green-600 text-white' 
                : githubStatus === 'pushing'
                  ? 'bg-gray-700 text-gray-300 cursor-wait'
                  : githubStatus === 'connected'
                    ? 'bg-[#24292e] text-white hover:bg-black'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333]'
              }
            `}
          >
            {githubStatus === 'pushing' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {githubStatus === 'pushed' && <CheckCircle className="w-3.5 h-3.5" />}
            {githubStatus === 'idle' && <Github className="w-3.5 h-3.5" />}
            {githubStatus === 'connected' && <Github className="w-3.5 h-3.5" />}
            
            <span>
              {githubStatus === 'idle' && 'Connect GitHub'}
              {githubStatus === 'connecting' && 'Connecting...'}
              {githubStatus === 'connected' && 'Push to Repo'}
              {githubStatus === 'pushing' && 'Pushing...'}
              {githubStatus === 'pushed' && 'Deployed'}
            </span>
          </button>

          <div className="w-[1px] h-4 bg-[#333]" />

          <button onClick={handleRefresh} className="text-gray-400 hover:text-white transition-colors" title="Reload Preview">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDownload} className="text-gray-400 hover:text-white transition-colors" title="Export HTML">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="w-full h-full bg-white relative">
             <iframe
                key={key}
                srcDoc={code}
                className="w-full h-full border-none"
                title="Preview"
                sandbox="allow-scripts allow-modals allow-same-origin allow-popups allow-forms"
             />
          </div>
        ) : (
          <div className="w-full h-full bg-[#0d0d0d] overflow-auto p-4 custom-scrollbar">
            <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
              {code}
            </pre>
          </div>
        )}
      </div>

      {/* GitHub Auth Modal Simulation */}
      {isGithubModalOpen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1e1e1e] border border-[#333] p-6 rounded-xl w-80 shadow-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-[#24292e] rounded-full flex items-center justify-center">
              <Github className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Connect to GitHub</h3>
              <p className="text-gray-400 text-xs mt-1">Authorize LOCOBOT to create repositories and push code on your behalf.</p>
            </div>
            
            <div className="flex flex-col w-full gap-2 pt-2">
              <button 
                onClick={simulateConnection}
                className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-bold transition-colors"
              >
                Authorize
              </button>
              <button 
                onClick={() => setIsGithubModalOpen(false)}
                className="w-full py-2 bg-transparent text-gray-500 hover:text-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewFrame;