'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/navigation';
import { useCartStore } from '@/lib/store/cart';
import { formatRupiah } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { items, removeItem, updateQuantity, clearCart, getTotalAmount } = useCartStore();

  const [customer, setCustomer] = useState({
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan, 12190',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = getTotalAmount();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerDetails: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          },
          shippingAddress: customer.address,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Gagal memproses checkout Midtrans');
      }

      // Check if Midtrans Snap popup is loaded
      if (window.snap && data.token !== 'DUMMY_SNAP_TOKEN_SANDBOX') {
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            toast.success('Pembayaran Midtrans Berhasil!');
            clearCart();
          },
          onPending: (result) => {
            toast.info('Menunggu pembayaran diselesaikan.');
          },
          onError: (err) => {
            toast.error('Pembayaran gagal atau dibatalkan.');
          },
          onClose: () => {
            toast.warning('Jendela pembayaran ditutup sebelum transaksi selesai.');
          },
        });
      } else {
        // Fallback for Sandbox simulation without live keys
        toast.success(`[Simulasi Midtrans Sandbox] Token: ${data.token}`, {
          description: `Order ${data.orderNumber} berhasil dicatat. Status: Menunggu Settlement.`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 pb-4 border-b border-[#243046]">
          <div className="text-xs font-mono text-[#0055FF] uppercase tracking-wider">
            Checkout Terminal
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            Keranjang Belanja & Pembayaran
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#111622] border border-[#243046] rounded p-12 text-center max-w-lg mx-auto">
            <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h2 className="text-base font-mono font-bold text-white uppercase">
              Keranjang Masih Kosong
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1 mb-6">
              Pilih komponen hardware atau aksesoris komputer dari katalog.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#0055FF] hover:bg-[#2B72FF] text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Lihat Katalog Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-[#1C2638]">
                <span>Daftar Komponen ({items.length} item)</span>
                <button
                  onClick={clearCart}
                  className="hover:text-[#EF4444] transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-4 rounded bg-[#111622] border border-[#243046] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-[#0A0D14] border border-[#1C2638] shrink-0">
                      <Image
                        src={product.images[0] || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        {product.sku}
                      </div>
                      <h3 className="text-xs font-mono font-bold text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-xs font-mono text-slate-300 mt-0.5">
                        {formatRupiah(product.base_price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center border border-[#243046] bg-[#0A0D14] rounded font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-white font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-mono font-bold text-white min-w-24 text-right">
                      {formatRupiah(product.base_price * quantity)}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-slate-500 hover:text-[#EF4444] transition-colors p-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout & Delivery Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleCheckout}
                className="bg-[#111622] border border-[#243046] rounded p-6 space-y-4"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-[#1C2638] text-xs font-mono text-white uppercase font-bold">
                  <CreditCard className="w-4 h-4 text-[#0055FF]" />
                  Informasi Pengiriman & Pembayaran
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                    Nama Lengkap Penerima
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#243046] focus:border-[#0055FF] text-xs font-mono text-slate-200 rounded px-3 py-2 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-[#0A0D14] border border-[#243046] focus:border-[#0055FF] text-xs font-mono text-slate-200 rounded px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                      No. WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-[#0A0D14] border border-[#243046] focus:border-[#0055FF] text-xs font-mono text-slate-200 rounded px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                    Alamat Lengkap Pengiriman
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-[#0A0D14] border border-[#243046] focus:border-[#0055FF] text-xs font-mono text-slate-200 rounded px-3 py-2 outline-none"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-[#1C2638] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal Produk</span>
                    <span>{formatRupiah(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Ongkir & Packing Kayu</span>
                    <span className="text-[#10B981]">GRATIS (Promo)</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-[#1C2638]">
                    <span>Total Pembayaran</span>
                    <span className="text-[#0055FF]">{formatRupiah(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded bg-[#0055FF] hover:bg-[#2B72FF] disabled:bg-slate-700 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-colors duration-150"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Memproses Midtrans...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang via Midtrans <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-[11px] font-mono text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Sandbox Gateway: QRIS, VA BCA/Mandiri, Kartu Kredit</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
