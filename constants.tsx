import React from 'react';
import { CreatorMode } from './types';
import { 
  Globe, 
  Gamepad2, 
  Smartphone, 
  Cpu, 
  GraduationCap, 
  LayoutTemplate,
  Terminal,
  Layers,
  Zap,
  Box
} from 'lucide-react';

export const MODE_CONFIG = {
  [CreatorMode.WEB_ARCHITECT]: {
    label: 'Web Architect',
    description: 'Production-grade React systems.',
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500',
    promptPrefix: 'Act as a Senior Frontend Architect. Generate production-ready React/Next.js code.'
  },
  [CreatorMode.GAME_ENGINE]: {
    label: 'Game Engine',
    description: 'AAA-grade physics, asset management & high-fidelity gameplay.',
    icon: <Gamepad2 className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500',
    promptPrefix: 'Act as a Lead Game Developer. Provide high-performance game logic with robust physics and asset management.'
  },
  [CreatorMode.APP_FORGE]: {
    label: 'App Forge',
    description: 'Elite cross-platform application systems.',
    icon: <Smartphone className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500',
    promptPrefix: 'Act as a Mobile Lead Architect. Generate high-fidelity cross-platform application code.'
  },
  [CreatorMode.NEURAL_AUTOMATION]: {
    label: 'Neural Auto',
    description: 'Autonomous system control & optimization bots.',
    icon: <Cpu className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-500',
    promptPrefix: 'Act as an Automation Engineer. Write robust scripts for system-level automation.'
  },
  [CreatorMode.OMNI_MENTOR]: {
    label: 'Omni Mentor',
    description: 'Advanced technical architectural breakdown.',
    icon: <GraduationCap className="w-6 h-6" />,
    gradient: 'from-yellow-400 to-amber-600',
    promptPrefix: 'Act as a Tech Mentor. Explain complex architectural patterns and provide detailed examples.'
  }
};

export const INITIAL_GREETING = "I am LOCOBOT. The neural core is synced to 2045 standards. What outstanding architecture shall we deploy today?";