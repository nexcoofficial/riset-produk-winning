// ====================================================================
// Lapisan data (persistence).
//
// Implementasi aktif: localStorage (browser). Semua fungsi dibuat async
// (mengembalikan Promise) sehingga ketika kamu pindah ke Supabase nanti,
// cukup ganti isi fungsi di bawah tanpa mengubah komponen UI.
//
// Cara pindah ke Supabase: lihat lib/supabase.example.js & supabase/schema.sql
// lalu ganti body tiap fungsi dengan query Supabase yang setara.
// ====================================================================

import { DEFAULT_CATEGORIES } from "./categories";
import { DEFAULT_TARGET_MARGIN } from "./logic";

const PRODUCTS_KEY = "rpw_products";
const SETTINGS_KEY = "rpw_settings";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

// ---------------------- Produk ----------------------

export async function getProducts() {
  return read(PRODUCTS_KEY, []);
}

export async function getProduct(id) {
  const all = read(PRODUCTS_KEY, []);
  return all.find((p) => p.id === id) || null;
}

export async function upsertProduct(produk) {
  const all = read(PRODUCTS_KEY, []);
  const now = new Date().toISOString();
  if (produk.id) {
    const idx = all.findIndex((p) => p.id === produk.id);
    const updated = { ...produk, updatedAt: now };
    if (idx >= 0) all[idx] = updated;
    else all.push(updated);
    write(PRODUCTS_KEY, all);
    return updated;
  }
  const baru = { ...produk, id: uid(), createdAt: now, updatedAt: now };
  all.push(baru);
  write(PRODUCTS_KEY, all);
  return baru;
}

export async function deleteProduct(id) {
  const all = read(PRODUCTS_KEY, []);
  write(
    PRODUCTS_KEY,
    all.filter((p) => p.id !== id)
  );
}

// ---------------------- Pengaturan ----------------------

const DEFAULT_SETTINGS = {
  targetMargin: DEFAULT_TARGET_MARGIN,
  categories: DEFAULT_CATEGORIES,
  darkMode: false,
};

export async function getSettings() {
  const s = read(SETTINGS_KEY, null);
  return { ...DEFAULT_SETTINGS, ...(s || {}) };
}

export async function saveSettings(settings) {
  const current = await getSettings();
  const merged = { ...current, ...settings };
  write(SETTINGS_KEY, merged);
  return merged;
}
