import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kreuzberg Web - PDF to Markdown",
  description: "Convert PDF documents to Markdown using Kreuzberg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
