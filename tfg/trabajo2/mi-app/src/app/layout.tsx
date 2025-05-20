// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zentasker",
  description: "Planifica y domina tu día con estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} 
          antialiased text-white h-full
        `}
      >
        {/* Fondo degradado animado + estructura principal */}
        <div className="flex flex-col min-h-screen">
          <Header />

          <main className="flex-grow">
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-24">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
