"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/lib/supabase";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#E1E0CC] outline-none placeholder:text-[#E1E0CC]/30 focus:border-primary/50";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setBusy(false);
      if (error) return setMessage(error.message);
      if (!data.session) return setMessage("E-poçtunuza təsdiq linki göndərildi. Təsdiqlədikdən sonra daxil olun.");
      return router.push("/materials");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMessage("E-poçt və ya şifrə yanlışdır.");
    router.push("/materials");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-3xl font-medium tracking-tight text-[#E1E0CC]">
          {mode === "signin" ? "Daxil ol" : "Qeydiyyat"}
        </h1>
        <p className="mt-2 text-sm text-[#E1E0CC]/50">Yükləmək, bəyənmək və şikayət etmək üçün hesab lazımdır.</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-poçt (tercihən universitet e-poçtu)" className={field} />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifrə (ən azı 6 simvol)" className={field} />
          {message && <p className="text-sm text-[#E1E0CC]/70">{message}</p>}
          <button
            disabled={busy}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Gözləyin..." : mode === "signin" ? "Daxil ol" : "Qeydiyyatdan keç"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-[#E1E0CC]/60 underline"
        >
          {mode === "signin" ? "Hesabın yoxdur? Qeydiyyatdan keç" : "Hesabın var? Daxil ol"}
        </button>
      </main>
    </>
  );
}
