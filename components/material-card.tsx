"use client";
import { Download, FileText } from "lucide-react";
import { Material, TYPE_LABELS, supabase } from "@/lib/supabase";

export default function MaterialCard({ m }: { m: Material }) {
  const url = supabase.storage.from("materials").getPublicUrl(m.file_path, { download: m.file_name }).data.publicUrl;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-line bg-panel p-5">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-primary/60">
          <FileText className="h-4 w-4" />
          {TYPE_LABELS[m.type]}
        </div>
        <h3 className="text-lg font-medium leading-snug">{m.title}</h3>
        <p className="mt-1 text-sm text-primary/60">{m.subject} · {m.faculty}</p>
        <p className="text-sm text-primary/60">{m.university}</p>
        {m.description && <p className="mt-3 line-clamp-3 text-sm text-primary/70">{m.description}</p>}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-primary/50">{m.downloads} yükləmə</span>
        <a
          href={url}
          onClick={() => supabase.rpc("increment_downloads", { material_id: m.id })}
          className="btn !py-2"
        >
          <Download className="h-4 w-4" /> Yüklə
        </a>
      </div>
    </article>
  );
}
