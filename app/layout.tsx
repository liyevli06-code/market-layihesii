import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";

const font = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "UniShare — Tələbələr üçün material arxivi",
  description: "Mühazirə qeydləri, keçmiş imtahan sualları, xülasələr və sınaq testləri bir yerdə.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className={font.variable}>
        <SiteHeader />
        {children}
        <footer className="border-t border-line px-6 py-8 text-center text-sm text-primary/50">
          UniShare — tələbələr tərəfindən, tələbələr üçün.
        </footer>
      </body>
    </html>
  );
}
