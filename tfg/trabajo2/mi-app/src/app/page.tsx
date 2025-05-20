<<<<<<< HEAD
import Link from 'next/link'
import Button from '../components/button'
=======
'use client';

import Link from 'next/link';
>>>>>>> 840b7e1 (Ahora si)

export default function Home() {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center text-center px-4">
      
      <h2 className="text-6xl md:text-8xl font-extrabold text-[#C1E49B] drop-shadow-lg animate-glow">
        Zentasker ⚡
      </h2>

<<<<<<< HEAD
      <p className="mt-6 text-lg md:text-xl font-extrabold text-black max-w-2xl">
        Tu nuevo gestor de tareas con poder eléctrico. <br />Organiza. Prioriza. ¡Domina tu día con estilo!
      </p>

      <div className="mt-12">
        <Link href="/login">
          <Button className="bg-[#C1E49B] text-black font-semibold py-3 px-6 rounded-2xl shadow-lg transition duration-300">
            Empezar
          </Button>
        </Link>
      </div>
=======
>>>>>>> 840b7e1 (Ahora si)
    </div>
  )
}
