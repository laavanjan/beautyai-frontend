// components/ProductDetailView.tsx
'use client';

import { Sparkles, Package, Droplets, Leaf, Star } from 'lucide-react';

interface Product {
  product_id: string;
  name: string;
  brand: string;
  image_url: string;
  price: number;
  description?: string;
  how_to_use?: string;
  key_ingredients?: string[];
  attributes?: {
    hair_types?: string[];
    concerns?: string[];
    texture?: string;
  };
  ranking_signals?: {
    rating?: number;
    review_count?: number;
    purchase_count?: number;
  };
}

interface ProductDetailViewProps {
  product: Product;
  complementaryProducts?: Product[];
  onBuyNow: (product: Product) => void;
  onOptionClick?: (label: string, payload: any) => void;
}

export default function ProductDetailView({
  product,
  complementaryProducts = [],
  onBuyNow,
  onOptionClick
}: ProductDetailViewProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Hero Section with Image */}
      <div className="relative h-64 bg-gradient-to-br from-pink-50 to-rose-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
        {product.ranking_signals?.rating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{product.ranking_signals.rating}</span>
            <span className="text-xs text-gray-500">({product.ranking_signals.review_count})</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
        </div>

        {/* Price and Buy */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">Rs.{product.price}</span>
          <button
            onClick={() => onBuyNow(product)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition"
          >
            Buy Now
          </button>
        </div>

        {/* Description */}
        {product.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Sparkles size={16} className="text-pink-500" />
              Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* How to Use */}
        {product.how_to_use && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Droplets size={16} className="text-blue-500" />
              How to Use
            </h3>
            <p className="text-sm text-gray-600">{product.how_to_use}</p>
          </div>
        )}

        {/* Key Ingredients */}
        {product.key_ingredients && product.key_ingredients.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Leaf size={16} className="text-green-500" />
              Key Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.key_ingredients.map((ingredient, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attributes */}
        {product.attributes && (
          <div className="space-y-2">
            {product.attributes.hair_types && product.attributes.hair_types.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Best for: </span>
                <span className="text-xs text-gray-700">
                  {product.attributes.hair_types.join(' • ')}
                </span>
              </div>
            )}
            {product.attributes.concerns && product.attributes.concerns.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Targets: </span>
                <span className="text-xs text-gray-700">
                  {product.attributes.concerns.slice(0, 4).join(' • ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Complementary Products */}
        {complementaryProducts.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">You might also need</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {complementaryProducts.map((comp) => (
                <button
                  key={comp.product_id}
                  onClick={() => onOptionClick?.(`Tell me more about ${comp.name}`, { 
                    slot: "_text", 
                    value: `Tell me more about ${comp.name}` 
                  })}
                  className="shrink-0 w-32"
                >
                  <div className="bg-gray-50 rounded-lg p-2">
                    <img
                      src={comp.image_url}
                      alt={comp.name}
                      className="w-full h-20 object-contain mb-2"
                    />
                    <p className="text-xs font-medium text-gray-700 line-clamp-2">
                      {comp.name}
                    </p>
                    <p className="text-xs font-bold text-gray-900 mt-1">Rs.{comp.price}</p>
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