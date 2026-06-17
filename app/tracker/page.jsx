"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useData } from "@/components/DataProvider";
import Badge, { STATUS_COLORS } from "@/components/Badge";
import { SkorBadge } from "@/components/SkorValidasi";
import {
  hitungMargin,
  hitungSkorValidasi,
  hitungUmurIklan,
} from "@/lib/logic";
import { formatRupiah } from "@/lib/format";
import { STATUSES, SOURCES } from "@/lib/categories";

const SORTS = {
  terbaru: "Terbaru",
  umurIklan: "Umur iklan terlama",
  margin: "Margin tertinggi",
  skor: "Skor tertinggi",
};

export default function TrackerPage() {
  const { products, settings, loading } = useData();
  const [fKategori, setFKategori] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fSumber, setFSumber] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("terbaru");

  const target = settings?.targetMargin;

  const list = useMemo(() => {
    let arr = products.filter((p) => {
      if (fKategori && p.kategori !== fKategori) return false;
      if (fStatus && p.status !== fStatus) return false;
      if (fSumber && p.sumber !== fSumber) return false;
      if (q && !p.nama?.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

    arr = [...arr].sort((a, b) => {
      switch (sort) {
        case "umurIklan":
          return (
            (hitungUmurIklan(b.tanggalIklanMulai) ?? -1) -
            (hitungUmurIklan(a.tanggalIklanMulai) ?? -1)
          );
        case "margin":
          return hitungMargin(b) - hitungMargin(a);
        case "skor":
          return (
            hitungSkorValidasi(b, target).skor -
            hitungSkorValidasi(a, target).skor
          );
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });
    return arr;
  }, [products, fKategori, fStatus, fSumber, q, sort, target]);

  if (loading || !settings) return <p className="text-slate-500">Memuat data…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Tracker Produk</h1>
        <Link href="/produk/baru" className="btn-primary">
          + Tambah
        </Link>
      </div>

      {/* Filter & sort */}
      <div className="card space-y-3">
        <input
          className="input"
          placeholder="Cari nama produk…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <select
            className="input"
            value={fKategori}
            onChange={(e) => setFKategori(e.target.value)}
          >
            <option value="">Semua kategori</option>
            {settings.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={fStatus}
            onChange={(e) => setFStatus(e.target.value)}
          >
            <option value="">Semua status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={fSumber}
            onChange={(e) => setFSumber(e.target.value)}
          >
            <option value="">Semua sumber</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                Urut: {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500">{list.length} produk</p>

      {list.length === 0 ? (
        <div className="card py-10 text-center text-slate-400">
          Belum ada produk yang cocok.{" "}
          <Link href="/produk/baru" className="text-brand hover:underline">
            Tambah kandidat
          </Link>
          .
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((p) => {
            const margin = hitungMargin(p);
            const umur = hitungUmurIklan(p.tanggalIklanMulai);
            return (
              <li key={p.id}>
                <Link
                  href={`/produk/${p.id}`}
                  className="card flex items-center gap-3 transition hover:border-brand"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    {p.fotoUrls?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.fotoUrls[0]}
                        alt={p.nama}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.nama || "(tanpa nama)"}</p>
                    <p className="truncate text-xs text-slate-400">
                      {p.kategori || "-"} · {p.sumber}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge color={STATUS_COLORS[p.status]}>{p.status}</Badge>
                      <SkorBadge produk={p} targetMargin={target} />
                      {umur != null && (
                        <span className="text-xs text-slate-400">
                          📅 {umur} hari
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold ${
                        margin >= target
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatRupiah(margin)}
                    </p>
                    <p className="text-[11px] text-slate-400">margin/closing</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
