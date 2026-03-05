'use client';

import { Sparkles, ChevronRight, Star, Package, Droplets, Leaf, ShieldCheck } from 'lucide-react';
import ProductCarousel from './ProductCarousel';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Product {
  product_id?: string;
  name: string;
  description?: string;
  tagline?: string;
  badge?: string;
  brand?: string;
  price: number;
  image_url: string;
}

interface ProductAttributes {
  skin_types?: string[];
  hair_types?: string[];
  concerns?: string[];
  texture?: string;
  free_from?: string[];
}

interface ProductDetail extends Product {
  how_to_use?: string;
  key_ingredients?: string[];
  attributes?: ProductAttributes;
  ranking_signals?: {
    rating?: number;
    review_count?: number;
    purchase_count?: number;
  };
  in_stock?: boolean;
}

interface RoutineStep {
  step_number: number;
  routine_step: string;
  step_name: string;
  purpose: string;
  product: Product;
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
  routine?: RoutineStep[];
  show_product_detail?: boolean;
  product_detail?: ProductDetail;
  complementary_products?: Product[];
  suggested_options?: SuggestedOption[];
  onOptionClick?: (label: string, payload: any) => void;
  onBuyNow?: (product: Product) => void;
  isLatest?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN PARSER
// ─────────────────────────────────────────────────────────────────────────────

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs font-mono">$1</code>');
}

function parseMarkdown(text: string): string {
  const lines = text.split('\n');
  const output: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^---+$/.test(trimmed)) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push('<hr class="border-gray-100 my-2"/>');
      continue;
    }

    const bulletMatch = line.match(/^([•\-→·])\s+(.+)$/);
    if (bulletMatch) {
      if (!inList) {
        output.push('<ul class="list-disc ml-5 my-1.5 space-y-0.5">');
        inList = true;
      }
      output.push(`<li class="leading-snug text-gray-800">${applyInline(bulletMatch[2])}</li>`);
      continue;
    }

    if (inList) { output.push('</ul>'); inList = false; }

    if (trimmed === '') {
      output.push('<div class="h-1.5"></div>');
      continue;
    }

    output.push(`<p class="leading-relaxed">${applyInline(line)}</p>`);
  }

  if (inList) output.push('</ul>');
  return output.join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTINE CARD
// One step in the routine — step number, name, purpose, product
// ─────────────────────────────────────────────────────────────────────────────

