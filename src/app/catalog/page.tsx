'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components/navigation';
import { ProductCard } from '@/components/product-card';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-data';
import { Filter, SlidersHorizontal, Check } from 'lucide-react';

export default function CatalogPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const brands = ['All', ...Array.from(new Set(INITIAL_PRODUCTS.map((p) => p.brand)))];

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#243046] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#0055FF] uppercase tracking-wider">
              Inventory & Hardware Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
              Katalog Komponen & Aksesoris
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Menampilkan <span className="text-white font-bold">{filteredProducts.length}</span> SKU produk aktif
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Faceted Filter Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[#111622] border border-[#243046] rounded p-4">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#1C2638] text-xs font-mono text-slate-300 font-semibold uppercase">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0055FF]" />
                Filter Pencarian
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                    Pencarian Cepat
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nama produk, SKU..."
                    className="w-full bg-[#0A0D14] border border-[#243046] focus:border-[#0055FF] text-xs font-mono text-slate-200 placeholder:text-slate-600 rounded px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-2 uppercase">
                    Brand / Manufaktur
                  </label>
                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                          selectedBrand === brand
                            ? 'bg-[#0055FF] text-white font-medium'
                            : 'text-slate-300 hover:bg-[#182030] hover:text-white'
                        }`}
                      >
                        <span>{brand}</span>
                        {selectedBrand === brand && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#111622] border border-[#243046] rounded p-12 text-center">
                <Filter className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h3 className="text-sm font-mono text-slate-300 uppercase font-semibold">Tidak Ada Produk Sesuai Filter</h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">Coba ubah kata kunci atau pilih manufaktur lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
