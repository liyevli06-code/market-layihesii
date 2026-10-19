"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import MaterialCard from "@/components/material-card";
import { Material, TYPE_LABELS, supabase } from "@/lib/supabase";

export default function MaterialsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [items, setItems] = useState<Material[] | null>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      setItems(null);
      let query = supabase.from("materials").select("*").order("created_at", { ascending: false }).limit(60);
      if (type) query = query.eq("type", type);
      const term = q.trim().replace(/[%,()]/g, "");
      if (term) query = query.or(`title.ilike.%${term}%,subject.ilike.%${term}%,faculty.ilike.%${term}%,university.ilike.%${term}%`);
      const { data } = await query;
      setItems((data as Material[]) ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [q, type]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-medium tracking-tight">Materiallar</h1>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
          <input className="field !pl-11" placeholder="Fənn, fakültə, universitet və ya başlıq axtar" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="field sm:w-60" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Bütün növlər</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="mt-8">
        {items === null && <p className="text-primary/50">Yüklənir…</p>}
        {items?.length === 0 && <p className="text-primary/60">Heç nə tapılmadı. Axtarışı dəyiş və ya özün yüklə.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((m) => <MaterialCard key={m.id} m={m} />)}
        </div>
      </div>
    </main>
  );
}
