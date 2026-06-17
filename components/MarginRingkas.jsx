import { hitungMargin } from "@/lib/logic";
import { formatRupiah } from "@/lib/format";

// Ringkasan margin + indikator hijau/merah terhadap target.
export default function MarginRingkas({ produk, target }) {
  const margin = hitungMargin(produk);
  const lolos = margin >= target;
  return (
    <div
      className={`rounded-xl border p-4 ${
        lolos
          ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
          : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Margin bersih / closing
        </span>
        <span
          className={`text-xl font-bold ${
            lolos
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {formatRupiah(margin)}
        </span>
      </div>
      <p
        className={`mt-1 text-sm font-medium ${
          lolos
            ? "text-green-700 dark:text-green-400"
            : "text-red-700 dark:text-red-400"
        }`}
      >
        {lolos
          ? `✅ Lolos target (${formatRupiah(target)})`
          : `❌ Di bawah target (${formatRupiah(target)}) — kurang ${formatRupiah(
              target - margin
            )}`}
      </p>
    </div>
  );
}
