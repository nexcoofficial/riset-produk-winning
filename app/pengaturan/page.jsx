"use client";

import { useEffect, useState } from "react";
import { useData } from "@/components/DataProvider";
import { formatRupiah } from "@/lib/format";

export default function PengaturanPage() {
  const { settings, updateSettings, products, loading } = useData();
  const [target, setTarget] = useState(130000);
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setTarget(settings.targetMargin);
      setCats(settings.categories);
    }
  }, [settings]);

  if (loading || !settings) return <p className="text-slate-500">Memuat…</p>;

  const simpanTarget = async () => {
    await updateSettings({ targetMargin: Number(target) || 0 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tambahCat = async () => {
    const c = newCat.trim();
    if (!c || cats.includes(c)) return;
    const next = [...cats, c];
    setCats(next);
    setNewCat("");
    await updateSettings({ categories: next });
  };

  const hapusCat = async (c) => {
    const next = cats.filter((x) => x !== c);
    setCats(next);
    await updateSettings({ categories: next });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings, products }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riset-produk-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Pengaturan</h1>

      <section className="card space-y-3">
        <h2 className="font-semibold">🎯 Target Margin</h2>
        <p className="text-sm text-slate-500">
          Margin bersih minimal per closing agar produk dianggap layak.
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            className="input"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <button onClick={simpanTarget} className="btn-primary shrink-0">
            {saved ? "Tersimpan ✓" : "Simpan"}
          </button>
        </div>
        <p className="text-sm text-slate-400">Saat ini: {formatRupiah(settings.targetMargin)}</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">🗂️ Kategori Produk</h2>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Tambah kategori baru…"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tambahCat()}
          />
          <button onClick={tambahCat} className="btn-primary shrink-0">
            Tambah
          </button>
        </div>
        <ul className="space-y-2">
          {cats.map((c) => (
            <li
              key={c}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60"
            >
              <span>{c}</span>
              <button
                onClick={() => hapusCat(c)}
                className="text-red-500 hover:text-red-600"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">💾 Data</h2>
        <p className="text-sm text-slate-500">
          Data tersimpan di browser ini (localStorage). Unduh cadangan secara berkala.
        </p>
        <button onClick={exportData} className="btn-ghost">
          Export data (JSON)
        </button>
      </section>
    </div>
  );
}
