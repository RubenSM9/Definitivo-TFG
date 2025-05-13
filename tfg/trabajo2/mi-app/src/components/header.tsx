'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react' // Asegúrate de tener instalado lucide-react

const menuItems = [
  {
    title: 'Funciones',
    options: [{ label: 'Planificación', href: '/funciones/tareas' }],
  },
  {
    title: 'Planes',
    options: [{ label: 'Plan', href: '/planes/premium' }],
  },
  {
    title: 'Sobre Nosotros',
    options: [
      { label: 'Nuestra historia', href: '/sobre-nosotros/historia' },
      { label: 'El equipo', href: '/sobre-nosotros/Equipo' },
    ],
  },
  {
    title: 'Contacto',
    options: [
      { label: 'Página de Contacto', href: '/contacto/PaginaContacto' },
    ],
  },
]

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setOpenMenu(false)
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

          <nav className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="text-white hover:text-cyan-400 transition"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 transition-all duration-300 ease-out transform origin-top ${
                openMenu
                  ? 'opacity-100 scale-100 translate-y-2 visible pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-1 invisible pointer-events-none'
              }`}
            >
              {menuItems.map((item, index) => (
                <div key={index} className="px-4 py-2">
                  <div className="text-gray-400 text-sm font-semibold mb-1">{item.title}</div>
                  {item.options.map((option, idx) => (
                    <Link
                      key={idx}
                      href={option.href}
                      className="block px-2 py-1 hover:bg-cyan-600 text-sm text-gray-200 rounded transition-colors duration-200"
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
