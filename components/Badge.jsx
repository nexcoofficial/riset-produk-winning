const COLORS = {
  green:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  slate:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  brand:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
};

export default function Badge({ color = "slate", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}

// Warna badge per status produk.
export const STATUS_COLORS = {
  Riset: "slate",
  Validasi: "yellow",
  "Siap Eksekusi": "brand",
  "Sedang Diiklankan": "yellow",
  Winning: "green",
  Gugur: "red",
};
