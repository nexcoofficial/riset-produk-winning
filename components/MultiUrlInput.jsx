"use client";

import { useState } from "react";

// Input untuk menambah beberapa URL (foto/video) dengan preview opsional.
export default function MultiUrlInput({
  label,
  urls = [],
  onChange,
  preview = false,
  placeholder = "https://…",
}) {
  const [val, setVal] = useState("");

  const add = () => {
    const v = val.trim();
    if (!v) return;
    onChange([...urls, v]);
    setVal("");
  };

  const remove = (i) => onChange(urls.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input
          className="input"
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="btn-ghost shrink-0" onClick={add}>
          Tambah
        </button>
      </div>

      {urls.length > 0 && (
        <ul className="mt-2 space-y-2">
          {urls.map((u, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700"
            >
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={u}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded object-cover"
                />
              )}
              <a
                href={u}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-sm text-brand hover:underline"
              >
                {u}
              </a>
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 text-red-500 hover:text-red-600"
                aria-label="Hapus"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
