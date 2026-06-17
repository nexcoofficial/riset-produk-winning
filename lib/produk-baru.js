import { todayISO } from "./format";

// Objek produk kosong untuk form tambah baru.
export function produkKosong() {
  return {
    id: "",
    nama: "",
    kategori: "",
    tanggalDitemukan: todayISO(),
    sumber: "Meta Ad Library",
    linkIklan: "",
    tanggalIklanMulai: "",
    jumlahAdvertiser: 1,
    engagement: "Sedang",
    linkSeller: "",
    fotoUrls: [],
    videoUrls: [],
    hargaModal: 0,
    ongkir: 0,
    biayaIklanPerClosing: 0,
    hargaJual: 0,
    jenisPenjualan: "Satuan",
    isiBundle: "",
    targetUmurMin: 18,
    targetUmurMax: 45,
    targeting: "Broad",
    catatanInterest: "",
    catatanAngle: "",
    status: "Riset",
  };
}
