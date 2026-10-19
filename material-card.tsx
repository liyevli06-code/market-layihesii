"use client";

import { Download, Flag, ThumbsUp } from "lucide-react";
import { MATERIAL_TYPES, type Material } from "@/lib/types";
import { formatSize } from "@/lib/utils";

interface Props {
  material: Material;
  onDownload: (m: Material) => void;
  onLike: (m: Material) => void;
  onReport: (m: Material) => void;
}

export function MaterialCard({ material: m, onDownload, onLike, onReport }: Props) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div>
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
          {MATERIAL_TYPES[m.type] ?? m.type}
        </span>
        <h3 className="mt-3 text-lg font-medium leading-snug text-[#E1E0CC]">{m.title}</h3>
        <p className="mt-2 text-sm text-[#E1E0CC]/60">{m.subject}</p>
        <p className="text-sm text-[#E1E0CC]/40">
          {m.university} · {m.faculty}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 text-sm">
        <span className="text-[#E1E0CC]/40">
          {formatSize(m.file_size)} · {m.downloads} yükləmə
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onLike(m)}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[#E1E0CC]/70 transition-colors hover:bg-white/10"
            aria-label="Faydalıdır"
          >
            <ThumbsUp className="h-4 w-4" /> {m.likes}
          </button>
          <button
            onClick={() => onReport(m)}
            className="rounded-full p-2 text-[#E1E0CC]/40 transition-colors hover:bg-white/10 hover:text-[#E1E0CC]"
            aria-label="Şikayət et"
          >
            <Flag className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDownload(m)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 font-medium text-black transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Yüklə
          </button>
        </div>
      </div>
    </article>
  );
}
