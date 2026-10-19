import Link from "next/link";
import { Download, Search, Upload } from "lucide-react";
import { PrismaHero } from "@/components/ui/prisma-hero";

const steps = [
  {
    icon: Search,
    title: "Tap",
    text: "Universitet, fakültə və fənn üzrə axtar. Lazım olan konspekt bir neçə saniyəyə qarşındadır.",
  },
  {
    icon: Download,
    title: "Yüklə",
    text: "PDF-i qeydiyyatsız yüklə, imtahandan əvvəl telefonunda və ya noutbukunda hazır olsun.",
  },
  {
    icon: Upload,
    title: "Paylaş",
    text: "Öz qeydlərini yüklə, yoldaşlarına kömək et. Ən faydalı materiallar yuxarı çıxır.",
  },
];

export default function Home() {
  return (
    <main className="bg-black">
      <div className="p-2 md:p-3">
        <PrismaHero
          title="UniShare"
          description="Azərbaycan tələbələri üçün mühazirə qeydləri, mövzu xülasələri və sınaq testləri bir yerdə. Fayllar artıq Telegram qruplarında itmir: fakültə və fənn üzrə tap, yüklə, paylaş."
          ctaLabel="Materialları kəşf et"
          ctaHref="/materials"
          navItems={[
            { label: "Haqqında", href: "#haqqinda" },
            { label: "Necə işləyir", href: "#nece-isleyir" },
            { label: "Materiallar", href: "/materials" },
            { label: "Yüklə", href: "/upload" },
            { label: "Giriş", href: "/login" },
          ]}
        />
      </div>

      <section id="haqqinda" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-medium tracking-tight text-[#E1E0CC] md:text-5xl">
          Qeydlər bir yerdə, imtahan stresi daha az.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-[#E1E0CC]/60 md:text-lg">
          Hər sessiyada eyni hekayə: lazım olan fayl qrupun altında itib, kimsə onu göndərməyi unudub. UniShare
          tələbələrin qeydlərini fənn üzrə toplayan açıq arxivdir.
        </p>
      </section>

      <section id="nece-isleyir" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-xl font-medium text-[#E1E0CC]">{s.title}</h3>
              <p className="mt-2 text-sm text-[#E1E0CC]/60">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-[#E1E0CC]/60">Qeydlərin var? İlk paylaşan sən ol.</p>
          <Link
            href="/upload"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Material yüklə
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-[#E1E0CC]/40">
        © {new Date().getFullYear()} UniShare. Müəllif hüququ ilə qorunan materialı yükləməyin; şikayət üçün hər
        kartdakı bayraq düyməsindən istifadə edin.
      </footer>
    </main>
  );
}
