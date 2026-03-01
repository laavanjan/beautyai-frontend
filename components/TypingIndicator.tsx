'use client';

import { Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 msg-animate">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-1.5">
        <span className="w-2 h-2 bg-gray-400 rounded-full dot-1" />
        <span className="w-2 h-2 bg-gray-400 rounded-full dot-2" />
        <span className="w-2 h-2 bg-gray-400 rounded-full dot-3" />
      </div>
    </div>
  );
}