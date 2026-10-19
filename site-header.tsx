import Link from "next/link";

const links = [
  { href: "/materials", label: "Materiallar" },
  { href: "/upload", label: "Yüklə" },
  { href: "/login", label: "Giriş" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-medium tracking-tight text-[#E1E0CC]">
          UniShare<span className="align-super text-xs">*</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[#E1E0CC]/70 transition-colors hover:text-[#E1E0CC]">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
