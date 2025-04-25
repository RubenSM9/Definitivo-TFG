'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebaseConfig';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Si no hay usuario autenticado, redirigir al login
        router.push('/login');
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <p>Bienvenido {auth.currentUser?.email}</p>
      <button
        onClick={() => {
          auth.signOut();
          router.push('/login');
        }}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
