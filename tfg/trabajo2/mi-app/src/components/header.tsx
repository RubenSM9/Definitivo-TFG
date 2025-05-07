'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    title: 'Funciones',
    options: [
      { label: 'Planificacion', href: '/funciones/tareas' },
    ]
  },
  {
    title: 'Planes',
    options: [
      { label: 'Plan', href: '/planes/premium' },
    ]
  },
  {
    title: 'Sobre Nosotros',
    options: [
      { label: 'Nuestra historia', href: '/sobre-nosotros/historia' },
      { label: 'El equipo', href: '/sobre-nosotros/Equipo' },
    ]
  },
  {
    title: 'Contacto',
    options: [
      { label: 'Página de Contacto', href: '/contacto/PaginaContacto' }, // Agregado el label
    ]
  },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const menuRef = useRef(null)
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
          >
            Zentasker
          </Link>

          {isAboutPage ? (
            // Mostrar solo botones de login/register si estás en /about
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
          ) : (
            // Si no estás en /about, mostrar el menú desplegable
            <nav className="flex items-center gap-8 relative" ref={menuRef}>
              {menuItems.map((item, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === index ? null : index)}
                    className="text-white hover:text-cyan-400 transition"
                  >
                    {item.title}
                  </button>

                  <div
                    className={`absolute top-full mt-1 w-52 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 transition-all duration-300 ease-out transform origin-top ${
                      openMenu === index
                        ? 'opacity-100 scale-100 translate-y-2 visible pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-1 invisible pointer-events-none'
                    }`}
                  >
                    {item.options.map((option, idx) => (
                      <Link
                        key={idx}
                        href={option.href}
                        className="block px-4 py-2 hover:bg-cyan-600 text-sm text-gray-200 rounded transition-colors duration-200"
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-4 ml-6">
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
    </header>
  )
}
