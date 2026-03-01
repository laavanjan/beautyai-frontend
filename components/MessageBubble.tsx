'use client';

import { Sparkles } from 'lucide-react';
import ProductCarousel from './ProductCarousel';

interface Product {
  name: string;
  description: string;
  tagline?: string;
  badge?: string;
  brand?: string;
  price: number;
  image_url: string;
}

interface SuggestedOption {
  label: string;
  payload: any;
}

interface ProductGroup {
  category: string;
  products: Product[];
}

interface MessageBubbleProps {
  from: 'user' | 'bot';
  text?: string;
  reply_text?: string;
  products?: Product[];
  product_groups?: ProductGroup[];
  suggested_options?: SuggestedOption[];
  onOptionClick?: (label: string, payload: any) => void;
  isLatest?: boolean;
}

// ─── Inline formatting (bold, italic, code) ───────────────────────────────────
function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs font-mono">$1</code>');
}

// ─── Full markdown parser ─────────────────────────────────────────────────────
// Key fix: consecutive bullet lines are grouped into ONE <ul> — no gaps between items.
// Previously each bullet got its own <ul> which caused large spacing.
function parseMarkdown(text: string): string {
  const lines = text.split('\n');
  const output: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Horizontal rule ---
    if (/^---+$/.test(trimmed)) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push('<hr class="border-gray-100 my-2"/>');
      continue;
    }

    // Bullet line — supports: •  -  →  ·
    const bulletMatch = line.match(/^([•\-→·])\s+(.+)$/);
    if (bulletMatch) {
      // Open <ul> only once for consecutive bullets
      if (!inList) {
        output.push('<ul class="list-disc ml-5 my-1.5 space-y-0.5">');
        inList = true;
      }
      output.push(`<li class="leading-snug text-gray-800">${applyInline(bulletMatch[2])}</li>`);
      continue;
    }

    // Non-bullet — close list if one was open
    if (inList) {
      output.push('</ul>');
      inList = false;
    }

    // Blank line → tiny spacer (not a big <br/> gap)
    if (trimmed === '') {
      output.push('<div class="h-1.5"></div>');
      continue;
    }

    // Normal paragraph line
    output.push(`<p class="leading-relaxed">${applyInline(line)}</p>`);
  }

  // Close any unclosed list
  if (inList) output.push('</ul>');

  return output.join('');
}

export default function MessageBubble({
  from,
  text,
  reply_text,
  products,
  product_groups,
  suggested_options,
  onOptionClick,
  isLatest = false,
}: MessageBubbleProps) {
  if (from === 'user') {
    return (
      <div className="flex justify-end msg-animate">
        <div className="max-w-[70%] bg-[#e8f0fe] text-gray-800 px-4 py-3 rounded-2xl rounded-br-md text-sm leading-relaxed">
          {text}
        </div>
      </div>
    );
  }

  // Category emoji map for grouped view
  const CAT_EMOJI: Record<string, string> = {
    Face: '✨', Hair: '💆', Body: '🧴', Baby: '🍼',
  };

  return (
    <div className="flex items-start gap-3 msg-animate">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
        <Sparkles size={14} className="text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {reply_text && (
          <div
            className="text-sm text-gray-800 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_hr]:border-gray-100 [&_hr]:my-2"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(reply_text) }}
          />
        )}

        {/* Grouped products — Best Sellers / Budget Picks */}
        {product_groups && product_groups.length > 0 && (
          <div className="space-y-4">
            {product_groups.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">{CAT_EMOJI[group.category] ?? '🛍️'}</span>
                  <span className="text-sm font-semibold text-gray-700">{group.category}</span>
                  <div className="flex-1 h-px bg-gray-200 ml-1" />
                </div>
                <ProductCarousel
                  products={group.products}
                  onBuyNow={(p) => onOptionClick?.(`Buy ${p.name}`, { product: p })}
                />
              </div>
            ))}
          </div>
        )}

        {/* Normal (flat) product list */}
        {(!product_groups || product_groups.length === 0) && products && products.length > 0 && (
          <ProductCarousel
            products={products}
            onBuyNow={(p) => onOptionClick?.(`Buy ${p.name}`, { product: p })}
          />
        )}

        {isLatest && suggested_options && suggested_options.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggested_options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onOptionClick?.(opt.label, opt.payload)}
                className="px-3.5 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}