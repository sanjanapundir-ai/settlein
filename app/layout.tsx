import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-baloo" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "SettleIn",
  description: "Compare flats together — facts and tradeoffs for each of us, no rankings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-screen font-body antialiased">{children}</body>
    </html>
  );
}
