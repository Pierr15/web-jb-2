import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/navigation';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-data';
import { formatRupiah } from '@/lib/utils';
import { ShieldCheck, Truck, Check, ArrowLeft } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Image Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 w-full bg-[#0E131D] border border-[#243046] rounded overflow-hidden">
              <Image
                src={product.images[0] || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800'}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#111622] border border-[#243046] rounded text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Garansi Resmi</span>
                <span className="text-xs font-mono font-bold text-white">{product.warranty_months} Bulan</span>
              </div>
              <div className="p-3 bg-[#111622] border border-[#243046] rounded text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Brand Origin</span>
                <span className="text-xs font-mono font-bold text-white">{product.brand}</span>
              </div>
              <div className="p-3 bg-[#111622] border border-[#243046] rounded text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Kondisi</span>
                <span className="text-xs font-mono font-bold text-[#10B981]">100% Baru & Segel</span>
              </div>
            </div>
          </div>

          {/* Product Information & Purchase Area */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-[#182030] border border-[#243046] text-slate-300 uppercase">
                  {product.brand}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 p-4 rounded bg-[#111622] border border-[#243046] flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 block uppercase">Harga Retail Resmi</span>
                  <div className="text-3xl font-mono font-bold text-white mt-0.5">
                    {formatRupiah(product.base_price)}
                  </div>
                </div>
                <div>
                  {isOutOfStock ? (
                    <span className="text-xs font-mono text-[#EF4444] font-semibold">Stok Habis</span>
                  ) : isLowStock ? (
                    <span className="text-xs font-mono text-[#F59E0B] font-semibold">Tersisa {product.stock_quantity} Unit</span>
                  ) : (
                    <span className="text-xs font-mono text-[#10B981] font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Tersedia ({product.stock_quantity} Unit)
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Deskripsi Perangkat
                </h2>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Blueprint Specifications Table */}
              <div className="mt-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Spesifikasi Teknis (Technical Matrix)
                </h2>
                <div className="border border-[#243046] rounded overflow-hidden text-xs font-mono">
                  {Object.entries(product.technical_specs || {}).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-3 p-2.5 ${
                        idx % 2 === 0 ? 'bg-[#111622]' : 'bg-[#0E131D]'
                      } border-b border-[#1C2638] last:border-b-0`}
                    >
                      <span className="text-slate-400 uppercase tracking-wider">{key.replace('_', ' ')}</span>
                      <span className="col-span-2 text-slate-200 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-[#243046] space-y-4">
              <AddToCartButton product={product} disabled={isOutOfStock} />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0055FF]" /> Proteksi Kerusakan Pengiriman
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#10B981]" /> Ekspedisi Terlacak
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
