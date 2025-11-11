export type TimerMode = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface PomodoroSettings {
  workDuration: number; // seconds
  shortBreakDuration: number; // seconds
  longBreakDuration: number; // seconds
  longBreakInterval: number; // every N work sessions
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  volume: number; // 0-1
}

export interface PomodoroState {
  mode: TimerMode;
  timeRemaining: number; // seconds
  isRunning: boolean;
  sessionsCompleted: number; // count of work sessions only
  settings: PomodoroSettings;
  lastUpdated: string; // ISO timestamp
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  completedSessions: number;
  totalFocusTime: number; // seconds
}

export interface Preset {
  name: string;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}
