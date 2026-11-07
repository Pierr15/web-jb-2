'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { ShoppingBag, ShieldCheck, Terminal, Cpu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#243046] bg-[#0A0D14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded border border-[#0055FF]/40 bg-[#0055FF]/10 flex items-center justify-center text-[#0055FF] group-hover:border-[#0055FF] transition-colors">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-tight text-white text-base leading-none">
              BLUE<span className="text-[#0055FF]">_</span>COMPUTER
            </span>
            <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
              Hardware Lab
            </span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari part number, socket, chipset..."
              className="w-full bg-[#111622] border border-[#243046] focus:border-[#0055FF] text-xs font-mono text-slate-200 placeholder:text-slate-500 rounded pl-9 pr-4 py-2 outline-none transition-colors"
            />
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="hidden sm:inline-flex text-xs font-mono px-3 py-1.5 text-slate-300 hover:text-white hover:bg-[#182030] rounded border border-transparent hover:border-[#243046] transition-all"
          >
            Katalog Hardware
          </Link>
          <Link
            href="/admin"
            className="text-xs font-mono px-3 py-1.5 text-slate-300 hover:text-white hover:bg-[#182030] rounded border border-[#243046] inline-flex items-center gap-1.5 transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-[#0055FF]" />
            <span>Staff Portal</span>
          </Link>
          <Link
            href="/cart"
            className="relative p-2 text-slate-300 hover:text-white bg-[#111622] hover:bg-[#182030] border border-[#243046] hover:border-[#0055FF]/50 rounded transition-all"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0055FF] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#243046] bg-[#0A0D14] text-slate-400 text-xs font-mono mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Garansi Distributor Resmi Indonesia • 100% Original Brand Certified</span>
        </div>
        <div className="text-slate-500">
          © 2026 Blue Computer. Midtrans Sandbox Verified.
        </div>
      </div>
    </footer>
  );
}
