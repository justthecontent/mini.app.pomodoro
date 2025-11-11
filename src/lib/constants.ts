import { PomodoroSettings, PomodoroState, Preset } from './types';

export const PRESETS: Record<string, Preset> = {
  traditional: {
    name: 'Traditional',
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    longBreakInterval: 4,
  },
  short: {
    name: 'Short Sessions',
    workDuration: 15 * 60,
    shortBreakDuration: 3 * 60,
    longBreakDuration: 10 * 60,
    longBreakInterval: 4,
  },
  long: {
    name: 'Deep Focus',
    workDuration: 50 * 60,
    shortBreakDuration: 10 * 60,
    longBreakDuration: 30 * 60,
    longBreakInterval: 3,
  },
};

export const DEFAULT_SETTINGS: PomodoroSettings = {
  ...PRESETS.traditional,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  notificationsEnabled: true,
  volume: 0.5,
};

export const DEFAULT_STATE: PomodoroState = {
  mode: 'WORK',
  timeRemaining: PRESETS.traditional.workDuration,
  isRunning: false,
  sessionsCompleted: 0,
  settings: DEFAULT_SETTINGS,
  lastUpdated: new Date().toISOString(),
};

export const STORAGE_KEYS = {
  POMODORO_STATE: 'pomodoro-state',
  DAILY_STATS: 'pomodoro-stats',
} as const;
