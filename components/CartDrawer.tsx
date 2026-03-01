'use client';

import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartDrawer({
  open,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onRemove,
}: CartDrawerProps) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] bg-white z-50 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gray-700" />
            <span className="font-semibold text-gray-800 text-base">My Cart</span>
            {items.length > 0 && (
              <span className="text-xs bg-pink-500 text-white rounded-full px-2 py-0.5 font-medium">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product_id} className="flex gap-3 bg-gray-50 rounded-2xl p-3">
                {/* Image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">Rs.{item.price}</p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onDecrement(item.product_id)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onIncrement(item.product_id)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemove(item.product_id)}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-400 text-gray-400 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">Rs.{total.toLocaleString()}</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-gray-700 transition active:scale-95">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}