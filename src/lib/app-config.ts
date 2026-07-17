export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;
  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;
  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;
  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorDark?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerBarCount?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerWaveLineWidth?: number;
  agentName?: string;
  sandboxId?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: process.env.COMPANY ?? 'Портал',
  pageTitle: process.env.TITLE ?? 'Портал Агенты',
  pageDescription: process.env.DESCRIPTION ?? 'Портал ИИ-агенты',
  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,
  logo: '/lk-logo.svg',
  accent: '#b10ed6ff',
  logoDark: '/lk-logo-dark.svg',
  accentDark: 'rgb(154, 6, 183)',
  startButtonText: process.env.BUTTON ?? 'Открыть Портал',
  audioVisualizerColor: '#9f0676',
  audioVisualizerColorDark: '#f91fdf',
  audioVisualizerType: 'aura',
  audioVisualizerColorShift: 0.3,
  agentName: process.env.AGENT_NAME ?? undefined,
  sandboxId: undefined,
};
