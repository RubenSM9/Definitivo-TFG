/**
 * Página "Sobre Nosotros" de Zentasker
 * Presenta información sobre el equipo y la misión del proyecto
 * Incluye una imagen del equipo y una descripción de los valores
 * Tiene una sección de llamada a la acción para unirse
 */
import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center">
        ¿Quiénes Somos?
      </h1>

      <div className="mt-12 space-y-6">
        <img
          src="/images/team-image.jpg"
          alt="Nuestro Equipo"
          className="w-full h-auto rounded-xl shadow-2xl transform transition-transform hover:scale-105 duration-300"
        />
        <p className="text-lg md:text-xl text-gray-300">
          En **Zentasker**, somos un equipo de entusiastas de la productividad y el diseño. Nuestra misión es ayudarte a mantener tus tareas organizadas, mientras disfrutas del proceso y lo haces de forma visualmente atractiva.
          <br />
          Utilizamos la tecnología y el estilo para asegurarnos de que puedas tener el control total de tu día, sin dejar de lado lo importante: disfrutar el camino.
        </p>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-semibold text-white mb-6">¿Estás listo para unirte a Zentasker?</h2>
        <p className="text-lg text-gray-300 mb-8">
          Únete a cientos de usuarios satisfechos que han transformado su productividad con nosotros. 
          No esperes más para tomar el control de tu día y optimizar tu flujo de trabajo.
        </p>
      </div>
    </div>
  )
}
