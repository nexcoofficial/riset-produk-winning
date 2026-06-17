import Badge from "./Badge";
import { hitungSkorValidasi, labelSkor } from "@/lib/logic";

// Badge ringkas skor validasi.
export function SkorBadge({ produk, targetMargin }) {
  const { skor } = hitungSkorValidasi(produk, targetMargin);
  const { teks, warna } = labelSkor(skor);
  return (
    <Badge color={warna}>
      {skor}/4 · {teks}
    </Badge>
  );
}

// Rincian per kriteria (dipakai di halaman detail).
export function SkorRincian({ produk, targetMargin }) {
  const { skor, kriteria } = hitungSkorValidasi(produk, targetMargin);
  const { teks, warna } = labelSkor(skor);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Skor Validasi
        </span>
        <Badge color={warna}>
          {skor}/4 · {teks}
        </Badge>
      </div>
      <ul className="space-y-1.5">
        {kriteria.map((k) => (
          <li
            key={k.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2">
              <span>{k.lolos ? "✅" : "⬜"}</span>
              <span
                className={
                  k.lolos
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
                }
              >
                {k.label}
              </span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {k.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
