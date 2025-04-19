/**
 * Página de Inicio de Sesión
 * Permite a los usuarios existentes acceder a su cuenta
 * Incluye un formulario para email y contraseña
 * Ofrece enlaces para registrarse y acceso especial para desarrolladores
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EtiquetaLarga from '../../components/etiqueta_larga';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log('Login attempt:', { email, password });
    // router.push('/dashboard'); // Descomentar cuando tengas la autenticación
  };

  return (
    <EtiquetaLarga>
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
        Iniciar Sesión
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
            Regístrate
          </Link>
        </p>
        <Link 
          href="/first" 
          className="mt-4 block text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Login de Desarrollador
        </Link>
      </div>
    </EtiquetaLarga>
  );
} 