function RoutineCard({
  step,
  onBuyNow,
  onDetailClick,
}: {
  step: RoutineStep;
  onBuyNow?: (product: Product) => void;
  onDetailClick?: (productName: string) => void;
}) {
  const p = step.product;
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Step number badge */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{step.step_number}</span>
        </div>
        {/* vertical connector line — hidden on last card via CSS in parent */}
        <div className="w-px flex-1 bg-gray-100 min-h-[16px]" />
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide">{step.step_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{step.purpose}</p>
        </div>

        {/* Product row */}
        <div className="flex gap-3 items-center bg-gray-50 rounded-lg p-2">
          <img
            src={p.image_url}
            alt={p.name}
            className="w-14 h-14 object-contain rounded-md bg-white shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">{p.brand}</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{p.name}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">Rs.{p.price.toLocaleString()}</p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => onBuyNow?.(p)}
              className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-700 transition"
            >
              Add
            </button>
            <button
              onClick={() => onDetailClick?.(`Tell me more about the ${p.name}.`)}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-50 transition"
            >
              Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL VIEW
// Full breakdown: image, description, how-to-use, ingredients, best-for, free-from
// ─────────────────────────────────────────────────────────────────────────────

function ProductDetailView({
  product,
  complementary = [],
  onBuyNow,
  onOptionClick,
}: {
  product: ProductDetail;
  complementary?: Product[];
  onBuyNow?: (product: Product) => void;
  onOptionClick?: (label: string, payload: any) => void;
}) {
  const attrs = product.attributes || {};
  const typeList = [...(attrs.skin_types || []), ...(attrs.hair_types || [])];
  const rating = product.ranking_signals?.rating;
  const reviewCount = product.ranking_signals?.review_count;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 w-full">
      {/* Hero image */}
      <div className="relative h-56 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-contain p-4"
        />
        {rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{rating}</span>
            {reviewCount && <span className="text-xs text-gray-400">({reviewCount})</span>}
          </div>
        )}
        {product.in_stock === false && (
          <div className="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Name, brand, price, buy */}
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
          <h2 className="text-base font-bold text-gray-900 leading-snug">{product.name}</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Rs.{product.price.toLocaleString()}</span>
          <button
            onClick={() => onBuyNow?.(product)}
            disabled={product.in_stock === false}
            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>

        {/* Description */}
        {product.description && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles size={13} className="text-pink-400" /> Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* How to use */}
        {product.how_to_use && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Droplets size={13} className="text-blue-400" /> How to Use
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.how_to_use}</p>
          </div>
        )}

        {/* Key ingredients */}
        {product.key_ingredients && product.key_ingredients.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Leaf size={13} className="text-green-500" /> Key Ingredients
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.key_ingredients.map((ing, i) => (
                <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Best for + targets */}
        {(typeList.length > 0 || (attrs.concerns || []).length > 0) && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Package size={13} className="text-purple-400" /> Best For
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {typeList.map((t, i) => (
                <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-100">
                  {t}
                </span>
              ))}
              {(attrs.concerns || []).slice(0, 4).map((c, i) => (
                <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Free from */}
        {attrs.free_from && attrs.free_from.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-500" /> Free From
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {attrs.free_from.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100">
                  {tag.replace(/_/g, '-')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Complementary products */}
        {complementary.length > 0 && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">You might also need</h3>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {complementary.map((comp) => (
                <button
                  key={comp.product_id || comp.name}
                  onClick={() => onOptionClick?.(
                    `Tell me more about the ${comp.name}.`,
                    { slot: '_text', value: `Tell me more about the ${comp.name}.` }
                  )}
                  className="shrink-0 w-28 text-left"
                >
                  <div className="bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition">
                    <img
                      src={comp.image_url}
                      alt={comp.name}
                      className="w-full h-16 object-contain mb-1.5"
                    />
                    <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{comp.name}</p>
                    <p className="text-xs font-bold text-gray-900 mt-1">Rs.{comp.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE — main export
// ─────────────────────────────────────────────────────────────────────────────

const CAT_EMOJI: Record<string, string> = {
  Face: '✨', Hair: '💆', Body: '🧴', Baby: '🍼',
};

export default function MessageBubble({
  from,
  text,
  reply_text,
  products,
  product_groups,
  routine,
  show_product_detail,
  product_detail,
  complementary_products,
  suggested_options,
  onOptionClick,
  onBuyNow,
  isLatest = false,
}: MessageBubbleProps) {
  // ── User bubble ─────────────────────────────────────────────────────────────
  if (from === 'user') {
    return (
      <div className="flex justify-end msg-animate">
        <div className="max-w-[70%] bg-[#e8f0fe] text-gray-800 px-4 py-3 rounded-2xl rounded-br-md text-sm leading-relaxed">
          {text}
        </div>
      </div>
    );
  }

  // ── Bot bubble ──────────────────────────────────────────────────────────────
  return (
    <div className="flex items-start gap-3 msg-animate">
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
        <Sparkles size={14} className="text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">

        {/* Reply text */}
        {reply_text && (
          <div
            className="text-sm text-gray-800 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_hr]:border-gray-100 [&_hr]:my-2"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(reply_text) }}
          />
        )}

        {/* ── Product Detail View ──────────────────────────────────────────── */}
        {show_product_detail && product_detail && (
          <ProductDetailView
            product={product_detail}
            complementary={complementary_products || []}
            onBuyNow={onBuyNow}
            onOptionClick={onOptionClick}
          />
        )}

        {/* ── Routine Steps ────────────────────────────────────────────────── */}
        {!show_product_detail && routine && routine.length > 0 && (
          <div className="space-y-2 w-full">
            {routine.map((step, idx) => (
              <div key={step.step_number} className={idx === routine.length - 1 ? '[&_.connector]:hidden' : ''}>
                <RoutineCard
                  step={step}
                  onBuyNow={onBuyNow}
                  onDetailClick={(label) => onOptionClick?.(label, { slot: '_text', value: label })}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Grouped products ─────────────────────────────────────────────── */}
        {!show_product_detail && product_groups && product_groups.length > 0 && (
          <div className="space-y-6 w-full max-w-full">
            {product_groups.map((group) => (
              <div key={group.category} className="space-y-2 w-full">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-base">{CAT_EMOJI[group.category] ?? '🛍️'}</span>
                  <span className="text-sm font-semibold text-gray-700">{group.category}</span>
                  <div className="flex-1 h-px bg-gray-200 ml-1" />
                </div>
                <div className="w-full overflow-hidden">
                  <ProductCarousel
                    products={group.products}
                    onBuyNow={(p) => onBuyNow?.(p)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Flat product carousel ─────────────────────────────────────────── */}
        {!show_product_detail &&
          (!product_groups || product_groups.length === 0) &&
          products && products.length > 0 && (
          <div className="w-full overflow-hidden">
            <ProductCarousel
              products={products}
              onBuyNow={(p) => onBuyNow?.(p)}
            />
          </div>
        )}

        {/* ── Suggested option buttons ─────────────────────────────────────── */}
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