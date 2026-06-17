"use client";

import { WEEKLY_ROTATION } from "@/lib/categories";
import { CHECKLIST_HARIAN, TIPS } from "@/lib/sop";
import { fokusHariIni } from "@/lib/logic";

const HARI = [
  { day: 1, nama: "Senin" },
  { day: 2, nama: "Selasa" },
  { day: 3, nama: "Rabu" },
  { day: 4, nama: "Kamis" },
  { day: 5, nama: "Jumat" },
  { day: 6, nama: "Sabtu" },
  { day: 0, nama: "Minggu" },
];

export default function SopPage() {
  const fokus = fokusHariIni();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">SOP Harian Riset</h1>

      <section className="card">
        <h2 className="mb-3 font-semibold">📅 Rotasi Kategori Mingguan</h2>
        <ul className="space-y-2">
          {HARI.map((h) => {
            const r = WEEKLY_ROTATION[h.day];
            const aktif = h.day === fokus.day;
            return (
              <li
                key={h.day}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  aktif
                    ? "bg-brand text-white"
                    : "bg-slate-50 dark:bg-slate-800/60"
                }`}
              >
                <span className="font-medium">{h.nama}</span>
                <span className={aktif ? "" : "text-slate-600 dark:text-slate-300"}>
                  {r.fokus} {aktif && "← hari ini"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h2 className="mb-3 font-semibold">✅ Checklist Langkah Riset Harian</h2>
        <ol className="space-y-2">
          {CHECKLIST_HARIAN.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="font-bold text-brand">{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2 className="mb-3 font-semibold">💡 Tips Riset</h2>
        <ul className="space-y-2">
          {TIPS.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span>•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-400">
        Teks SOP & tips bisa kamu ubah di file <code>lib/sop.js</code>.
      </p>
    </div>
  );
}
