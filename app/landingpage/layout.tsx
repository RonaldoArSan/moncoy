import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moncoy - Sua Plataforma Financeira Inteligente",
  description: "Moncoy é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
  keywords: ["finanças pessoais", "investimentos", "metas financeiras", "inteligência artificial", "IA", "gestão financeira", "planejamento financeiro", "controle de gastos", "orçamento", "moncoy", "landing page"],
  openGraph: {
    title: "Moncoy - Sua Plataforma Financeira Inteligente",
    description: "Moncoy é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.",
    url: "https://www.moncoy.com.br",
    siteName: "Moncoy",
    images: [
      {
        url: "https://www.moncoy.com.br/moncoy-dashboard.jpeg", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "Moncoy Dashboard",
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