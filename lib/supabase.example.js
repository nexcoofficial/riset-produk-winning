// ====================================================================
// CONTOH adapter Supabase — belum aktif.
//
// Cara mengaktifkan:
// 1) npm install @supabase/supabase-js
// 2) Isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local
// 3) Jalankan supabase/schema.sql di Supabase SQL Editor
// 4) Rename file ini jadi lib/supabase.js, lalu ganti isi fungsi di
//    lib/store.js agar memanggil fungsi-fungsi di bawah.
//
// Bentuk fungsi sengaja dibuat sama (async) dengan lib/store.js,
// jadi komponen UI tidak perlu diubah sama sekali.
// ====================================================================

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(url, key);

// Mapping snake_case (DB) <-> camelCase (app)
function toApp(r) {
  return {
    id: r.id,
    nama: r.nama,
    kategori: r.kategori,
    tanggalDitemukan: r.tanggal_ditemukan,
    sumber: r.sumber,
    linkIklan: r.link_iklan,
    tanggalIklanMulai: r.tanggal_iklan_mulai,
    jumlahAdvertiser: r.jumlah_advertiser,
    engagement: r.engagement,
    linkSeller: r.link_seller,
    fotoUrls: r.foto_urls || [],
    videoUrls: r.video_urls || [],
    hargaModal: r.harga_modal,
    ongkir: r.ongkir,
    biayaIklanPerClosing: r.biaya_iklan_per_closing,
    hargaJual: r.harga_jual,
    jenisPenjualan: r.jenis_penjualan,
    isiBundle: r.isi_bundle,
    targetUmurMin: r.target_umur_min,
    targetUmurMax: r.target_umur_max,
    targeting: r.targeting,
    catatanInterest: r.catatan_interest,
    catatanAngle: r.catatan_angle,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toDb(p) {
  return {
    nama: p.nama,
    kategori: p.kategori,
    tanggal_ditemukan: p.tanggalDitemukan || null,
    sumber: p.sumber,
    link_iklan: p.linkIklan,
    tanggal_iklan_mulai: p.tanggalIklanMulai || null,
    jumlah_advertiser: p.jumlahAdvertiser,
    engagement: p.engagement,
    link_seller: p.linkSeller,
    foto_urls: p.fotoUrls,
    video_urls: p.videoUrls,
    harga_modal: p.hargaModal,
    ongkir: p.ongkir,
    biaya_iklan_per_closing: p.biayaIklanPerClosing,
    harga_jual: p.hargaJual,
    jenis_penjualan: p.jenisPenjualan,
    isi_bundle: p.isiBundle,
    target_umur_min: p.targetUmurMin,
    target_umur_max: p.targetUmurMax,
    targeting: p.targeting,
    catatan_interest: p.catatanInterest,
    catatan_angle: p.catatanAngle,
    status: p.status,
  };
}

export async function getProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []).map(toApp);
}

export async function getProduct(id) {
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data ? toApp(data) : null;
}

export async function upsertProduct(produk) {
  if (produk.id) {
    const { data } = await supabase
      .from("products")
      .update({ ...toDb(produk), updated_at: new Date().toISOString() })
      .eq("id", produk.id)
      .select()
      .single();
    return toApp(data);
  }
  const { data } = await supabase.from("products").insert(toDb(produk)).select().single();
  return toApp(data);
}

export async function deleteProduct(id) {
  await supabase.from("products").delete().eq("id", id);
}

export async function getSettings() {
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return {
    targetMargin: data?.target_margin ?? 130000,
    categories: data?.categories ?? [],
    darkMode: data?.dark_mode ?? false,
  };
}

export async function saveSettings(settings) {
  const current = await getSettings();
  const merged = { ...current, ...settings };
  await supabase.from("settings").update({
    target_margin: merged.targetMargin,
    categories: merged.categories,
    dark_mode: merged.darkMode,
  }).eq("id", 1);
  return merged;
}
