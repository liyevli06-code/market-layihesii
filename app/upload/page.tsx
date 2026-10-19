"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TYPE_LABELS, supabase } from "@/lib/supabase";

const MAX_MB = 25;

export default function UploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [f, setF] = useState({ title: "", description: "", university: "", faculty: "", subject: "", type: "qeyd" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !userId) return;
    if (file.size > MAX_MB * 1024 * 1024) return setMsg(`Fayl ${MAX_MB} MB-dan böyük ola bilməz.`);
    setBusy(true); setMsg("");

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${Date.now()}-${safe}`;
    const up = await supabase.storage.from("materials").upload(path, file);
    if (up.error) { setBusy(false); return setMsg("Fayl yüklənmədi: " + up.error.message); }

    const { error } = await supabase.from("materials").insert({ ...f, file_path: path, file_name: file.name });
    setBusy(false);
    if (error) {
      await supabase.storage.from("materials").remove([path]);
      return setMsg("Məlumat yazılmadı: " + error.message);
    }
    router.push("/materials");
  }

  if (userId === undefined) return <main className="px-6 py-16 text-primary/50">Yüklənir…</main>;
  if (userId === null)
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-medium">Material yükləmək üçün daxil ol</h1>
        <Link href="/login" className="btn mt-6">Daxil ol</Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-4xl font-medium tracking-tight">Material yüklə</h1>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <input className="field" required placeholder="Başlıq (məs: Mikroiqtisadiyyat — Midterm 2024)" value={f.title} onChange={set("title")} />
        <select className="field" value={f.type} onChange={set("type")}>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input className="field" required placeholder="Universitet (məs: BDU)" value={f.university} onChange={set("university")} />
        <input className="field" required placeholder="Fakültə" value={f.faculty} onChange={set("faculty")} />
        <input className="field" required placeholder="Fənn" value={f.subject} onChange={set("subject")} />
        <textarea className="field" rows={3} placeholder="Qısa izah (istəyə bağlı)" value={f.description} onChange={set("description")} />
        <input
          className="field file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-black"
          type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-primary/50">PDF, Word, PowerPoint, şəkil · maksimum {MAX_MB} MB</p>
        <button className="btn w-full" disabled={busy}>{busy ? "Yüklənir…" : "Paylaş"}</button>
        {msg && <p className="text-sm text-primary/80">{msg}</p>}
      </form>
    </main>
  );
}
