"use client";

import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import { useData } from "@/components/DataProvider";
import { produkKosong } from "@/lib/produk-baru";

export default function ProdukBaruPage() {
  const { loading } = useData();
  if (loading) return <p className="text-slate-500">Memuat…</p>;

  return (
    <div className="space-y-4">
      <div>
        <Link href="/tracker" className="text-sm text-brand hover:underline">
          ← Kembali ke Tracker
        </Link>
        <h1 className="mt-1 text-xl font-bold">Tambah Kandidat Produk</h1>
      </div>
      <ProductForm initial={produkKosong()} />
    </div>
  );
}
