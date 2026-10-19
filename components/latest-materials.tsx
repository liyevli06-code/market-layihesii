"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Material, supabase } from "@/lib/supabase";
import MaterialCard from "./material-card";

export default function LatestMaterials() {
  const [items, setItems] = useState<Material[] | null>(null);

  useEffect(() => {
    supabase.from("materials").select("*").order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => setItems((data as Material[]) ?? []));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-3xl font-medium tracking-tight">Son yüklənənlər</h2>
        <Link href="/materials" className="btn-ghost">Hamısına bax</Link>
      </div>
      {items === null && <p className="text-primary/50">Yüklənir…</p>}
      {items?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center text-primary/60">
          Hələ material yoxdur. <Link href="/upload" className="underline">İlk faylı sən yüklə.</Link>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((m) => <MaterialCard key={m.id} m={m} />)}
      </div>
    </section>
  );
}
