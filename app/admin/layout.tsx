import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  description: "Área de administração da Moncoy",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
