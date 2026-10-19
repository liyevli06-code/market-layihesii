"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SiteHeader() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (pathname === "/") return null; // ana səhifədə hero-nun öz naviqasiyası var

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">UniShare</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/materials" className="px-2 text-primary/80 hover:text-primary">Materiallar</Link>
          <Link href="/upload" className="btn">Yüklə</Link>
          {email ? (
            <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>Çıxış</button>
          ) : (
            <Link href="/login" className="btn-ghost">Daxil ol</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
