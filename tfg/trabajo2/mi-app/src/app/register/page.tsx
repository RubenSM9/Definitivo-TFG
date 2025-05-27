'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EtiquetaLarga from '../../components/etiqueta_larga';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { createUserProfile } from '@/firebase/firebaseOperations';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'god' | 'gratis' | 'pro' | 'premium'>('gratis');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Crear perfil de usuario en Firestore
      await createUserProfile(userCredential.user.uid, {
        displayName: name,
        email: email,
        photoURL: null,
        role: role,
        settings: {
          theme: 'light',
          notifications: true
        }
      });

      router.push('/login');
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      
      // Mensajes de error más detallados
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('Este correo electrónico ya está registrado');
          break;
        case 'auth/invalid-email':
          setError('El formato del correo electrónico no es válido');
          break;
        case 'auth/operation-not-allowed':
          setError('El registro con correo electrónico no está habilitado');
          break;
        case 'auth/weak-password':
          setError('La contraseña debe tener al menos 6 caracteres');
          break;
        default:
          setError('Error al registrar usuario: ' + error.message);
      }
    }
  };

  return (
    <EtiquetaLarga>
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
        Crear Cuenta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Usuario
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'god' | 'gratis' | 'pro' | 'premium')}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          >
            <option value="gratis">Gratis</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
            <option value="god">Administrador</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Registrarse
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </EtiquetaLarga>
  );
}
