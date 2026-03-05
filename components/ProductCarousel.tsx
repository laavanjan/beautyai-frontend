// components/ProductCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
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

// Responsive card width - using percentage of container with min/max
const CARD_WIDTH = {
  base: 180, // mobile
  sm: 200,   // small tablet
  md: 220,   // desktop
};

const GAP = 12; // gap-3 = 12px

export default function ProductCarousel({ products, onBuyNow }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH.base);

  // Update card width based on container size
  useEffect(() => {
    const updateCardWidth = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCardWidth(CARD_WIDTH.md);
      else if (width >= 640) setCardWidth(CARD_WIDTH.sm);
      else setCardWidth(CARD_WIDTH.base);
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Calculate max container width to prevent overflow
  const maxContainerWidth = cardWidth * 3 + GAP * 2; // 3 cards + gaps

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* Left Arrow - positioned absolutely within container */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all opacity-80 hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all opacity-80 hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product, idx) => (
          <div
            key={idx}
            className="shrink-0 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
            style={{ width: `${cardWidth}px` }}
          >
            {/* Image - fixed aspect ratio */}
            <div className="relative shrink-0 bg-gray-100" style={{ height: cardWidth * 0.75 }}> {/* 4:3 aspect ratio */}
              {product.badge && (
                <span className="absolute top-1.5 left-1.5 z-10 bg-black/75 text-white text-[8px] sm:text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content - compact padding */}
            <div className="flex flex-col flex-1 p-2 sm:p-3 gap-1.5 sm:gap-2">
              <div className="flex-1">
                <p className="font-bold text-[11px] sm:text-[13px] text-gray-900 leading-tight line-clamp-2">
                  {product.name}
                </p>
                {product.tagline && (
                  <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5 truncate">{product.tagline}</p>
                )}
                <p className="text-[9px] sm:text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                  {product.description}
                </p>
              </div>

              {/* Footer - compact layout */}
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <span className="text-[10px] sm:text-[12px] font-bold text-gray-900 bg-gray-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  ₹{product.price}
                </span>
                <button
                  onClick={() => onBuyNow?.(product)}
                  className="flex items-center gap-1 bg-gray-900 text-white text-[9px] sm:text-[11px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-700 active:scale-95 transition whitespace-nowrap"
                >
                  Buy Now
                  <span className="flex items-center justify-center bg-white text-gray-900 rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="8" height="8" className="sm:w-[10px] sm:h-[10px]">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator dots - only show if more than 3 cards */}
      {products.length > 3 && (
        <div className="flex justify-center gap-1 mt-2 lg:hidden">
          {products.map((_, idx) => {
            // Calculate which dot should be active based on scroll position
            const isActive = idx === 0; // This should be dynamic based on scroll
            return (
              <button
                key={idx}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    container.scrollTo({
                      left: idx * (cardWidth + GAP),
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`h-1 rounded-full transition-all ${
                  isActive ? 'w-4 bg-gray-800' : 'w-1 bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}