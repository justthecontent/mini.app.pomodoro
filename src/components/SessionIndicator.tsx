interface SessionIndicatorProps {
  sessionsCompleted: number;
  longBreakInterval: number;
}

export function SessionIndicator({ sessionsCompleted, longBreakInterval }: SessionIndicatorProps) {
  const currentCycle = sessionsCompleted % longBreakInterval;

  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: longBreakInterval }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index < currentCycle ? 'bg-green-500 dark:bg-green-400 scale-110' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          title={`Session ${index + 1}`}
        />
      ))}
    </div>
  );
}
