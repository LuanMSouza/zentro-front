import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/componentes/footer";

export const metadata: Metadata = {
  title: "Zentro - Gestão financeita inteligente",
  description: "Zentro: Controle, Equilíbrio e Foco para suas Finanças.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Zentro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}