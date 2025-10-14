import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import ClientLayout from "./client-layout";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MoncoyFinance - Sua Plataforma Financeira Inteligente",
    template: "%s | MoncoyFinance",
  },
  verification: {
     google: 'google49731200e9d914ce',
  },
  description: "MoncoyFinance é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
  keywords: ["finanças pessoais", "investimentos", "metas financeiras", "inteligência artificial", "IA", "gestão financeira", "planejamento financeiro", "controle de gastos", "orçamento", "moncoyfinance"],
  openGraph: {
    title: "MoncoyFinance - Sua Plataforma Financeira Inteligente",
    description: "MoncoyFinance é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
    url: "https://moncoyfinance.com",
    siteName: "MoncoyFinance",
    images: [
      {
        url: "https://moncoyfinance.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MoncoyFinance Dashboard",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moncoy - Sua Plataforma Financeira Inteligente",
    description: "Moncoy é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
    images: ["https://www.moncoy.com.br/moncoy-dashboard.jpeg"], // Replace with your actual image URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Add other common SEO tags as needed
  // canonical: "https://www.moncoy.com.br",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
