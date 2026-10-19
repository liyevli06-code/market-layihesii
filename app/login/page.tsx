"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("Giriş alınmadı: e-poçt və ya şifrə yanlışdır.");
      else router.push("/upload");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setMsg(error.message);
      else if (data.session) router.push("/upload");
      else setMsg("Qeydiyyat uğurludur. E-poçtuna gələn təsdiq linkinə klik et, sonra daxil ol.");
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-4xl font-medium tracking-tight">{mode === "in" ? "Daxil ol" : "Qeydiyyat"}</h1>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <input className="field" type="email" required placeholder="E-poçt" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" required minLength={6} placeholder="Şifrə (ən azı 6 simvol)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn w-full" disabled={busy}>{busy ? "Gözlə…" : mode === "in" ? "Daxil ol" : "Hesab yarat"}</button>
        {msg && <p className="text-sm text-primary/80">{msg}</p>}
      </form>
      <button className="mt-6 text-sm text-primary/60 underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Hesabın yoxdur? Qeydiyyatdan keç" : "Hesabın var? Daxil ol"}
      </button>
    </main>
  );
}
