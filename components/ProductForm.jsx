"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "./DataProvider";
import MultiUrlInput from "./MultiUrlInput";
import MarginRingkas from "./MarginRingkas";
import { SkorRincian } from "./SkorValidasi";
import {
  SOURCES,
  ENGAGEMENT_LEVELS,
  SALES_TYPES,
  TARGETING_TYPES,
  STATUSES,
} from "@/lib/categories";

export default function ProductForm({ initial, isEdit = false }) {
  const router = useRouter();
  const { settings, saveProduct, removeProduct } = useData();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const target = settings?.targetMargin || 130000;

  const set = (key) => (e) => {
    const v = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: v }));
  };
  const setNum = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: Number(e.target.value) || 0 }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const saved = await saveProduct(form);
    router.push(`/produk/${saved.id}`);
  };

  const hapus = async () => {
    if (!confirm("Hapus produk ini?")) return;
    await removeProduct(form.id);
    router.push("/tracker");
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kolom kiri: data riset */}
        <div className="space-y-4 lg:col-span-2">
          <section className="card space-y-4">
            <h2 className="font-semibold">Informasi Produk</h2>
            <div>
              <label className="label">Nama produk *</label>
              <input
                required
                className="input"
                value={form.nama}
                onChange={set("nama")}
                placeholder="Mis. Alat Pel Putar 360°"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Kategori</label>
                <select className="input" value={form.kategori} onChange={set("kategori")}>
                  <option value="">Pilih kategori…</option>
                  {settings?.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tanggal ditemukan</label>
                <input
                  type="date"
                  className="input"
                  value={form.tanggalDitemukan}
                  onChange={set("tanggalDitemukan")}
                />
              </div>
              <div>
                <label className="label">Sumber</label>
                <select className="input" value={form.sumber} onChange={set("sumber")}>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={set("status")}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Link iklan</label>
              <input
                type="url"
                className="input"
                value={form.linkIklan}
                onChange={set("linkIklan")}
                placeholder="https://facebook.com/ads/library/…"
              />
            </div>
            <div>
              <label className="label">Link seller (Shopee/Tokopedia)</label>
              <input
                type="url"
                className="input"
                value={form.linkSeller}
                onChange={set("linkSeller")}
                placeholder="https://shopee.co.id/…"
              />
            </div>
          </section>

          <section className="card space-y-4">
            <h2 className="font-semibold">Sinyal Winning</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Tanggal iklan mulai tayang</label>
                <input
                  type="date"
                  className="input"
                  value={form.tanggalIklanMulai}
                  onChange={set("tanggalIklanMulai")}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Dipakai menghitung umur iklan (sinyal produk profit).
                </p>
              </div>
              <div>
                <label className="label">Jumlah advertiser jual produk sama</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={form.jumlahAdvertiser}
                  onChange={setNum("jumlahAdvertiser")}
                />
              </div>
              <div>
                <label className="label">Tingkat engagement iklan</label>
                <select
                  className="input"
                  value={form.engagement}
                  onChange={set("engagement")}
                >
                  {ENGAGEMENT_LEVELS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="card space-y-4">
            <h2 className="font-semibold">Media</h2>
            <MultiUrlInput
              label="Foto produk (URL)"
              urls={form.fotoUrls}
              onChange={(v) => setForm((f) => ({ ...f, fotoUrls: v }))}
              preview
              placeholder="https://…/foto.jpg"
            />
            <MultiUrlInput
              label="Video produk (URL)"
              urls={form.videoUrls}
              onChange={(v) => setForm((f) => ({ ...f, videoUrls: v }))}
              placeholder="https://…/video.mp4"
            />
          </section>

          <section className="card space-y-4">
            <h2 className="font-semibold">Harga & Margin</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <RpInput label="Harga modal" value={form.hargaModal} onChange={setNum("hargaModal")} />
              <RpInput label="Estimasi ongkir" value={form.ongkir} onChange={setNum("ongkir")} />
              <RpInput
                label="Biaya iklan / closing"
                value={form.biayaIklanPerClosing}
                onChange={setNum("biayaIklanPerClosing")}
              />
              <RpInput label="Harga jual" value={form.hargaJual} onChange={setNum("hargaJual")} />
            </div>
            <MarginRingkas produk={form} target={target} />
          </section>

          <section className="card space-y-4">
            <h2 className="font-semibold">Strategi Penjualan</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Jenis penjualan</label>
                <select
                  className="input"
                  value={form.jenisPenjualan}
                  onChange={set("jenisPenjualan")}
                >
                  {SALES_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {form.jenisPenjualan === "Paketan" && (
                <div>
                  <label className="label">Isi bundle</label>
                  <input
                    className="input"
                    value={form.isiBundle}
                    onChange={set("isiBundle")}
                    placeholder="Mis. 3 pcs + bonus"
                  />
                </div>
              )}
              <div>
                <label className="label">Targeting</label>
                <select className="input" value={form.targeting} onChange={set("targeting")}>
                  {TARGETING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {form.targeting === "Interest" && (
                <div>
                  <label className="label">Catatan interest</label>
                  <input
                    className="input"
                    value={form.catatanInterest}
                    onChange={set("catatanInterest")}
                    placeholder="Mis. ibu rumah tangga, masak"
                  />
                </div>
              )}
              <div>
                <label className="label">Target umur min</label>
                <input
                  type="number"
                  className="input"
                  value={form.targetUmurMin}
                  onChange={setNum("targetUmurMin")}
                />
              </div>
              <div>
                <label className="label">Target umur max</label>
                <input
                  type="number"
                  className="input"
                  value={form.targetUmurMax}
                  onChange={setNum("targetUmurMax")}
                />
              </div>
            </div>
            <div>
              <label className="label">Catatan angle iklan / copywriting</label>
              <textarea
                className="input min-h-[90px]"
                value={form.catatanAngle}
                onChange={set("catatanAngle")}
                placeholder="Hook, masalah yang diselesaikan, CTA…"
              />
            </div>
          </section>
        </div>

        {/* Kolom kanan: skor (sticky) */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 space-y-4">
            <SkorRincian produk={form} targetMargin={target} />
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
            </button>
            {isEdit && (
              <button type="button" onClick={hapus} className="btn-danger w-full">
                Hapus Produk
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function RpInput({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label} (Rp)</label>
      <input
        type="number"
        min="0"
        className="input"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
