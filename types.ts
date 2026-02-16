export enum CreatorMode {
  WEB_ARCHITECT = 'WEB_ARCHITECT',
  GAME_ENGINE = 'GAME_ENGINE',
  APP_FORGE = 'APP_FORGE',
  NEURAL_AUTOMATION = 'NEURAL_AUTOMATION',
  OMNI_MENTOR = 'OMNI_MENTOR'
}

export enum IDEView {
  CHAT = 'CHAT',
  AGENTS = 'AGENTS',
  GITHUB = 'GITHUB',
  PLAN = 'PLAN',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  codeBlock?: string;
  timestamp: number;
  agent?: string; // Which sub-agent generated this
  isPlan?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'IDLE' | 'THINKING' | 'WORKING' | 'DONE' | 'ERROR';
  color: string;
}

export interface DeploymentConfig {
  step: number;
  status: 'IDLE' | 'PROVISIONING' | 'BUILDING' | 'DEPLOYING' | 'LIVE';
  logs: string[];
}