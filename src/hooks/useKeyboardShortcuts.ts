import { useEffect } from 'react';

interface KeyboardShortcuts {
  onToggle?: () => void;
  onReset?: () => void;
  onSkip?: () => void;
  onSettings?: () => void;
}

export function useKeyboardShortcuts({ onToggle, onReset, onSkip, onSettings }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      switch (key) {
        case ' ':
        case 'k':
          e.preventDefault();
          onToggle?.();
          break;
        case 'r':
          e.preventDefault();
          onReset?.();
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            // Don't override save
            return;
          }
          e.preventDefault();
          onSkip?.();
          break;
        case 'escape':
          e.preventDefault();
          onSettings?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggle, onReset, onSkip, onSettings]);
}
