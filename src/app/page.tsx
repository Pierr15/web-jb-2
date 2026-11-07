import { Navbar, Footer } from '@/components/navigation';
import { ProductCard } from '@/components/product-card';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-data';
import { Cpu, CircuitBoard, Layers, ShieldCheck, Truck, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featured = INITIAL_PRODUCTS.filter((p) => p.is_featured);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14]">
      <Navbar />

      <main className="flex-1">
        {/* Technical Blueprint Hero */}
        <section className="relative border-b border-[#243046] bg-[#0E131E] py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#182030] border border-[#243046] text-xs font-mono text-slate-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>BLUE COMPUTER HARDWARE LAB • VERIFIED DISTRIBUTOR</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-white uppercase leading-tight">
                High-Performance Computing & Peripheral Systems
              </h1>

              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
                Menyediakan komponen PC enthusiast, workstation AI/render, serta peripheral presisi kompetitif. Bergaransi resmi dengan dukungan integrasi Midtrans Sandbox.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
                <Link
                  href="/catalog"
                  className="px-5 py-3 rounded bg-[#0055FF] hover:bg-[#2B72FF] text-white font-semibold transition-colors flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  Eksplorasi Katalog
                </Link>
                <Link
                  href="/admin"
                  className="px-5 py-3 rounded bg-[#182030] hover:bg-[#243046] border border-[#243046] text-slate-200 transition-colors flex items-center gap-2"
                >
                  Portal Manajemen (Owner & Staff)
                </Link>
              </div>
            </div>

            {/* Technical Trust Strip */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#243046]/80 pt-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div className="text-xs font-mono">
                  <div className="text-white font-semibold">100% Garansi Resmi</div>
                  <div className="text-slate-400">Distributor resmi Indonesia</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div className="text-xs font-mono">
                  <div className="text-white font-semibold">Packing Kayu & Asuransi</div>
                  <div className="text-slate-400">Aman untuk GPU & Monitor besar</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-[#0055FF] shrink-0" />
                <div className="text-xs font-mono">
                  <div className="text-white font-semibold">Test Bench Quality Control</div>
                  <div className="text-slate-400">Verifikasi BIOS & stress test gratis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Components Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#243046]">
            <div>
              <div className="text-xs font-mono text-[#0055FF] uppercase tracking-widest">
                Tier-1 Hardware
              </div>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-white mt-0.5">
                Komponen Unggulan
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories Quick Navigation */}
        <section className="py-10 border-t border-[#243046] bg-[#0E131E]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
              Navigasi Kategori Spesifik
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: 'Processor', icon: Cpu, href: '/catalog?cat=processors' },
                { name: 'VGA / GPU', icon: CircuitBoard, href: '/catalog?cat=graphics-cards' },
                { name: 'Motherboard', icon: Layers, href: '/catalog?cat=motherboards' },
                { name: 'Memory RAM', icon: Cpu, href: '/catalog?cat=memory' },
                { name: 'Storage SSD', icon: Layers, href: '/catalog?cat=storage' },
                { name: 'Aksesoris', icon: CircuitBoard, href: '/catalog?cat=accessories' },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.name}
                    href={c.href}
                    className="p-3 rounded bg-[#111622] hover:bg-[#182030] border border-[#243046] hover:border-[#0055FF]/60 flex flex-col items-center gap-2 text-center transition-all group"
                  >
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#0055FF] transition-colors" />
                    <span className="text-xs font-mono text-slate-200 group-hover:text-white">{c.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
