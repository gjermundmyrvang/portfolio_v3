import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Russo_One } from "next/font/google";
import Footer from "../components/footer";
import "./globals.css";
import CircuitBackground from "../components/circuit-background";

const jetMono = JetBrains_Mono({
  variable: "--font-jetMono",
  subsets: ["latin"],
});

const russo = Russo_One({
  variable: "--font-russo",
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gjermund Portfolio",
  description: "By Gjermund Persson Myrvang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetMono.variable} ${russo.variable}  ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CircuitBackground />
        <main className="mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
