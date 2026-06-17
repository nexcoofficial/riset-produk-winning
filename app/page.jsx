"use client";

import Link from "next/link";
import { useData } from "@/components/DataProvider";
import Badge, { STATUS_COLORS } from "@/components/Badge";
import { SkorBadge } from "@/components/SkorValidasi";
import {
  fokusHariIni,
  hitungMargin,
  hitungSkorValidasi,
  isSiapEksekusi,
} from "@/lib/logic";
import { CHECKLIST_HARIAN } from "@/lib/sop";
import { formatRupiah } from "@/lib/format";
import { STATUSES } from "@/lib/categories";

export default function Dashboard() {
  const { products, settings, loading } = useData();

  if (loading || !settings) {
    return <p className="text-slate-500">Memuat data…</p>;
  }

  const target = settings.targetMargin;
  const fokus = fokusHariIni();

  const siapEksekusi = products
    .filter((p) => isSiapEksekusi(p, target))
    .sort(
      (a, b) =>
        hitungSkorValidasi(b, target).skor -
        hitungSkorValidasi(a, target).skor
    );

  const marginTertinggi = [...products].sort(
    (a, b) => hitungMargin(b) - hitungMargin(a)
  )[0];

  const perStatus = STATUSES.map((s) => ({
    status: s,
    jumlah: products.filter((p) => p.status === s).length,
  }));

  return (
    <div className="space-y-6">
      {/* Banner fokus hari ini */}
      <section className="rounded-2xl bg-gradient-to-br from-brand to-indigo-700 p-6 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-200">
          {fokus.hari} · Fokus riset hari ini
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {fokus.isKategori ? "🔍 " : "🗂️ "}
          {fokus.fokus}
        </h1>
        {fokus.isKategori ? (
          <p className="mt-2 text-sm text-indigo-100">
            Riset minimal 3–5 kandidat produk di kategori ini hari ini.
          </p>
        ) : (
          <p className="mt-2 text-sm text-indigo-100">
            Hari khusus — tidak perlu riset kategori baru.
          </p>
        )}

        <details className="group mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-white/90 hover:text-white">
            Lihat checklist langkah riset ▾
          </summary>
          <ol className="mt-3 space-y-1.5 text-sm text-indigo-50">
            {CHECKLIST_HARIAN.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold text-indigo-200">{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </details>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/produk/baru" className="btn bg-white text-brand hover:bg-indigo-50">
            + Tambah Kandidat
          </Link>
          <Link
            href="/tracker"
            className="btn border border-white/40 text-white hover:bg-white/10"
          >
            Buka Tracker
          </Link>
        </div>
      </section>

      {/* Kartu ringkasan */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Kandidat" value={products.length} />
        <StatCard
          label="Siap Eksekusi"
          value={siapEksekusi.length}
          color="text-green-600 dark:text-green-400"
        />
        <StatCard
          label="Sedang Diiklankan"
          value={products.filter((p) => p.status === "Sedang Diiklankan").length}
        />
        <StatCard
          label="Margin Tertinggi"
          value={marginTertinggi ? formatRupiah(hitungMargin(marginTertinggi)) : "-"}
          small
          color="text-brand"
        />
      </section>

      {/* Jumlah per status */}
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Kandidat per status
        </h2>
        <div className="flex flex-wrap gap-2">
          {perStatus.map((s) => (
            <Badge key={s.status} color={STATUS_COLORS[s.status]}>
              {s.status}: {s.jumlah}
            </Badge>
          ))}
        </div>
      </section>

      {/* Produk siap eksekusi */}
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">🚀 Produk Siap Eksekusi</h2>
          <Link href="/tracker" className="text-sm text-brand hover:underline">
            Lihat semua
          </Link>
        </div>
        {siapEksekusi.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Belum ada produk dengan skor 3+. Terus riset & lengkapi datanya.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {siapEksekusi.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/produk/${p.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.nama}</p>
                    <p className="text-xs text-slate-400">{p.kategori}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatRupiah(hitungMargin(p))}
                    </span>
                    <SkorBadge produk={p} targetMargin={target} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, color = "", small = false }) {
  return (
    <div className="card">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 font-bold ${small ? "text-lg" : "text-2xl"} ${color}`}>
        {value}
      </p>
    </div>
  );
}
