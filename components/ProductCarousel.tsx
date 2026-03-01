'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  name: string;
  description: string;
  tagline?: string;
  badge?: string;
  price: number;
  image_url: string;
}

interface ProductCarouselProps {
  products: Product[];
  onBuyNow?: (product: Product) => void;
}

// Fixed card dimensions (35% smaller than original 320px)
const CARD_W = 208; // ~320 * 0.65
const IMG_H  = 156; // ~240 * 0.65

export default function ProductCarousel({ products, onBuyNow }: ProductCarouselProps) {
  const [index, setIndex] = useState(0);
  const VISIBLE = 3; // cards visible at once

  const canPrev = index > 0;
  const canNext = index + VISIBLE < products.length;

  const prev = () => canPrev && setIndex(i => i - 1);
  const next = () => canNext && setIndex(i => i + 1);

  const visible = products.slice(index, index + VISIBLE);

  return (
    <div className="relative w-full">
      {/* Cards row */}
      <div className="flex gap-3 items-stretch">
        {visible.map((p, i) => (
          <div
            key={index + i}
            className="shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            style={{ width: CARD_W }}
          >
            {/* Image */}
            <div className="relative shrink-0 bg-gray-100" style={{ height: IMG_H }}>
              {p.badge && (
                <span className="absolute top-2 left-2 z-10 bg-black/75 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {p.badge}
                </span>
              )}
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-3 gap-2">
              <div className="flex-1">
                <p className="font-bold text-[13px] text-gray-900 leading-tight line-clamp-2">
                  {p.name}
                </p>
                {p.tagline && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{p.tagline}</p>
                )}
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                  {p.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[12px] font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full">
                  Rs.{p.price}
                </span>
                <button
                  onClick={() => onBuyNow?.(p)}
                  className="flex items-center gap-1.5 bg-gray-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-gray-700 active:scale-95 transition"
                >
                  Buy Now
                  <span className="flex items-center justify-center bg-white text-gray-900 rounded-full w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder cards to keep row width stable */}
        {visible.length < VISIBLE && Array.from({ length: VISIBLE - visible.length }).map((_, i) => (
          <div key={`ph-${i}`} style={{ width: CARD_W }} className="shrink-0" />
        ))}
      </div>

      {/* Arrow buttons — only show if more than VISIBLE cards */}
      {products.length > VISIBLE && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={prev}
            disabled={!canPrev}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition
              ${canPrev
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition
              ${canNext
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'}`}
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1 ml-1">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(Math.min(i, products.length - VISIBLE))}
                className={`rounded-full transition-all ${
                  i >= index && i < index + VISIBLE
                    ? 'w-4 h-1.5 bg-gray-800'
                    : 'w-1.5 h-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}