import { FaForward, FaPause, FaPlay, FaRedo } from 'react-icons/fa';

interface ControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function Controls({ isRunning, onToggle, onReset, onSkip }: ControlsProps) {
  return (
    <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
      <button
        onClick={onToggle}
        className="min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] px-6 sm:px-8 py-4 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform active:scale-95 shadow-lg touch-manipulation"
        title={isRunning ? 'Pause (Space)' : 'Start (Space)'}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>

      <button
        onClick={onReset}
        className="min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] px-5 sm:px-6 py-4 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all transform active:scale-95 shadow-lg touch-manipulation"
        title="Reset (R)"
        aria-label="Reset timer"
      >
        <FaRedo size={20} />
      </button>

      <button
        onClick={onSkip}
        className="min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] px-5 sm:px-6 py-4 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all transform active:scale-95 shadow-lg touch-manipulation"
        title="Skip (S)"
        aria-label="Skip to next phase"
      >
        <FaForward size={20} />
      </button>
    </div>
  );
}
