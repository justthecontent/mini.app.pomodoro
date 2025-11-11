import { TimerMode } from '@/lib/types';
import { getModeColor } from '@/lib/utils';

interface CircularProgressProps {
  timeRemaining: number;
  totalTime: number;
  mode: TimerMode;
}

export function CircularProgress({ timeRemaining, totalTime, mode }: CircularProgressProps) {
  // Responsive size: smaller on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const size = isMobile ? 240 : 280;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const offset = circumference - (progress / 100) * circumference;
  const { bg } = getModeColor(mode);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        className="text-gray-200 dark:text-gray-700"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`transition-all duration-1000 ease-linear ${bg.replace('bg-', 'text-')}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
