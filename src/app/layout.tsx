import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropAgent",
  description: "AI property management agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
