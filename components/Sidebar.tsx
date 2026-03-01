'use client';

import { useState } from 'react';
import {
  PenSquare,
  Menu,
  Settings,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  chatHistory: { id: string; title: string }[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
}

export default function Sidebar({
  onNewChat,
  chatHistory,
  activeChatId,
  onSelectChat,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full bg-[#f0f4f9] transition-all duration-300 border-r border-gray-200 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Top icons */}
      <div className="flex flex-col gap-1 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <button
          onClick={onNewChat}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition"
        >
          <PenSquare size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Chat history */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2">
          {chatHistory.length > 0 && (
            <p className="text-xs text-gray-500 px-2 mb-2 font-medium uppercase tracking-wider">
              Recent
            </p>
          )}
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition group ${
                activeChatId === chat.id
                  ? 'bg-[#dde3ea] text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare size={15} className="shrink-0 text-gray-500" />
              <span className="truncate flex-1">{chat.title}</span>
              <ChevronRight
                size={14}
                className="shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition"
              />
            </button>
          ))}
        </div>
      )}

      {/* Bottom settings */}
      <div className="p-3">
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition">
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>
    </aside>
  );
}