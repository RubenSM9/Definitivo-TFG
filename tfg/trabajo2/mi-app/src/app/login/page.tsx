'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EtiquetaLarga from '../../components/etiqueta_larga';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Intentando iniciar sesión con:', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario logueado exitosamente:', userCredential.user);
      router.push('/first'); // Redirige a la carpeta "first"
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Detalles del error:', {
        código: err.code,
        mensaje: err.message
      });

      // Mensajes de error más detallados
      switch(err.code) {
        case 'auth/invalid-credential':
          setError('Correo o contraseña incorrectos');
          break;
        case 'auth/invalid-email':
          setError('El formato del correo electrónico no es válido');
          break;
        case 'auth/network-request-failed':
          setError('Error de conexión. Verifica tu conexión a internet.');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos fallidos. Intenta más tarde.');
          break;
        case 'auth/api-key-not-valid':
          setError('Error de configuración de Firebase. Contacta al administrador.');
          break;
        case 'auth/password-compromised':
          setError('Esta contraseña ha sido comprometida en una brecha de datos. Por favor, cambia tu contraseña.');
          break;
        default:
          setError(err.message || 'Error desconocido');
      }
    }
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

      {error && (
        <p className="mt-4 text-red-500 text-center">{error}</p>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </EtiquetaLarga>
  );
}