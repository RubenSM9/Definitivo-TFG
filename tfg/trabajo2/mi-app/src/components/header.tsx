'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import Image from 'next/image';
import { LayoutDashboard, LogOut, LogIn, UserPlus, Menu, Shield } from 'lucide-react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
      
      if (user) {
        // Verificar si el usuario es administrador
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === 'god');
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setMenuOpen(false);
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_lila-removebg-preview.png"
            alt="Zentasker Logo"
            width={60}
            height={60}
          />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-white relative ml-auto">
          {isAuthenticated && (
            <div className="text-sm text-gray-500 font-bold bg-white/10 px-4 py-2 rounded-full hidden sm:block">
              {auth.currentUser?.email}
            </div>
          )}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow transition flex items-center justify-center"
            >
              <Menu className="w-6 h-6 text-purple-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                <Link
                  href="/funciones/tareas"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 transition"
                >
                  Funciones
                </Link>
                <Link
                  href="/planes/premium"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 transition"
                >
                  Planes
                </Link>
                <Link
                  href="/sobre-nosotros/historia"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 transition"
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="/contacto/PaginaContacto"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 transition"
                >
                  Contacto
                </Link>
                {isAuthenticated && isAdmin && (
                  <Link
                    href="/admin_vista"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 transition"
                  >
                    Panel de Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          {authChecked && (
            !isAuthenticated ? (
              <>
                <Link href="/register">
                  <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow transition flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-pink-500" />
                  </button>
                </Link>

                <Link href="/login">
                  <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow transition flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-blue-500" />
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/first">
                  <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow transition flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-blue-500" />
                  </button>
                </Link>
                {isAdmin && (
                  <Link href="/admin_vista">
                    <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow transition flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-500" />
                    </button>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow transition flex items-center justify-center"
                >
                  <LogOut className="w-6 h-6 text-red-500" />
                </button>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
