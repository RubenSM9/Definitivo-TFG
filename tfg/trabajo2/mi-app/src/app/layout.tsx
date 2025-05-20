// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
<<<<<<< HEAD
import Footer from "../components/footer"; 
=======
import Footer from "../components/footer";
>>>>>>> 840b7e1 (Ahora si)

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
<<<<<<< HEAD
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main
          className="flex flex-col min-h-screen bg-white text-black"
          style={{
            backgroundImage: "url('/images/fondo_lila.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Header />

          <div className="flex-grow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
              {children}
            </div>
          </div>

          <Footer />
        </main>
=======
    <html lang="es" className="h-full">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} 
          antialiased text-white h-full
        `}
      >
        <div className="flex flex-col min-h-screen">
          <Header />

          {/* Esto asegura que el contenido ocupe el espacio restante */}
          <main className="flex-grow">
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-24">
              {children}
            </div>
          </main>

          <Footer />
        </div>
>>>>>>> 840b7e1 (Ahora si)
      </body>
    </html>
  );
}
