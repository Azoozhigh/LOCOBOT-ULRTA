import React from 'react';

const Logo3D: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const containerClass = size === 'lg' ? 'w-32 h-32' : 'w-12 h-12';
  
  return (
    <div className={`relative ${containerClass} flex items-center justify-center animate-float`}>
      {/* Outer Ring */}
      <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
      
      {/* Inner Ring - Counter Rotation */}
      <div className="absolute inset-2 border border-white/40 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />
      
      {/* Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`bg-gradient-to-br from-white to-gray-800 rounded-xl transform rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.5)] ${size === 'lg' ? 'w-12 h-12' : 'w-4 h-4'}`}>
            <div className="w-full h-full bg-black/80 m-[2px] rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className={`font-bold text-white ${size === 'lg' ? 'text-xl' : 'text-[8px]'}`}>LB</span>
            </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-white/5 rounded-full blur-xl animate-pulse" />
    </div>
  );
};

export default Logo3D;