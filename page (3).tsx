"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { BUCKET, supabase } from "@/lib/supabase";
import { MATERIAL_TYPES } from "@/lib/types";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#E1E0CC] outline-none placeholder:text-[#E1E0CC]/30 focus:border-primary/50";

export default function UploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setChecking(false);
    });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File | null;

    if (!file || file.size === 0) return setError("PDF faylı seçin.");
    if (file.type !== "application/pdf") return setError("Yalnız PDF faylları qəbul olunur.");
    if (file.size > MAX_SIZE) return setError("Fayl 10 MB-dan böyük ola bilməz.");
    if (fd.get("rights") !== "on") return setError("Müəllif hüquqları ilə bağlı təsdiqi qeyd edin.");

    setBusy(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${Date.now()}-${safeName}`;

    const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: "application/pdf" });
    if (up.error) {
      setBusy(false);
      return setError("Fayl yüklənmədi: " + up.error.message);
    }

    const ins = await supabase.from("materials").insert({
      title: String(fd.get("title")).trim(),
      university: String(fd.get("university")).trim(),
      faculty: String(fd.get("faculty")).trim(),
      subject: String(fd.get("subject")).trim(),
      type: String(fd.get("type")),
      file_path: path,
      file_size: file.size,
    });

    if (ins.error) {
      await supabase.storage.from(BUCKET).remove([path]);
      setBusy(false);
      return setError("Yadda saxlanmadı: " + ins.error.message);
    }

    router.push("/materials");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-medium tracking-tight text-[#E1E0CC]">Material yüklə</h1>

        {checking ? (
          <p className="mt-8 text-[#E1E0CC]/40">Yoxlanılır...</p>
        ) : !userId ? (
          <p className="mt-8 text-[#E1E0CC]/70">
            Material yükləmək üçün{" "}
            <Link href="/login" className="text-primary underline">
              daxil olun
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <input name="title" required minLength={3} maxLength={150} placeholder="Başlıq (məs. Makroiqtisadiyyat, 3-cü mühazirə)" className={field} />
            <input name="university" required placeholder="Universitet" className={field} />
            <input name="faculty" required placeholder="Fakültə" className={field} />
            <input name="subject" required placeholder="Fənn" className={field} />
            <select name="type" required defaultValue="lecture" className={field + " bg-black"}>
              {Object.entries(MATERIAL_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input name="file" type="file" accept="application/pdf" required className={field} />
            <label className="flex items-start gap-2 text-sm text-[#E1E0CC]/60">
              <input name="rights" type="checkbox" className="mt-1" />
              Bu material mənə məxsusdur və ya paylaşılmasına icazə var; müəllif hüququ ilə qorunan dərslik və
              slaydları yükləmirəm.
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              disabled={busy}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Yüklənir..." : "Yüklə"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
