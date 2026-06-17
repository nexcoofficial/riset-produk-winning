// ====================================================================
// Logika bisnis riset produk winning.
// Semua perhitungan terpusat di sini agar konsisten di seluruh aplikasi.
// ====================================================================

import { WEEKLY_ROTATION } from "./categories";

export const DEFAULT_TARGET_MARGIN = 130000;

// Umur iklan (hari) = hari ini - tanggal iklan mulai tayang.
export function hitungUmurIklan(tanggalMulai, now = new Date()) {
  if (!tanggalMulai) return null;
  const start = new Date(tanggalMulai + "T00:00:00");
  if (isNaN(start.getTime())) return null;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - start.getTime();
  const hari = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return hari < 0 ? 0 : hari;
}

// Margin bersih = harga jual - modal - ongkir - biaya iklan per closing.
export function hitungMargin(produk) {
  const hargaJual = Number(produk.hargaJual) || 0;
  const modal = Number(produk.hargaModal) || 0;
  const ongkir = Number(produk.ongkir) || 0;
  const biayaIklan = Number(produk.biayaIklanPerClosing) || 0;
  return hargaJual - modal - ongkir - biayaIklan;
}

// Skor validasi 0-4. 1 poin per kriteria terpenuhi.
export function hitungSkorValidasi(produk, targetMargin = DEFAULT_TARGET_MARGIN) {
  const umur = hitungUmurIklan(produk.tanggalIklanMulai);
  const margin = hitungMargin(produk);

  const kriteria = [
    {
      label: "Umur iklan ≥ 14 hari",
      detail: umur == null ? "Tanggal belum diisi" : `${umur} hari`,
      lolos: umur != null && umur >= 14,
    },
    {
      label: "Jumlah advertiser > 1",
      detail: `${Number(produk.jumlahAdvertiser) || 0} advertiser`,
      lolos: (Number(produk.jumlahAdvertiser) || 0) > 1,
    },
    {
      label: "Engagement Tinggi",
      detail: produk.engagement || "-",
      lolos: produk.engagement === "Tinggi",
    },
    {
      label: "Margin ≥ target",
      detail: `${margin >= 0 ? "+" : ""}${margin.toLocaleString("id-ID")}`,
      lolos: margin >= targetMargin,
    },
  ];

  const skor = kriteria.filter((k) => k.lolos).length;
  return { skor, kriteria, margin, umur };
}

// Label & warna berdasar skor.
export function labelSkor(skor) {
  if (skor <= 1) return { teks: "Lemah", warna: "red" };
  if (skor === 2) return { teks: "Perlu cek", warna: "yellow" };
  return { teks: "Layak Eksekusi", warna: "green" };
}

// Fokus riset hari ini berdasar rotasi mingguan.
export function fokusHariIni(now = new Date()) {
  const day = now.getDay();
  const nama = now.toLocaleDateString("id-ID", { weekday: "long" });
  return { ...WEEKLY_ROTATION[day], hari: nama, day };
}

// Apakah produk dianggap "siap eksekusi" (skor 3+).
export function isSiapEksekusi(produk, targetMargin = DEFAULT_TARGET_MARGIN) {
  return hitungSkorValidasi(produk, targetMargin).skor >= 3;
}
