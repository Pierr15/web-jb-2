'use client';

import { useState } from 'react';
import { Product } from '@/types/database';
import { useCartStore } from '@/lib/store/cart';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export function AddToCartButton({
  product,
  disabled,
}: {
  product: Product;
  disabled?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} dimasukkan ke keranjang`, {
      description: `SKU: ${product.sku}`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center border border-[#243046] bg-[#111622] rounded font-mono text-sm">
        <button
          type="button"
          disabled={disabled || quantity <= 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-3 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="px-4 text-center text-white font-bold w-12">{quantity}</span>
        <button
          type="button"
          disabled={disabled || quantity >= product.stock_quantity}
          onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
          className="px-3 py-3 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="flex-1 py-3 px-6 rounded bg-[#0055FF] hover:bg-[#2B72FF] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        {disabled ? 'Stok Tidak Tersedia' : 'Tambahkan ke Keranjang'}
      </button>
    </div>
  );
}
