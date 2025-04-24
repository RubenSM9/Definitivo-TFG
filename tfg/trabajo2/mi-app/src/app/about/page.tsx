import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-center">
        ¿Quiénes somos?
      </h1>

      <div className="mt-12 space-y-6">
        <Image
          src="/images/Equipo.jpg"
          alt="Nuestro Equipo"
          width={1200}    // El ancho deseado
          height={700}   // La altura deseada
          layout="intrinsic"  // Mantener proporciones y evitar que se vea borroso
          className="w-full h-auto rounded-xl shadow-2xl transform transition-transform hover:scale-105 duration-300"
        />
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Somos dos estudiantes del IES Francisco de Goya de Molina de Segura, apasionados por el desarrollo de aplicaciones web y comprometidos con crear herramientas que marquen la diferencia. Así nace <strong>Zentasker</strong>: un gestor de tareas con alma, pensado para que tu día sea más claro, organizado y productivo.
          <br /><br />
          Nuestro objetivo es simple: ayudarte a planificar, priorizar y conquistar tu día con estilo, tecnología y un toque eléctrico.
        </p>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-semibold text-white mb-6">¿Te unes a Zentasker?</h2>
        <p className="text-lg text-gray-300 mb-8">
          Ya somos parte del cambio. Ahora te toca a ti. Da el paso, únete a la revolución de la productividad y lleva tu organización al siguiente nivel.
        </p>
        <Link
          href="/register"
          className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition duration-300"
        >
          ¡Únete ahora!
        </Link>
      </div>
    </div>
  )
}
