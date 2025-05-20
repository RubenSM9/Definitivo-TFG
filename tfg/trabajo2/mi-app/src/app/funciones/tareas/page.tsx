'use client';

import Link from 'next/link';



export default function TareasPage() {
  return (
    <>
      <div className="p-8 max-w-6xl mx-auto animate-fade-in space-y-20">
        {/* Encabezado principal */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 drop-shadow-[0_0_10px_rgba(0,191,255,0.4)]">
            Planificación Inteligente ⚡
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Planifica, mantén la concentración y alcanza tu máximo potencial con el Planificador de <span className="font-bold text-white">Zentasker</span>.
          </p>
        </div>

        {/* Imagen central */}
        <div className="flex justify-center">
          <img
            src="/images/Calendario.png"
            alt="Planificador de Zentasker"
            className="w-full max-w-3xl h-auto rounded-xl shadow-2xl border border-purple-600/20"
          />
        </div>

        {/* Descripción y botón */}
        <div className="text-center space-y-6">
          <p className="text-md md:text-lg text-gray-400 max-w-2xl mx-auto">
            Diseñado para impulsarte a trabajar con enfoque, claridad y control. Visualiza tus tareas, prioriza lo importante, y empieza a ejecutar.
          </p>
          <Link href="/tablero">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold py-3 px-10 rounded-full shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-cyan-400 hover:shadow-blue-500/60 hover:scale-110 border border-white/10 backdrop-blur-sm">
              ⚡ Empezar ahora mismo →
            </button>
          </Link>
          <br /><br />
          <div>
            <Link href="/planes">
              <p className="text-blue-400 hover:text-blue-500 underline transition-colors duration-200 text-sm">
                Obtener más información sobre los planes de uso
              </p>
            </Link>
          </div>
        </div>

        {/* Sección extra 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-gray-300 space-y-4 text-center md:text-left">
            <h2 className="text-xl text-white font-bold">🧠 Planificación sin esfuerzo</h2>
            <p>
              ¡Entérate de todo! Planifica tareas y eventos directamente desde tus herramientas favoritas, como Google Calendar y Outlook.
            </p>
          </div>
          <img
            src="/images/GoogleDrive.png"
            alt="Integración con herramientas"
            className="w-full rounded-xl shadow-2xl border border-purple-600/20"
          />
        </div>

        {/* Sección extra 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <img
            src="/images/Intuitiva.png"
            alt="Organización intuitiva"
            className="w-full rounded-xl shadow-2xl border border-purple-600/20"
          />
          <div className="text-gray-300 space-y-4 text-center md:text-left">
            <h2 className="text-xl text-white font-bold">🎯 Organización intuitiva</h2>
            <p>
              ¿Estás listo para reservarte tus planes? Solo arrastra y suelta las tareas en los tableros adecuados. Fácil, rápido y visual.
            </p>
          </div>
        </div>

        {/* Sección extra 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-gray-300 space-y-4 text-center md:text-left">
            <h2 className="text-xl text-white font-bold">✅ No te desvíes del camino</h2>
            <p>
              ¿Tienes tareas rápidas? Márcalas como Completado directamente en el Planificador y mantén tu productividad al máximo.
            </p>
          </div>
          <img
            src="/images/Completada.png"
            alt="Tarea completada"
            className="w-full rounded-xl shadow-2xl border border-purple-600/20"
          />
        </div>
      </div>
    </>
  );
}
