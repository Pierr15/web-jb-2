# Blue Computer — High-Performance Hardware & Peripherals

Website e-commerce hardware dan aksesoris komputer **Blue Computer** yang dibangun dengan Next.js 15, TypeScript, Tailwind CSS, Supabase PostgreSQL, dan Midtrans Sandbox.

---

## 1. Setup Database Supabase

1. Buat project baru di [Supabase Dashboard](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka file [schema.sql](file:///d:/Project/web-jb-2/supabase/schema.sql) di dalam proyek Anda.
4. Salin seluruh isi SQL dan jalankan di SQL Editor Supabase.
   - Script ini otomatis membuat tabel: `profiles`, `categories`, `products`, `orders`, `order_items`, dan `payments`.
   - Mengatur Row Level Security (RLS) untuk perlindungan data role `owner`, `employee`, dan `buyer`.
   - Menyiapkan trigger pembuatan profile otomatis saat user mendaftar.
5. Dapatkan credential API dari menu **Project Settings -> API**:
   - `Project URL`
   - `anon / public key`
   - `service_role key` (rahasia, khusus server)

---

## 2. Setup Midtrans Sandbox

1. Masuk ke [Midtrans Dashboard Sandbox](https://dashboard.sandbox.midtrans.com).
2. Di menu **Settings -> Access Keys**, salin:
   - `Client Key` (contoh: `SB-Mid-client-xxxxxxxx`)
   - `Server Key` (contoh: `SB-Mid-server-xxxxxxxx`)
3. Di menu **Settings -> Configuration**:
   - **Payment Notification URL**: Isi dengan URL Vercel atau webhook endpoint Anda:
     `https://<domain-anda>.vercel.app/api/midtrans/webhook`
   - **Finish Redirect URL**:
     `https://<domain-anda>.vercel.app/cart`
4. Untuk testing pembayaran di Sandbox, Anda dapat menggunakan [Midtrans Payment Simulator](https://simulator.sandbox.midtrans.com) (mendukung simulasi QRIS, Virtual Account BCA/BNI/BRI/Mandiri, dan Kartu Kredit Test 3DS).

---

## 3. Konfigurasi Environment Variables (`.env.local`)

Isi file `.env.local` di root proyek (lihat contoh di `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...

# Midtrans Sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Menjalankan Aplikasi Secara Lokal

```bash
# Menjalankan development server
npm run dev
```

Buka browser di `http://localhost:3000`:
- **Storefront & Katalog**: `http://localhost:3000` & `http://localhost:3000/catalog`
- **Detail Hardware & Quick Specs**: `http://localhost:3000/product/amd-ryzen-7-7800x3d`
- **Keranjang & Checkout Midtrans**: `http://localhost:3000/cart`
- **Staff & Owner Portal**: `http://localhost:3000/admin` (dilengkapi switcher role interaktif antara *Owner* dan *Employee* untuk pengujian fitur resi, stok, dan kontrol finansial).

---

## 5. Deployment ke Vercel

1. Push kode repository ini ke GitHub / GitLab:
   ```bash
   git add .
   git commit -m "feat: Blue Computer hardware e-commerce with Midtrans & Supabase"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com) dan pilih **Add New -> Project**.
3. Import repository GitHub Anda.
4. Pada bagian **Environment Variables**, tambahkan seluruh variabel yang ada di file `.env.example`.
5. Klik **Deploy**. Vercel akan otomatis melakukan proses build production.
