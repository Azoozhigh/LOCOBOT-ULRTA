import React from 'react';
import Logo3D from './Logo3D';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onEnter: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl px-6">
        <Logo3D size="lg" />
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">
            LOCO<span className="text-gray-500">BOT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide">
            ARCHITECT YOUR REALITY <span className="text-white/20">|</span> EST. 2045
          </p>
        </div>

        <button 
          onClick={onEnter}
          className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center space-x-2">
            <span>INITIALIZE SYSTEM</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
      
      <div className="absolute bottom-10 text-white/20 text-xs tracking-[0.2em]">
        SYSTEM READY // V4.0.5
      </div>
    </div>
  );
};

export default Hero;