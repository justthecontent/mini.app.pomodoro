import { PomodoroSettings, TimerMode } from './types';

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getDurationForMode(mode: TimerMode, settings: PomodoroSettings): number {
  switch (mode) {
    case 'WORK':
      return settings.workDuration;
    case 'SHORT_BREAK':
      return settings.shortBreakDuration;
    case 'LONG_BREAK':
      return settings.longBreakDuration;
  }
}

export function getModeLabel(mode: TimerMode): string {
  switch (mode) {
    case 'WORK':
      return 'Focus Time';
    case 'SHORT_BREAK':
      return 'Short Break';
    case 'LONG_BREAK':
      return 'Long Break';
  }
}

export function getModeColor(mode: TimerMode): { bg: string; text: string; accent: string } {
  switch (mode) {
    case 'WORK':
      return { bg: 'bg-red-500', text: 'text-red-600', accent: 'from-red-400 to-orange-500' };
    case 'SHORT_BREAK':
      return { bg: 'bg-blue-500', text: 'text-blue-600', accent: 'from-blue-400 to-cyan-500' };
    case 'LONG_BREAK':
      return { bg: 'bg-green-500', text: 'text-green-600', accent: 'from-green-400 to-emerald-500' };
  }
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
