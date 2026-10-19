import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniShare – Tələbə materialları platforması",
  description:
    "Mühazirə qeydləri, konspektlər, mövzu xülasələri və sınaq testləri: fakültə və fənn üzrə tap, yüklə, paylaş.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className="bg-black text-[#E1E0CC] antialiased">{children}</body>
    </html>
  );
}
