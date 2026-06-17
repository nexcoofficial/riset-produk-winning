"use client";

import { useState } from "react";
import { useData } from "@/components/DataProvider";
import MarginRingkas from "@/components/MarginRingkas";
import { formatRupiah } from "@/lib/format";

export default function KalkulatorPage() {
  const { settings, loading } = useData();
  const [v, setV] = useState({
    hargaModal: 0,
    ongkir: 0,
    biayaIklanPerClosing: 0,
    hargaJual: 0,
  });

  if (loading || !settings) return <p className="text-slate-500">Memuat…</p>;
  const target = settings.targetMargin;

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: Number(e.target.value) || 0 }));

  // Hitung harga jual minimal agar lolos target.
  const hargaJualMin =
    Number(v.hargaModal) +
    Number(v.ongkir) +
    Number(v.biayaIklanPerClosing) +
    target;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Kalkulator Margin</h1>

      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Harga modal" value={v.hargaModal} onChange={set("hargaModal")} />
          <Field label="Estimasi ongkir" value={v.ongkir} onChange={set("ongkir")} />
          <Field
            label="Biaya iklan / closing"
            value={v.biayaIklanPerClosing}
            onChange={set("biayaIklanPerClosing")}
          />
          <Field label="Harga jual" value={v.hargaJual} onChange={set("hargaJual")} />
        </div>

        <MarginRingkas produk={v} target={target} />

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-300">
            Agar lolos target margin{" "}
            <span className="font-semibold">{formatRupiah(target)}</span>, harga jual
            minimal:
          </p>
          <p className="mt-1 text-lg font-bold text-brand">{formatRupiah(hargaJualMin)}</p>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Target margin bisa diubah di halaman Pengaturan.
      </p>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label} (Rp)</label>
      <input type="number" min="0" className="input" value={value} onChange={onChange} />
    </div>
  );
}
