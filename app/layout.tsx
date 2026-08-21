import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EVA MODE", template: "%s | EVA MODE" },
  description: "فروشگاه تخصصی لباس زیر زنانه",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
