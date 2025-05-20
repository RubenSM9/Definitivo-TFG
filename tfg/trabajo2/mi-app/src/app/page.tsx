'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-extrabold text-[#C1E49B] drop-shadow-[0_0_15px_#C1E49B] animate-glow">
        Zentasker ⚡
      </h1>

      <p className="mt-6 text-lg md:text-xl font-semibold text-cyan-200 max-w-2xl drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-opacity duration-1000">
        Tu nuevo gestor de tareas con poder eléctrico. <br />
        Organiza. Prioriza. <span className="text-cyan-300 font-bold">¡Domina tu día con estilo!</span>
      </p>

      <div className="mt-12">
        <Link href="/login">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105">
            Empezar
          </button>
        </Link>
      </div>
    </div>
  );
}
