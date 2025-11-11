import { useState } from 'react';
import { FaBell, FaCheck, FaCog, FaTimes, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import { useNotifications } from '@/hooks/useNotifications';
import { PRESETS } from '@/lib/constants';
import { PomodoroSettings } from '@/lib/types';

interface SettingsModalProps {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: Partial<PomodoroSettings>) => void;
  onApplyPreset: (preset: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
  }) => void;
}

export function SettingsModal({ settings, onUpdateSettings, onApplyPreset }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { permission, requestPermission } = useNotifications();

  const handleNotificationToggle = async () => {
    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result === 'granted') {
        onUpdateSettings({ notificationsEnabled: true });
      }
    } else {
      onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 p-3 text-gray-600 hover:text-gray-800 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-95 touch-manipulation"
        title="Settings (Esc)"
        aria-label="Open settings"
      >
        <FaCog size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="min-w-[44px] min-h-[44px] p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all touch-manipulation"
            aria-label="Close settings"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 pb-safe">
          {/* Presets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => onApplyPreset(preset)}
                  className="min-h-[60px] p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 active:bg-blue-100 dark:active:bg-blue-900/50 transition-all text-left touch-manipulation"
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-100">{preset.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {preset.workDuration / 60}m / {preset.shortBreakDuration / 60}m / {preset.longBreakDuration / 60}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Durations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Custom Durations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="workDuration" className="font-medium text-gray-700 dark:text-gray-300">
                  Work Time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="workDuration"
                    value={settings.workDuration / 60}
                    onChange={(e) => onUpdateSettings({ workDuration: Number(e.target.value) * 60 })}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="120"
                  />
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">min</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="shortBreakDuration" className="font-medium text-gray-700 dark:text-gray-300">
                  Short Break
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="shortBreakDuration"
                    value={settings.shortBreakDuration / 60}
                    onChange={(e) => onUpdateSettings({ shortBreakDuration: Number(e.target.value) * 60 })}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="60"
                  />
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">min</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="longBreakDuration" className="font-medium text-gray-700 dark:text-gray-300">
                  Long Break
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="longBreakDuration"
                    value={settings.longBreakDuration / 60}
                    onChange={(e) => onUpdateSettings({ longBreakDuration: Number(e.target.value) * 60 })}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="120"
                  />
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">min</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="longBreakInterval" className="font-medium text-gray-700 dark:text-gray-300">
                  Long Break Interval
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="longBreakInterval"
                    value={settings.longBreakInterval}
                    onChange={(e) => onUpdateSettings({ longBreakInterval: Number(e.target.value) })}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="2"
                    max="10"
                  />
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-start Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Auto-start</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <span className="font-medium text-gray-700 dark:text-gray-300">Auto-start Breaks</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={(e) => onUpdateSettings({ autoStartBreaks: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <span className="font-medium text-gray-700 dark:text-gray-300">Auto-start Work Sessions</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartWork}
                  onChange={(e) => onUpdateSettings({ autoStartWork: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Sound & Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Alerts</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <FaVolumeUp className="text-blue-600 dark:text-blue-400" />
                  ) : (
                    <FaVolumeMute className="text-gray-400 dark:text-gray-600" />
                  )}
                  <span className="font-medium text-gray-700 dark:text-gray-300">Sound Effects</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>

              {settings.soundEnabled && (
                <div className="pl-3">
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                    Volume: {Math.round(settings.volume * 100)}%
                  </label>
                  <input
                    type="range"
                    id="volume"
                    min="0"
                    max="100"
                    value={settings.volume * 100}
                    onChange={(e) => onUpdateSettings({ volume: Number(e.target.value) / 100 })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              <button
                onClick={handleNotificationToggle}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 w-full"
              >
                <div className="flex items-center gap-3">
                  <FaBell className={settings.notificationsEnabled ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Desktop Notifications</span>
                </div>
                {settings.notificationsEnabled && permission === 'granted' && <FaCheck className="text-green-600" />}
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Start / Pause</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  Space
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Reset Timer</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  R
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Skip Phase</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  S
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Settings</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
