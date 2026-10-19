"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MaterialCard } from "@/components/material-card";
import { BUCKET, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { MATERIAL_TYPES, type Material } from "@/lib/types";

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("materials").select("*").order("created_at", { ascending: false }).limit(60);

    const s = search.trim().replace(/[%,()]/g, "");
    if (s) {
      q = q.or(`title.ilike.%${s}%,subject.ilike.%${s}%,faculty.ilike.%${s}%,university.ilike.%${s}%`);
    }
    if (type) q = q.eq("type", type);

    const { data, error } = await q;
    if (error) {
      setMessage("Materialları yükləmək alınmadı. Supabase quraşdırmasını yoxlayın.");
      setItems([]);
    } else {
      setMessage("");
      setItems((data ?? []) as Material[]);
    }
    setLoading(false);
  }, [search, type]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleDownload(m: Material) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(m.file_path);
    await supabase.rpc("increment_downloads", { p_id: m.id });
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, downloads: x.downloads + 1 } : x)));
    window.open(data.publicUrl, "_blank", "noopener");
  }

  async function handleLike(m: Material) {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setMessage("Bəyənmək üçün daxil olun.");
    const { error } = await supabase.from("material_likes").insert({ material_id: m.id });
    if (error) {
      return setMessage(error.code === "23505" ? "Bu materialı artıq bəyənmisiniz." : "Bəyənmək alınmadı.");
    }
    setMessage("");
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, likes: x.likes + 1 } : x)));
  }

  async function handleReport(m: Material) {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setMessage("Şikayət etmək üçün daxil olun.");
    const reason = window.prompt("Şikayət səbəbi (məs. müəllif hüququ, spam, səhv məzmun):");
    if (!reason || reason.trim().length < 3) return;
    const { error } = await supabase.from("reports").insert({ material_id: m.id, reason: reason.trim() });
    setMessage(error ? "Şikayət göndərilmədi." : "Şikayətiniz qəbul olundu, təşəkkürlər.");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-medium tracking-tight text-[#E1E0CC] md:text-4xl">Materiallar</h1>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E1E0CC]/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Fənn, fakültə, universitet və ya başlıq üzrə axtar..."
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-[#E1E0CC] outline-none placeholder:text-[#E1E0CC]/30 focus:border-primary/50"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-full border border-white/10 bg-black px-4 py-3 text-sm text-[#E1E0CC] outline-none focus:border-primary/50"
          >
            <option value="">Bütün növlər</option>
            {Object.entries(MATERIAL_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {!isSupabaseConfigured && (
          <p className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            Supabase hələ qoşulmayıb. <code>.env.local</code> faylına URL və anon açarı əlavə edin (README-ə baxın).
          </p>
        )}
        {message && <p className="mt-6 text-sm text-[#E1E0CC]/70">{message}</p>}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <MaterialCard key={m.id} material={m} onDownload={handleDownload} onLike={handleLike} onReport={handleReport} />
          ))}
        </div>

        {!loading && items.length === 0 && !message && isSupabaseConfigured && (
          <p className="mt-16 text-center text-[#E1E0CC]/40">Hələ material yoxdur. İlk yükləyən sən ol.</p>
        )}
        {loading && <p className="mt-16 text-center text-[#E1E0CC]/40">Yüklənir...</p>}
      </main>
    </>
  );
}
