'use client';

import { useEffect, useState } from 'react';

import { CircularProgress } from '@/components/CircularProgress';
import { Controls } from '@/components/Controls';
import { SessionIndicator } from '@/components/SessionIndicator';
import { SettingsModal } from '@/components/SettingsModal';
import { Stats } from '@/components/Stats';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useWakeLock } from '@/hooks/useWakeLock';
import { formatTime, getDurationForMode, getModeColor, getModeLabel } from '@/lib/utils';

export default function Home() {
  const { state, toggleTimer, resetTimer, skipToNext, updateSettings, applyPreset } = usePomodoro();
  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update document title with timer
  useDocumentTitle(state.timeRemaining, state.mode, state.isRunning);

  // Keep screen awake during active timer
  useWakeLock(state.isRunning);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggle: toggleTimer,
    onReset: resetTimer,
    onSkip: skipToNext,
    onSettings: () => setShowSettings((prev) => !prev),
  });

  const { accent, text } = getModeColor(state.mode);
  const totalDuration = getDurationForMode(state.mode, state.settings);

  // Show loading state during hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-lg">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400 dark:text-gray-600">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg">
        {/* Main Timer Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
          {/* Gradient Accent */}
          <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-5 dark:opacity-10 rounded-3xl`} />

          {/* Content */}
          <div className="relative">
            {/* Mode Label */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className={`text-xl sm:text-2xl font-bold ${text} tracking-wide`}>{getModeLabel(state.mode)}</h1>
            </div>

            {/* Circular Timer */}
            <div className="relative flex items-center justify-center mb-6 sm:mb-8">
              <CircularProgress timeRemaining={state.timeRemaining} totalTime={totalDuration} mode={state.mode} />

              {/* Time Display (centered over circle) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                  {formatTime(state.timeRemaining)}
                </div>
                {state.isRunning && (
                  <div className="mt-1 sm:mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs sm:text-sm font-medium rounded-full animate-pulse">
                    Running
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <Controls isRunning={state.isRunning} onToggle={toggleTimer} onReset={resetTimer} onSkip={skipToNext} />

            {/* Session Indicator */}
            <SessionIndicator
              sessionsCompleted={state.sessionsCompleted}
              longBreakInterval={state.settings.longBreakInterval}
            />

            {/* Sessions Count */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Session {(state.sessionsCompleted % state.settings.longBreakInterval) + 1} of{' '}
                {state.settings.longBreakInterval}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {state.sessionsCompleted} total sessions completed
              </p>
            </div>

            {/* Today's Stats */}
            <Stats />
          </div>
        </div>

        {/* Keyboard Hint - Hide on mobile */}
        <div className="hidden sm:block text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Press{' '}
          <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
            Space
          </kbd>{' '}
          to {state.isRunning ? 'pause' : 'start'} •{' '}
          <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
            Esc
          </kbd>{' '}
          for settings
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal settings={state.settings} onUpdateSettings={updateSettings} onApplyPreset={applyPreset} />
      )}

      {/* Theme Toggle & Settings Buttons (when modal is closed) */}
      {!showSettings && (
        <>
          <div className="fixed top-3 left-3 sm:top-4 sm:left-4">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="fixed top-3 right-3 sm:top-4 sm:right-4 p-3 sm:p-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-95 touch-manipulation"
            aria-label="Open settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
