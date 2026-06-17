"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as store from "@/lib/store";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [p, s] = await Promise.all([
      store.getProducts(),
      store.getSettings(),
    ]);
    setProducts(p);
    setSettings(s);
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  // Terapkan dark mode ke <html>.
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    if (settings.darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [settings]);

  const saveProduct = useCallback(async (produk) => {
    const saved = await store.upsertProduct(produk);
    setProducts(await store.getProducts());
    return saved;
  }, []);

  const removeProduct = useCallback(async (id) => {
    await store.deleteProduct(id);
    setProducts(await store.getProducts());
  }, []);

  const updateSettings = useCallback(async (partial) => {
    const merged = await store.saveSettings(partial);
    setSettings(merged);
    return merged;
  }, []);

  const value = {
    products,
    settings,
    loading,
    refresh,
    saveProduct,
    removeProduct,
    updateSettings,
  };

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData harus dipakai di dalam DataProvider");
  return ctx;
}
