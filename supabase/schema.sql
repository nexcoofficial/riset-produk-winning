-- ====================================================================
-- Skema Supabase untuk "Riset Produk Winning"
-- Jalankan di Supabase Dashboard → SQL Editor.
-- ====================================================================

-- Tabel produk
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text,
  tanggal_ditemukan date,
  sumber text,
  link_iklan text,
  tanggal_iklan_mulai date,
  jumlah_advertiser int default 1,
  engagement text,
  link_seller text,
  foto_urls text[] default '{}',
  video_urls text[] default '{}',
  harga_modal numeric default 0,
  ongkir numeric default 0,
  biaya_iklan_per_closing numeric default 0,
  harga_jual numeric default 0,
  jenis_penjualan text default 'Satuan',
  isi_bundle text,
  target_umur_min int default 18,
  target_umur_max int default 45,
  targeting text default 'Broad',
  catatan_interest text,
  catatan_angle text,
  status text default 'Riset',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabel pengaturan (1 baris saja untuk pemakaian pribadi)
create table if not exists public.settings (
  id int primary key default 1,
  target_margin numeric default 130000,
  categories text[] default array[
    'Rumah Tangga & Dapur',
    'Kecantikan & Perawatan',
    'Kesehatan & Alat Bantu',
    'Otomotif & Gadget Aksesoris',
    'Fashion & Ibu-Anak'
  ],
  dark_mode boolean default false,
  constraint settings_single_row check (id = 1)
);

insert into public.settings (id) values (1)
on conflict (id) do nothing;

-- ====================================================================
-- Row Level Security
-- Untuk tool PRIBADI tanpa login, cara paling cepat: matikan RLS
-- (anon key sudah cukup karena hanya kamu yang tahu URL & key).
-- Untuk lebih aman, aktifkan RLS + Supabase Auth dan tambahkan kolom user_id.
-- ====================================================================

alter table public.products disable row level security;
alter table public.settings disable row level security;

-- Catatan: jika ingin multi-user dengan login, tambahkan:
--   alter table public.products add column user_id uuid references auth.users;
-- lalu aktifkan RLS dan buat policy berbasis auth.uid().
