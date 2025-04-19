/**
 * Página principal de Zentasker
 * Muestra la pantalla de bienvenida con el logo y una breve descripción
 * Incluye un botón para comenzar que redirige a la página about
 */
import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
        Bienvenido a
      </h1>
      <h2 className="text-6xl md:text-8xl font-extrabold mt-4 text-neon-purple animate-glow">
        Zentasker ⚡
      </h2>
      <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        Tu nuevo gestor de tareas con poder eléctrico. Organiza. Prioriza. ¡Domina tu día con estilo!
      </p>
      <div className="mt-12">
        <Link href="/about">
          <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white text-lg font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
            Empezar →
          </button>
        </Link>
      </div>
    </div>
  )
}
