import { useCallback, useEffect, useRef } from 'react';

import { DEFAULT_STATE, STORAGE_KEYS } from '@/lib/constants';
import { PomodoroSettings, PomodoroState, TimerMode } from '@/lib/types';
import { getDurationForMode, getTodayString, isToday } from '@/lib/utils';
import { useLocalStorage } from './useLocalStorage';
import { useNotifications } from './useNotifications';

export function usePomodoro() {
  const [state, setState] = useLocalStorage<PomodoroState>(STORAGE_KEYS.POMODORO_STATE, DEFAULT_STATE);
  const { showNotification } = useNotifications();
  const audioRef = useRef<{ start?: HTMLAudioElement; pause?: HTMLAudioElement; complete?: HTMLAudioElement }>({});

  // Initialize audio
  useEffect(() => {
    if (typeof window === 'undefined') return;
    audioRef.current = {
      start: new Audio('/sounds/start.mp3'),
      pause: new Audio('/sounds/pause.mp3'),
      complete: new Audio('/sounds/complete.mp3'),
    };
  }, []);

  // Play sound effect
  const playSound = useCallback(
    (type: 'start' | 'pause' | 'complete') => {
      if (!state.settings.soundEnabled) return;
      const audio = audioRef.current[type];
      if (audio) {
        audio.volume = state.settings.volume;
        audio.play().catch((err) => console.error('Error playing sound:', err));
      }
    },
    [state.settings.soundEnabled, state.settings.volume]
  );

  // Update daily stats
  const updateDailyStats = useCallback(() => {
    const today = getTodayString();
    const statsKey = `${STORAGE_KEYS.DAILY_STATS}-${today}`;
    const current = JSON.parse(localStorage.getItem(statsKey) || '{"completedSessions": 0, "totalFocusTime": 0}');

    localStorage.setItem(
      statsKey,
      JSON.stringify({
        completedSessions: current.completedSessions + 1,
        totalFocusTime: current.totalFocusTime + state.settings.workDuration,
      })
    );
  }, [state.settings.workDuration]);

  // Transition to next phase (called when timer hits 0)
  const transitionToNextPhase = useCallback(
    (currentState: PomodoroState): PomodoroState => {
      const { mode, sessionsCompleted, settings } = currentState;

      let nextMode: TimerMode;
      let newSessionsCompleted = sessionsCompleted;

      if (mode === 'WORK') {
        newSessionsCompleted++;
        const isLongBreakTime = newSessionsCompleted % settings.longBreakInterval === 0;
        nextMode = isLongBreakTime ? 'LONG_BREAK' : 'SHORT_BREAK';
      } else {
        nextMode = 'WORK';
      }

      const duration = getDurationForMode(nextMode, settings);
      const shouldAutoStart =
        (nextMode === 'WORK' && settings.autoStartWork) || (nextMode !== 'WORK' && settings.autoStartBreaks);

      // Play completion sound
      playSound('complete');

      // Show notification
      if (settings.notificationsEnabled) {
        const notificationBody =
          mode === 'WORK'
            ? `Great work! Time for a ${nextMode === 'LONG_BREAK' ? 'long' : 'short'} break.`
            : 'Break is over! Ready to focus?';

        showNotification('Pomodoro Timer', notificationBody);
      }

      // Update stats
      if (mode === 'WORK') {
        updateDailyStats();
      }

      return {
        ...currentState,
        mode: nextMode,
        timeRemaining: duration,
        isRunning: shouldAutoStart,
        sessionsCompleted: newSessionsCompleted,
        lastUpdated: new Date().toISOString(),
      };
    },
    [playSound, showNotification, updateDailyStats]
  );

  // Timer tick effect
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const newTime = prev.timeRemaining - 1;

        if (newTime <= 0) {
          // Timer completed - transition to next phase
          return transitionToNextPhase(prev);
        }

        return {
          ...prev,
          timeRemaining: newTime,
          lastUpdated: new Date().toISOString(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, setState, transitionToNextPhase]);

  // Check if state is from today, reset if not
  useEffect(() => {
    if (!state.lastUpdated || !isToday(state.lastUpdated)) {
      setState((prev) => ({
        ...DEFAULT_STATE,
        settings: prev.settings, // Keep user settings
      }));
    }
  }, [state.lastUpdated, setState]);

  // Toggle play/pause
  const toggleTimer = useCallback(() => {
    playSound(state.isRunning ? 'pause' : 'start');
    setState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
      lastUpdated: new Date().toISOString(),
    }));
  }, [state.isRunning, playSound, setState]);

  // Reset current timer
  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timeRemaining: getDurationForMode(prev.mode, prev.settings),
      isRunning: false,
      lastUpdated: new Date().toISOString(),
    }));
  }, [setState]);

  // Skip to next phase
  const skipToNext = useCallback(() => {
    setState((prev) => transitionToNextPhase({ ...prev, timeRemaining: 0 }));
  }, [setState, transitionToNextPhase]);

  // Update settings
  const updateSettings = useCallback(
    (newSettings: Partial<PomodoroSettings>) => {
      setState((prev) => {
        const updatedSettings = { ...prev.settings, ...newSettings };
        return {
          ...prev,
          settings: updatedSettings,
          // Reset timer with new duration if not running
          timeRemaining: prev.isRunning ? prev.timeRemaining : getDurationForMode(prev.mode, updatedSettings),
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    [setState]
  );

  // Apply preset
  const applyPreset = useCallback(
    (preset: {
      workDuration: number;
      shortBreakDuration: number;
      longBreakDuration: number;
      longBreakInterval: number;
    }) => {
      updateSettings(preset);
    },
    [updateSettings]
  );

  return {
    state,
    toggleTimer,
    resetTimer,
    skipToNext,
    updateSettings,
    applyPreset,
  };
}
