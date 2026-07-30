import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { RevelarAoRolar } from "@/components/revelar-ao-rolar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Orçamento Climático do Estado do Acre",
    template: "%s | Orçamento Climático do Acre",
  },
  description:
    "Ferramenta inédita para organizar e acompanhar os gastos públicos destinados à proteção ambiental e ao enfrentamento das mudanças climáticas no Estado do Acre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          {/* Observa os blocos `data-revelar` de qualquer rota. Não renderiza
              nada, então fica fora da árvore visual. */}
          <RevelarAoRolar />
        </ThemeProvider>
      </body>
    </html>
  );
}
