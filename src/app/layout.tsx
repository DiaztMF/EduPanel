import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPanel Hub | Interactive Learning Games for IFP",
  description:
    "A collection of 12 educational multiplayer mini-games optimized for Interactive Flat Panels (IFP) in school classrooms. Gamify learning with competitive, collaborative touch experiences.",
  keywords: ["educational games", "interactive flat panel", "IFP", "classroom games", "multiplayer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-hidden">
        <div className="viewport-container bg-animated-gradient bg-noise">
          {children}
        </div>
      </body>
    </html>
  );
}
