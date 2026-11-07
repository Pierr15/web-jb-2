"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart, Check, Zap } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name.slice(0, 30)}... ditambahkan ke keranjang`, {
      description: `SKU: ${product.sku} • ${formatRupiah(product.base_price)}`,
    });
  };

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="group flex flex-col bg-[#111622] border border-[#243046] hover:border-[#0055FF]/70 transition-colors duration-150 rounded overflow-hidden">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-video w-full bg-[#0E131D] overflow-hidden"
      >
        <Image
          src={
            product.images[0] ||
            "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0D14]/90 border border-[#243046] text-slate-200 font-semibold uppercase">
            {product.brand}
          </span>
          {product.is_featured && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0055FF]/20 border border-[#0055FF]/50 text-[#60A5FA] flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-[#0055FF]" /> Top Pick
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-mono text-[11px] text-slate-400 mb-1 tracking-wider uppercase">
            {product.sku}
          </div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-sans font-semibold text-sm text-slate-100 hover:text-[#0055FF] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Quick Technical Specs Grid */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 pt-2 border-t border-[#1C2638] text-[11px] font-mono">
            {Object.entries(product.technical_specs || {})
              .slice(0, 2)
              .map(([key, val]) => (
                <div
                  key={key}
                  className="bg-[#182030]/60 px-2 py-1 rounded border border-[#243046]/50"
                >
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                    {key.replace("_", " ")}
                  </span>
                  <span className="text-slate-200 font-medium truncate block">
                    {val}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1C2638] flex items-center justify-between gap-2">
          <div>
            <div className="font-mono font-bold text-base text-slate-100">
              {formatRupiah(product.base_price)}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isOutOfStock ? (
                <span className="text-[10px] font-mono text-[#EF4444]">
                  Stok Habis
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] font-mono text-[#F59E0B]">
                  Sisa {product.stock_quantity} unit
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Ready Stock
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="p-2.5 rounded bg-[#0055FF] hover:bg-[#2B72FF] disabled:bg-slate-700 disabled:cursor-not-allowed text-white transition-colors duration-150"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
