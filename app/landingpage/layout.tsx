import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoncoyFinance - Sua Plataforma Financeira Inteligente",
  description:
    "MoncoyFinance é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
  keywords: [
    "finanças pessoais",
    "investimentos",
    "metas financeiras",
    "inteligência artificial",
    "IA",
    "gestão financeira",
    "planejamento financeiro",
    "controle de gastos",
    "orçamento",
    "moncoyfinance",
    "landing page",
  ],
  openGraph: {
    title: "MoncoyFinance - Sua Plataforma Financeira Inteligente",
    description:
      "MoncoyFinance é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
    url: "https://moncoyfinance.com/landingpage",
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
    title: "MoncoyFinance - Sua Plataforma Financeira Inteligente",
    description:
      "MoncoyFinance é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
    images: ["https://moncoyfinance.com/og-image.png"],
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
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}