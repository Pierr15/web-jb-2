'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-data';
import { formatRupiah } from '@/lib/utils';
import {
  Package,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  Edit,
  Shield,
  BarChart3,
  ExternalLink,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPortalPage() {
  const [activeRole, setActiveRole] = useState<'owner' | 'employee'>('owner');
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'team'>('orders');

  const [orders, setOrders] = useState([
    {
      id: 'ord-101',
      order_number: 'BC-84920194-201',
      customer_name: 'David Surya',
      customer_phone: '081298817261',
      total_amount: 18450000,
      status: 'paid',
      items_summary: '1x NVIDIA GeForce RTX 4080 SUPER 16GB',
      tracking_number: '',
      created_at: '2026-11-07 11:20',
    },
    {
      id: 'ord-102',
      order_number: 'BC-84920202-392',
      customer_name: 'Rian Pratama',
      customer_phone: '085719283741',
      total_amount: 6499000,
      status: 'processing',
      items_summary: '1x AMD Ryzen 7 7800X3D Processor',
      tracking_number: 'JNE-REG-84729104',
      created_at: '2026-11-07 10:45',
    },
    {
      id: 'ord-103',
      order_number: 'BC-84920215-581',
      customer_name: 'Anita Kusuma',
      customer_phone: '087819283719',
      total_amount: 3750000,
      status: 'pending',
      items_summary: '1x Wooting 60HE+ Analog Keyboard',
      tracking_number: '',
      created_at: '2026-11-07 09:15',
    },
  ]);

  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Status pesanan diperbarui menjadi: ${newStatus.toUpperCase()}`);
  };

  const handleUpdateTracking = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNumber, status: 'shipped' } : o))
    );
    toast.success(`No. Resi pengiriman disimpan & status diubah ke SHIPPED`);
  };

  const handleUpdateStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock_quantity: Math.max(0, p.stock_quantity + delta) } : p
      )
    );
    toast.info('Stok inventaris diperbarui');
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans">
      {/* Top Workspace Header */}
      <header className="border-b border-[#243046] bg-[#0E131E] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5">
            <span className="text-[#0055FF]">←</span> BLUE_COMPUTER STOREFRONT
          </Link>
          <span className="text-slate-600 font-mono">|</span>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider bg-[#182030] px-2 py-0.5 rounded border border-[#243046]">
            Staff Operations Panel
          </span>
        </div>

        {/* Role Simulator Switcher */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Aktif Sebagai Role:</span>
          <div className="inline-flex rounded border border-[#243046] p-0.5 bg-[#0A0D14]">
            <button
              onClick={() => setActiveRole('owner')}
              className={`px-3 py-1 rounded transition-colors ${
                activeRole === 'owner'
                  ? 'bg-[#0055FF] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => setActiveRole('employee')}
              className={`px-3 py-1 rounded transition-colors ${
                activeRole === 'employee'
                  ? 'bg-[#182030] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Employee
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#243046] pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#182030] border-t-2 border-[#0055FF] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#0055FF]" />
            Daftar Pesanan & Resi ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'inventory'
                ? 'bg-[#182030] border-t-2 border-[#0055FF] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#0055FF]" />
            Manajemen Inventaris Hardware ({products.length})
          </button>
          {activeRole === 'owner' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-t flex items-center gap-2 transition-colors ${
                activeTab === 'team'
                  ? 'bg-[#182030] border-t-2 border-[#0055FF] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#0055FF]" />
              Staff & Finansial (Owner Only)
            </button>
          )}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono uppercase text-slate-300 font-bold">
                Antrean Pesanan Masuk (Midtrans Settlement Pipeline)
              </h2>
            </div>

            <div className="border border-[#243046] rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111622] text-slate-400 uppercase border-b border-[#243046]">
                    <tr>
                      <th className="p-3">Order Number / Waktu</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Item Pesanan</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi / No. Resi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C2638] bg-[#0E131E]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#182030]/50 transition-colors">
                        <td className="p-3">
                          <div className="text-white font-bold">{o.order_number}</div>
                          <div className="text-slate-400 text-[11px]">{o.created_at}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-200">{o.customer_name}</div>
                          <div className="text-slate-400 text-[11px]">{o.customer_phone}</div>
                        </td>
                        <td className="p-3 text-slate-300">{o.items_summary}</td>
                        <td className="p-3 font-bold text-white">{formatRupiah(o.total_amount)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'paid'
                                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                                : o.status === 'processing'
                                ? 'bg-[#0055FF]/20 text-[#60A5FA] border border-[#0055FF]/40'
                                : o.status === 'shipped'
                                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                                : 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1.5">
                            {o.status === 'paid' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'processing')}
                                className="px-2.5 py-1 rounded bg-[#0055FF] hover:bg-[#2B72FF] text-white text-[11px] font-semibold"
                              >
                                Proses Packing
                              </button>
                            )}

                            {o.status === 'processing' && (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="Input No. Resi..."
                                  id={`resi-${o.id}`}
                                  defaultValue={o.tracking_number}
                                  className="w-32 bg-[#0A0D14] border border-[#243046] text-white px-2 py-1 rounded text-[11px] outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(`resi-${o.id}`) as HTMLInputElement;
                                    if (input && input.value) {
                                      handleUpdateTracking(o.id, input.value);
                                    } else {
                                      toast.error('Masukkan nomor resi ekspedisi');
                                    }
                                  }}
                                  className="px-2 py-1 rounded bg-[#10B981] hover:bg-emerald-600 text-white text-[11px]"
                                >
                                  Kirim
                                </button>
                              </div>
                            )}

                            {o.status === 'shipped' && (
                              <div className="text-[11px] text-slate-300 flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-[#10B981]" />
                                <span>Resi: {o.tracking_number}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono uppercase text-slate-300 font-bold">
                Katalog Inventaris & Kontrol Stok Hardware
              </h2>
              {activeRole === 'owner' && (
                <button
                  onClick={() => toast.info('Modal Tambah SKU Produk Baru')}
                  className="px-3 py-1.5 rounded bg-[#0055FF] hover:bg-[#2B72FF] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Produk Baru
                </button>
              )}
            </div>

            <div className="border border-[#243046] rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111622] text-slate-400 uppercase border-b border-[#243046]">
                    <tr>
                      <th className="p-3">SKU & Produk</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Harga Retail</th>
                      <th className="p-3">Stok Unit</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi Stok (Employee & Owner)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C2638] bg-[#0E131E]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#182030]/50 transition-colors">
                        <td className="p-3">
                          <div className="text-[10px] text-slate-400 uppercase">{p.sku}</div>
                          <div className="text-white font-bold">{p.name}</div>
                        </td>
                        <td className="p-3 text-slate-300">{p.brand}</td>
                        <td className="p-3 font-bold text-white">{formatRupiah(p.base_price)}</td>
                        <td className="p-3">
                          <span
                            className={`font-bold ${
                              p.stock_quantity <= 5 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                            }`}
                          >
                            {p.stock_quantity} Unit
                          </span>
                        </td>
                        <td className="p-3">
                          {p.stock_quantity > 0 ? (
                            <span className="text-[10px] text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded">
                              Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-2 py-0.5 rounded">
                              Habis
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateStock(p.id, -1)}
                              className="px-2 py-1 bg-[#182030] hover:bg-[#243046] text-slate-200 border border-[#243046] rounded"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleUpdateStock(p.id, 5)}
                              className="px-2 py-1 bg-[#182030] hover:bg-[#243046] text-[#10B981] border border-[#243046] rounded font-semibold"
                            >
                              +5
                            </button>
                            {activeRole === 'owner' && (
                              <button
                                onClick={() => toast.info(`Edit metadata untuk SKU: ${p.sku}`)}
                                className="p-1 hover:text-[#0055FF] text-slate-400"
                                title="Edit Detail Produk"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Team & Finance (Owner Only) */}
        {activeTab === 'team' && activeRole === 'owner' && (
          <div className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111622] border border-[#243046] rounded p-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Omzet Bulan Ini</span>
                <div className="text-xl font-mono font-bold text-white mt-1">Rp 148.650.000</div>
                <span className="text-[10px] font-mono text-[#10B981] mt-1 block">+18.4% dari bulan lalu</span>
              </div>
              <div className="bg-[#111622] border border-[#243046] rounded p-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Transaksi Midtrans</span>
                <div className="text-xl font-mono font-bold text-white mt-1">34 Pesanan Berhasil</div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">0 Disputed / Chargeback</span>
              </div>
              <div className="bg-[#111622] border border-[#243046] rounded p-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Valuasi Stok Tersedia</span>
                <div className="text-xl font-mono font-bold text-white mt-1">Rp 284.100.000</div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">67 Total Unit Komponen</span>
              </div>
            </div>

            {/* Employee Management List */}
            <div className="bg-[#111622] border border-[#243046] rounded p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0055FF]" />
                  Daftar Akun Karyawan & Hak Akses
                </h3>
                <button
                  onClick={() => toast.info('Buka formulir undang karyawan baru')}
                  className="px-3 py-1 bg-[#182030] hover:bg-[#243046] border border-[#243046] text-white text-xs font-mono rounded"
                >
                  + Tambah Staf Baru
                </button>
              </div>

              <div className="divide-y divide-[#1C2638] font-mono text-xs">
                {[
                  { name: 'Arif Hidayat', email: 'arif.warehouse@bluecomputer.id', role: 'Employee', task: 'Staf Gudang & Packing' },
                  { name: 'Siti Rahma', email: 'siti.support@bluecomputer.id', role: 'Employee', task: 'Customer Support & Resi' },
                  { name: 'Bambang Pratama', email: 'owner@bluecomputer.id', role: 'Owner', task: 'Founder & Full Control' },
                ].map((member) => (
                  <div key={member.email} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{member.name}</div>
                      <div className="text-slate-400 text-[11px]">{member.email} • {member.task}</div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        member.role === 'Owner'
                          ? 'bg-[#0055FF]/20 text-[#60A5FA] border border-[#0055FF]/40'
                          : 'bg-[#182030] text-slate-300 border border-[#243046]'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
