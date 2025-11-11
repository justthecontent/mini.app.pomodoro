import { useEffect } from 'react';

import { TimerMode } from '@/lib/types';
import { formatTime, getModeLabel } from '@/lib/utils';

export function useDocumentTitle(timeRemaining: number, mode: TimerMode, isRunning: boolean) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const title = isRunning ? `${formatTime(timeRemaining)} - ${getModeLabel(mode)}` : 'Pomodoro Timer';

    document.title = title;

    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [timeRemaining, mode, isRunning]);
}
