'use client';

import { useEffect } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

interface CartToastProps {
  visible: boolean;
  productName: string;
  onHide: () => void;
}

export default function CartToast({ visible, productName, onHide }: CartToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, 2500);
    return () => clearTimeout(t);
  }, [visible, onHide]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white
        px-4 py-3 rounded-2xl shadow-xl text-sm font-medium
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}
    >
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <Check size={12} strokeWidth={3} />
      </div>
      <span className="max-w-[200px] truncate">{productName}</span>
      <span className="text-gray-400">added to cart</span>
    </div>
  );
}