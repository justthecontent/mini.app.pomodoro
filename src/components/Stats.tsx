import { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

import { STORAGE_KEYS } from '@/lib/constants';
import { getTodayString } from '@/lib/utils';

export function Stats() {
  const [todayStats, setTodayStats] = useState({ completedSessions: 0, totalFocusTime: 0 });

  useEffect(() => {
    const loadStats = () => {
      const today = getTodayString();
      const statsKey = `${STORAGE_KEYS.DAILY_STATS}-${today}`;
      const stats = JSON.parse(localStorage.getItem(statsKey) || '{"completedSessions": 0, "totalFocusTime": 0}');
      setTodayStats(stats);
    };

    loadStats();
    const interval = setInterval(loadStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const focusHours = Math.floor(todayStats.totalFocusTime / 3600);
  const focusMinutes = Math.floor((todayStats.totalFocusTime % 3600) / 60);

  if (todayStats.completedSessions === 0) return null;

  return (
    <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
      <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 mb-2">
        <FaTrophy />
        <span className="font-semibold">Today&apos;s Progress</span>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{todayStats.completedSessions}</div>
        <div className="text-sm text-green-700 dark:text-green-300">
          {todayStats.completedSessions === 1 ? 'Session' : 'Sessions'} Completed
        </div>
        {focusHours > 0 || focusMinutes > 0 ? (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            {focusHours > 0 && `${focusHours}h `}
            {focusMinutes}m focused
          </div>
        ) : null}
      </div>
    </div>
  );
}
