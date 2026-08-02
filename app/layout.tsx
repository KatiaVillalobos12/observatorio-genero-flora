import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flora — Observatorio de Género en Educación Superior",
  description: "Flora, el asistente conversacional del Observatorio de Género en Educación Superior (PUCP)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>{children}</body>
    </html>
  );
}
