# 🎯 Riset Produk Winning

Tool pribadi untuk **riset produk winning** bisnis dropship/COD yang diiklankan di Facebook Ads & TikTok. Bukan scraper — ini **tracker manual**: kamu yang riset, tool yang mengorganisir, menghitung margin, dan menilai kelayakan eksekusi.

> Tidak melakukan scraping otomatis ke Shopee/Facebook/TikTok (melanggar ToS & tidak stabil). Semua data dimasukkan manual.

## ✨ Fitur

- **Dashboard** — banner "Hari ini riset: [KATEGORI]" otomatis (rotasi mingguan), checklist langkah riset, kartu ringkasan, daftar produk siap eksekusi.
- **Tracker Produk** — daftar semua kandidat dengan filter (kategori/status/sumber + pencarian) & sort (umur iklan terlama, margin tertinggi, skor tertinggi, terbaru).
- **Form / Detail Produk** — semua field riset, media (foto/video URL + preview), kalkulasi margin & skor validasi live.
- **SOP Harian** — rotasi kategori mingguan + checklist + tips (bisa diedit di `lib/sop.js`).
- **Kalkulator Margin** — hitung margin bersih + indikator lolos/tidak target + harga jual minimal.
- **Pengaturan** — ubah target margin (default Rp130.000), tambah/hapus kategori, export data JSON, dark mode.

## 🧮 Logika bisnis

- **Umur iklan (hari)** = hari ini − tanggal iklan mulai tayang.
- **Margin bersih** = harga jual − modal − ongkir − biaya iklan/closing.
- **Skor Validasi (0–4)**, +1 poin tiap kriteria:
  1. Umur iklan ≥ 14 hari
  2. Jumlah advertiser > 1
  3. Engagement = Tinggi
  4. Margin bersih ≥ target (default Rp130.000)
- Label: **0–1 Lemah** (merah), **2 Perlu cek** (kuning), **3–4 Layak Eksekusi** (hijau).
- **Rotasi mingguan**: Sen → Rumah Tangga & Dapur · Sel → Kecantikan & Perawatan · Rab → Kesehatan & Alat Bantu · Kam → Otomotif & Gadget Aksesoris · Jum → Fashion & Ibu-Anak · Sab → Review · Min → Siapkan ide.

Semua perhitungan ada di `lib/logic.js`.

## 🛠️ Tech stack

Next.js (App Router) · React · Tailwind CSS · siap deploy Vercel. Penyimpanan default **localStorage** (langsung jalan tanpa setup); siap dipindah ke **Supabase**.

## 📁 Struktur folder

```
app/
  layout.jsx            # Layout global + DataProvider + Nav
  page.jsx              # Dashboard
  globals.css           # Tailwind + komponen util (.card, .btn, dll)
  tracker/page.jsx      # Daftar produk + filter & sort
  produk/baru/page.jsx  # Tambah kandidat
  produk/[id]/page.jsx  # Detail + mode edit
  sop/page.jsx          # SOP harian
  kalkulator/page.jsx   # Kalkulator margin
  pengaturan/page.jsx   # Settings
components/
  DataProvider.jsx      # Context: state produk & settings + CRUD
  Nav.jsx               # Navbar atas + bottom nav (mobile) + toggle tema
  ProductForm.jsx       # Form produk (dipakai tambah & edit)
  SkorValidasi.jsx      # Badge & rincian skor
  MarginRingkas.jsx     # Indikator margin hijau/merah
  MultiUrlInput.jsx     # Input banyak URL (foto/video) + preview
  Badge.jsx             # Badge + warna status
lib/
  logic.js              # Logika bisnis (margin, skor, rotasi)
  store.js              # Lapisan data (localStorage) — async, siap swap Supabase
  categories.js         # Kategori, sumber, status, dll
  format.js             # Format Rupiah, tanggal
  sop.js                # Teks SOP & tips (edit di sini)
  produk-baru.js        # Template produk kosong
  supabase.example.js   # Adapter Supabase siap pakai (belum aktif)
supabase/
  schema.sql            # Skema tabel Supabase
```

## 🚀 Menjalankan lokal

```bash
npm install
npm run dev      # buka http://localhost:3000
```

Tanpa konfigurasi apa pun, data tersimpan di **localStorage browser**. Unduh cadangan rutin lewat **Pengaturan → Export data**.

## ☁️ Deploy ke Vercel

1. Push repo ini ke GitHub (sudah).
2. Buka [vercel.com](https://vercel.com) → **Add New → Project** → import repo ini.
3. Framework otomatis terdeteksi (Next.js). Klik **Deploy**.
4. (Opsional) Jika pakai Supabase, tambahkan Environment Variables `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 🗄️ Pindah ke Supabase (opsional, agar data lintas perangkat)

1. Buat project gratis di [supabase.com](https://supabase.com).
2. SQL Editor → tempel & jalankan `supabase/schema.sql`.
3. `npm install @supabase/supabase-js`
4. Salin `.env.example` → `.env.local`, isi `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Settings → API).
5. Rename `lib/supabase.example.js` → `lib/supabase.js`, lalu di `lib/store.js` re-export fungsi dari situ (interface fungsinya sudah identik, UI tak perlu diubah).

> Untuk tool pribadi, RLS dimatikan di schema (cukup karena hanya kamu yang tahu URL & key). Untuk multi-user dengan login, tambahkan kolom `user_id` + aktifkan RLS (lihat catatan di `schema.sql`).

## 🔮 Yang bisa dikembangkan nanti

- Aktifkan Supabase + Supabase Auth (login) untuk akses lintas perangkat yang aman.
- Upload foto langsung ke Supabase Storage (sekarang via URL).
- Grafik tren: jumlah produk winning per bulan, win-rate per kategori.
- Reminder/notifikasi fokus riset harian (PWA).
- Import data dari CSV.
