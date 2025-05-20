'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import Image from 'next/image';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aboutRef.current &&
        !(aboutRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-fuchsia-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_lila-removebg-preview.png"
            alt="Zentasker Logo"
            width={60}
            height={60}
          />
        </Link>

        <nav className="flex items-center gap-6 text-white relative">
          <Link
            href="/funciones/tareas"
            className={`hover:text-cyan-300 transition ${
              pathname === '/funciones/tareas' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Funciones
          </Link>

          <Link
            href="/planes/premium"
            className={`hover:text-cyan-300 transition ${
              pathname === '/planes/premium' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Planes
          </Link>

          <div className="relative" ref={aboutRef}>
            <button
              onClick={() => setAboutOpen(!aboutOpen)}
              className={`hover:text-cyan-300 transition ${
                pathname?.startsWith('/sobre-nosotros') ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Sobre Nosotros
            </button>
            {aboutOpen && (
              <div className="absolute top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                <Link
                  href="/sobre-nosotros/historia"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-600 transition"
                >
                  Nuestra historia
                </Link>
                <Link
                  href="/sobre-nosotros/Equipo"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-600 transition"
                >
                  El equipo
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contacto/PaginaContacto"
            className={`hover:text-cyan-300 transition ${
              pathname === '/contacto/PaginaContacto' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Contacto
          </Link>

          {authChecked && (
            !isAuthenticated ? (
              <>
                <Link href="/login">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow transition">
                    Iniciar sesión
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm shadow transition">
                    Registrarse
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/first">
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full text-sm shadow transition">
                    Ir al panel
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow transition"
                >
                  Cerrar sesión
                </button>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
