'use client';

import { useRef, useEffect } from 'react';
import { Send, Plus, Mic } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Beauty Mart anything…"
          rows={1}
          className="w-full px-5 pt-4 pb-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none bg-transparent leading-relaxed"
        />

        {/* Toolbar row */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500">
              <Plus size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500">
              <Mic size={18} />
            </button>
            <button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition ${
                value.trim() && !disabled
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">
        Beauty Mart Assistant can make mistakes. Double-check important info.
      </p>
    </div>
  );
}