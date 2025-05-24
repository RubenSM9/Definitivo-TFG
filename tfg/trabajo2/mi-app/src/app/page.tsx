'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <section className="w-full min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
      <div className="text-center max-w-3xl">

        {/* Logo + nombre animado */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#C1E49B] drop-shadow-[0_0_20px_#C1E49B] animate-glow tracking-wide">
          Zentasker <span className="animate-pulse">⚡</span>
        </h1>

        {/* Subtítulo convincente */}
        <p className="mt-6 text-xl md:text-2xl text-cyan-200 font-medium drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] leading-relaxed">
          Planifica, organiza y prioriza tu día con estilo.  
          <br className="hidden md:block" />
          Tu productividad nunca había tenido tanto flow.
        </p>

        {/* Beneficios claros */}
        <div className="mt-8 flex flex-col items-center space-y-2 text-cyan-100 text-sm md:text-base font-light">
          <div>🚀 Organiza en segundos con arrastrar y soltar</div>
          <div>🎯 Prioriza visualmente con etiquetas y colores</div>
          <div>🌘 Modo oscuro neón activado automáticamente</div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link href="/login">
            <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:scale-105 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-transform duration-300">
              Empezar ahora
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
