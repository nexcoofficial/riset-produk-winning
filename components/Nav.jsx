"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "./DataProvider";

const LINKS = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/tracker", label: "Tracker", icon: "📋" },
  { href: "/sop", label: "SOP Harian", icon: "📅" },
  { href: "/kalkulator", label: "Kalkulator", icon: "🧮" },
  { href: "/pengaturan", label: "Pengaturan", icon: "⚙️" },
];

export default function Nav() {
  const pathname = usePathname();
  const { settings, updateSettings } = useData();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="text-xl">🎯</span>
            <span className="hidden sm:inline">Riset Produk Winning</span>
            <span className="sm:hidden">RPW</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(l.href)
                    ? "bg-brand text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() =>
              updateSettings({ darkMode: !(settings?.darkMode) })
            }
            className="btn-ghost !px-3 !py-2"
            aria-label="Ganti tema"
            title="Ganti tema gelap/terang"
          >
            {settings?.darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-5xl justify-around">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive(l.href)
                  ? "text-brand"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="text-lg">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
