// Kategori produk default. Bisa ditambah/hapus dari halaman Pengaturan.
export const DEFAULT_CATEGORIES = [
  "Rumah Tangga & Dapur",
  "Kecantikan & Perawatan",
  "Kesehatan & Alat Bantu",
  "Otomotif & Gadget Aksesoris",
  "Fashion & Ibu-Anak",
];

// Rotasi riset mingguan berdasarkan hari (0 = Minggu ... 6 = Sabtu, mengikuti Date.getDay()).
export const WEEKLY_ROTATION = {
  1: { fokus: "Rumah Tangga & Dapur", isKategori: true },
  2: { fokus: "Kecantikan & Perawatan", isKategori: true },
  3: { fokus: "Kesehatan & Alat Bantu", isKategori: true },
  4: { fokus: "Otomotif & Gadget Aksesoris", isKategori: true },
  5: { fokus: "Fashion & Ibu-Anak", isKategori: true },
  6: { fokus: "Review temuan minggu ini", isKategori: false },
  0: { fokus: "Siapkan ide minggu depan", isKategori: false },
};

export const SOURCES = [
  "Meta Ad Library",
  "TikTok",
  "Shopee",
  "Tokopedia",
  "Lainnya",
];

export const ENGAGEMENT_LEVELS = ["Rendah", "Sedang", "Tinggi"];

export const SALES_TYPES = ["Satuan", "Paketan"];

export const TARGETING_TYPES = ["Broad", "Interest"];

export const STATUSES = [
  "Riset",
  "Validasi",
  "Siap Eksekusi",
  "Sedang Diiklankan",
  "Winning",
  "Gugur",
];
