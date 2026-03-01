'use client';

import { Sparkles } from 'lucide-react';

const QUICK_ACTIONS = [
  { emoji: '💄', label: 'Shop lipsticks' },
  { emoji: '✨', label: 'Skincare routine' },
  { emoji: '🛒', label: 'View cart' },
  { emoji: '🌟', label: 'Best sellers' },
  { emoji: '🎁', label: 'Gift ideas' },
];

interface WelcomeScreenProps {
  userName: string;
  onQuickAction: (label: string) => void;
}

export default function WelcomeScreen({ userName, onQuickAction }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center select-none">
      {/* Greeting */}
      <div className="fade-up-1 flex items-center gap-2 text-lg text-gray-600 mb-2">
        <Sparkles size={20} className="text-pink-500" />
        <span>Hi {userName}</span>
      </div>

      <h1 className="fade-up-2 text-4xl font-semibold text-gray-800 mb-10 tracking-tight">
        Where should we start?
      </h1>

      {/* Quick action pills */}
      <div className="fade-up-3 flex flex-wrap justify-center gap-3 mb-10 mt-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onQuickAction(action.label)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
          >
            <span>{action.emoji}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}