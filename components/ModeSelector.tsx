import React from 'react';
import { CreatorMode } from '../types';
import { MODE_CONFIG } from '../constants';

interface ModeSelectorProps {
  currentMode: CreatorMode;
  onSelectMode: (mode: CreatorMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 border border-white/10">
      {Object.values(CreatorMode).map((mode) => {
        const config = MODE_CONFIG[mode];
        const isActive = currentMode === mode;
        
        return (
          <button
            key={mode}
            onClick={() => onSelectMode(mode)}
            title={config.label}
            className={`
              p-2 rounded-md transition-all duration-200 relative group
              ${isActive 
                ? 'bg-white text-black shadow-lg scale-105' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {React.cloneElement(config.icon as React.ReactElement<{ className?: string }>, {
                className: isActive ? 'w-4 h-4' : 'w-4 h-4'
            })}
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;