'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Zentasker
            </Link>
          </div>
          {isAboutPage && (
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:scale-105 transition-all duration-300">
                    Iniciar sesión
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:scale-105 transition-all duration-300">
                    Registrarse
                  </button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}