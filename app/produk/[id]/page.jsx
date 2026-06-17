"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useData } from "@/components/DataProvider";
import ProductForm from "@/components/ProductForm";
import Badge, { STATUS_COLORS } from "@/components/Badge";
import { SkorRincian } from "@/components/SkorValidasi";
import MarginRingkas from "@/components/MarginRingkas";
import { hitungUmurIklan } from "@/lib/logic";
import { formatRupiah, formatTanggal } from "@/lib/format";

export default function ProdukDetailPage() {
  const { id } = useParams();
  const { products, settings, loading } = useData();
  const [edit, setEdit] = useState(false);

  if (loading || !settings) return <p className="text-slate-500">Memuat…</p>;

  const produk = products.find((p) => p.id === id);
  if (!produk) {
    return (
      <div className="card text-center">
        <p className="text-slate-500">Produk tidak ditemukan.</p>
        <Link href="/tracker" className="mt-3 inline-block text-brand hover:underline">
          ← Kembali ke Tracker
        </Link>
      </div>
    );
  }

  const target = settings.targetMargin;

  if (edit) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEdit(false)} className="text-sm text-brand hover:underline">
          ← Batal edit
        </button>
        <h1 className="text-xl font-bold">Edit: {produk.nama}</h1>
        <ProductForm initial={produk} isEdit />
      </div>
    );
  }

  const umur = hitungUmurIklan(produk.tanggalIklanMulai);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href="/tracker" className="text-sm text-brand hover:underline">
            ← Tracker
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{produk.nama}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge color={STATUS_COLORS[produk.status]}>{produk.status}</Badge>
            {produk.kategori && <Badge color="brand">{produk.kategori}</Badge>}
            <Badge color="slate">{produk.sumber}</Badge>
          </div>
        </div>
        <button onClick={() => setEdit(true)} className="btn-primary shrink-0">
          Edit
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Foto */}
          {produk.fotoUrls?.length > 0 && (
            <section className="card">
              <h2 className="mb-3 font-semibold">Foto Produk</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {produk.fotoUrls.map((u, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <a key={i} href={u} target="_blank" rel="noreferrer">
                    <img
                      src={u}
                      alt=""
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="card space-y-2">
            <h2 className="mb-2 font-semibold">Detail Riset</h2>
            <Row label="Tanggal ditemukan" value={formatTanggal(produk.tanggalDitemukan)} />
            <Row label="Iklan mulai tayang" value={formatTanggal(produk.tanggalIklanMulai)} />
            <Row label="Umur iklan" value={umur != null ? `${umur} hari` : "-"} />
            <Row label="Jumlah advertiser" value={produk.jumlahAdvertiser} />
            <Row label="Engagement" value={produk.engagement} />
            <LinkRow label="Link iklan" url={produk.linkIklan} />
            <LinkRow label="Link seller" url={produk.linkSeller} />
            {produk.videoUrls?.map((u, i) => (
              <LinkRow key={i} label={`Video ${i + 1}`} url={u} />
            ))}
          </section>

          <section className="card space-y-2">
            <h2 className="mb-2 font-semibold">Harga</h2>
            <Row label="Harga modal" value={formatRupiah(produk.hargaModal)} />
            <Row label="Ongkir" value={formatRupiah(produk.ongkir)} />
            <Row label="Biaya iklan / closing" value={formatRupiah(produk.biayaIklanPerClosing)} />
            <Row label="Harga jual" value={formatRupiah(produk.hargaJual)} />
            <div className="pt-2">
              <MarginRingkas produk={produk} target={target} />
            </div>
          </section>

          <section className="card space-y-2">
            <h2 className="mb-2 font-semibold">Strategi</h2>
            <Row
              label="Jenis penjualan"
              value={
                produk.jenisPenjualan +
                (produk.jenisPenjualan === "Paketan" && produk.isiBundle
                  ? ` (${produk.isiBundle})`
                  : "")
              }
            />
            <Row
              label="Targeting"
              value={
                produk.targeting +
                (produk.targeting === "Interest" && produk.catatanInterest
                  ? ` (${produk.catatanInterest})`
                  : "")
              }
            />
            <Row
              label="Target umur"
              value={`${produk.targetUmurMin}–${produk.targetUmurMax} th`}
            />
            {produk.catatanAngle && (
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Angle iklan / copywriting
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{produk.catatanAngle}</p>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <SkorRincian produk={produk} targetMargin={target} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium">{value ?? "-"}</span>
    </div>
  );
}

function LinkRow({ label, url }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="max-w-[60%] truncate text-brand hover:underline"
        >
          Buka ↗
        </a>
      ) : (
        <span className="font-medium">-</span>
      )}
    </div>
  );
}
