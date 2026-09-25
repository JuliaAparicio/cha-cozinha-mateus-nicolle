import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chá de Cozinha | Nicolle e Mateus",
  description:
    "Um novo capítulo começa. Celebre esse momento especial com Nicolle e Mateus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${poppins.variable} bg-[#F8F6F0] text-[#333333] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}