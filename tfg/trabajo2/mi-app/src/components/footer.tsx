// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 text-white py-10 px-6 mt-[400px] shadow-inner border-t border-purple-700/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 py-10 gap-8 text-center md:text-left">
          
          {/* Branding */}
          <div>
            <h2 className="text-xl font-bold tracking-wider mb-2">⚡ Zentasker</h2>
            <p className="text-sm text-gray-300">
              El poder de la planificación, en tus manos. Organiza, prioriza y domina tu día con estilo.
            </p>
          </div>
  
          {/* Navegación */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Enlaces rápidos</h3>
            <ul className="space-y-1 text-sm text-blue-300">
              <li><a href="/tablero" className="hover:text-white transition">Tablero</a></li>
              <li><a href="/planes" className="hover:text-white transition">Planes de uso</a></li>
              <li><a href="/login" className="hover:text-white transition">Iniciar sesión</a></li>
              <li><a href="/contacto" className="hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
  
          {/* Redes o copy */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Síguenos</h3>
            <p className="text-sm text-gray-400 mb-2">Mantente actualizado con nuestras mejoras 🔧</p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">LinkedIn</a>
            </div>
          </div>
  
        </div>
  
        {/* Abajo del todo */}
        <div className="text-center mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} Zentasker. Todos los derechos reservados.
        </div>
      </footer>
    );
  }
  