'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import ChatInput from '@/components/ChatInput';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import CartToast from '@/components/CartToast';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { getSessionId, clearSession } from '@/lib/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/chat`
  : 'http://localhost:8000/chat';
const NAME_KEY = 'beautyai_user_name';

// ── Name onboarding modal ─────────────────────────────────────────────────────
function NameModal({ onSave }: { onSave: (name: string) => void }) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 w-full max-w-sm mx-4 flex flex-col items-center gap-5" style={{animation: 'fadeUp 0.3s ease-out'}}>
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
          <Sparkles size={24} className="text-white" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome to Beauty Mart</h2>
          <p className="text-sm text-gray-500">What should we call you?</p>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Your first name"
          maxLength={30}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Let's go
          <ArrowRight size={16} />
        </button>

        <p className="text-xs text-gray-400 text-center">
          No account needed — just your name ✨
        </p>
      </div>
    </div>
  );
}

// ── Quick action pills on the welcome screen ──────────────────────────────────
// Each sends a real message to the backend — fully functional, not decorative
const QUICK_ACTIONS = [
  {
    emoji: '🗂️',
    label: 'Shop by Category',
    message: 'What categories do you carry?',
  },
  {
    emoji: '🌟',
    label: 'Best Sellers',
    message: 'Show me your best selling products across all categories.',
  },
  {
    emoji: '💰',
    label: 'Budget Picks',
    message: 'Show me budget picks under Rs.1000.',
  },
  {
    emoji: '🎯',
    label: 'Shop by Concern',
    message: 'I want to shop by concern. What concerns do you cover?',
  },
];

interface Message {
  from: 'user' | 'bot';
  text?: string;
  reply_text?: string;
  products?: any[];
  product_groups?: any[];
  suggested_options?: any[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // ── Name onboarding ──────────────────────────────────────────────────────
  const [userName, setUserName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(NAME_KEY);
    if (stored) {
      setUserName(stored);
    } else {
      setShowNameModal(true);
    }
  }, []);

  const handleSaveName = (name: string) => {
    localStorage.setItem(NAME_KEY, name);
    setUserName(name);
    setShowNameModal(false);
  };
  // ────────────────────────────────────────────────────────────────────────

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, name: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isTyping]);

  const createNewSession = useCallback(() => {
    clearSession();
    const id = getSessionId();
    setSessions((prev) => [{ id, title: 'New chat', messages: [] }, ...prev]);
    setActiveSessionId(id);
    setHasStarted(false);
    setInput('');
    return id;
  }, []);

  useEffect(() => { createNewSession(); }, []);

  const addMessage = (sessionId: string, msg: Message) => {
    setSessions((prev) =>
      prev.map((s) => s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s)
    );
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => s.id === sessionId ? { ...s, title } : s)
    );
  };

  const sendMessage = async (
    text: string,
    type: 'text' | 'button' = 'text',
    payload?: any,
    sessionId?: string
  ) => {
    const sid = sessionId || activeSessionId;
    if (!sid || !text.trim()) return;

    setHasStarted(true);
    addMessage(sid, { from: 'user', text });
    setInput('');
    setIsTyping(true);

    const session = sessions.find((s) => s.id === sid);
    if (session && session.title === 'New chat') {
      updateSessionTitle(sid, text.slice(0, 40));
    }

    try {
      const res = await axios.post(API_URL, {
        session_id: sid,
        message_text: text,
        input_type: type,
        button_payload: payload || null,
      });
      addMessage(sid, { from: 'bot', ...res.data });
    } catch {
      addMessage(sid, { from: 'bot', reply_text: "Oops! Something went wrong. Please try again. 😅" });
    } finally {
      setIsTyping(false);
    }
  };

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.product_id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.product_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      }];
    });
    setToast({ visible: true, name: product.name });
  };

  const incrementItem = (id: string) =>
    setCartItems((prev) => prev.map((i) => i.product_id === id ? { ...i, quantity: i.quantity + 1 } : i));

  const decrementItem = (id: string) =>
    setCartItems((prev) =>
      prev.map((i) => i.product_id === id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter((i) => i.quantity > 0)
    );

  const removeItem = (id: string) =>
    setCartItems((prev) => prev.filter((i) => i.product_id !== id));

  const handleSend = () => { if (input.trim()) sendMessage(input.trim()); };

  const handleOptionClick = (label: string, payload: any) => {
    if (payload?.product) { addToCart(payload.product); return; }
    sendMessage(label, 'button', payload);
  };

  const handleSelectChat = (id: string) => {
    setActiveSessionId(id);
    const s = sessions.find((x) => x.id === id);
    setHasStarted(!!s && s.messages.length > 0);
  };

  const lastBotIndex = activeSession
    ? [...activeSession.messages].map((m, i) => m.from === 'bot' ? i : -1).filter(i => i !== -1).at(-1)
    : -1;

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden font-sans">
      {/* Name onboarding modal — shown on first visit */}
      {showNameModal && <NameModal onSave={handleSaveName} />}

      <Sidebar
        onNewChat={createNewSession}
        chatHistory={sessions}
        activeChatId={activeSessionId}
        onSelectChat={handleSelectChat}
      />

      <main className="relative flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-[#f0f4f9] shrink-0">
          <span className="text-base font-semibold text-gray-700 tracking-tight">Beauty Mart</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-600"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowNameModal(true)}
              title="Change your name"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold shadow-sm hover:opacity-90 transition"
            >
              {userName ? userName[0].toUpperCase() : '?'}
            </button>
          </div>
        </header>

        {/* WELCOME STATE */}
        {!hasStarted && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 select-none">
            <div className="fade-up-1 flex items-center gap-2 text-lg text-gray-500 mb-2">
              <Sparkles size={20} className="text-pink-500" />
              <span>Hi {userName || 'there'}</span>
            </div>
            <h1 className="fade-up-2 text-4xl font-semibold text-gray-800 mb-8 tracking-tight text-center">
              Where should we start?
            </h1>
            <div className="fade-up-3 w-full max-w-2xl mb-5">
              <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isTyping} />
            </div>
            <div className="fade-up-4 flex flex-wrap justify-center gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.message)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                >
                  <span>{action.emoji}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT STATE */}
        {hasStarted && (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {activeSession?.messages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    {...msg}
                    onOptionClick={handleOptionClick}
                    isLatest={i === lastBotIndex}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="shrink-0 px-4 pb-5 input-slide-up">
              <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isTyping} />
            </div>
          </>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
      />
      <CartToast
        visible={toast.visible}
        productName={toast.name}
        onHide={() => setToast({ visible: false, name: '' })}
      />
    </div>
  );
}