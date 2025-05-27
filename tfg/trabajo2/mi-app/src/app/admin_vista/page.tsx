'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import Header from '@/components/header';
import { updateUserBlockedStatus } from '@/firebase/firebaseOperations';

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  role: 'god' | 'gratis' | 'pro' | 'premium';
  isBlocked?: boolean;
}

export default function AdminView() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handlers para bloquear/desbloquear usuario
  const handleBlockUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres bloquear a este usuario?')) {
      try {
        await updateUserBlockedStatus(userId, true);
        fetchUsers(); // Refrescar la lista después de bloquear
      } catch (error) {
        console.error('Error blocking user:', error);
        alert('Error al bloquear usuario.');
      }
    }
  };

  const handleUnblockUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres desbloquear a este usuario?')) {
      try {
        await updateUserBlockedStatus(userId, false);
        fetchUsers(); // Refrescar la lista después de desbloquear
      } catch (error) {
        console.error('Error unblocking user:', error);
        alert('Error al desbloquear usuario.');
      }
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      // Verificar si el usuario es administrador
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'god') {
        router.push('/first');
        return;
      }
    };

    checkAdmin();
    fetchUsers();
  }, [router, fetchUsers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-full w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-[2.5rem] blur-xl opacity-20"></div>
            <div className="relative bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-lg border-4 border-purple-300">
              <h1 className="text-3xl font-bold text-purple-800 mb-8">Panel de Administración</h1>
              
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 overflow-hidden">
                <div className="px-6 py-5 bg-purple-50/50 border-b border-purple-200">
                  <h2 className="text-xl font-semibold text-purple-800">Lista de Usuarios</h2>
                  <p className="mt-1 text-sm text-gray-500">Todos los usuarios registrados en la plataforma</p>
                </div>
                
                <div className="divide-y divide-purple-100">
                  {users.map((user) => (
                    <div key={user.id} className="px-6 py-4 hover:bg-purple-50/50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center shadow-md">
                              <span className="text-white font-medium text-lg">
                                {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-medium text-gray-900">
                              {user.displayName || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500 bg-purple-50/50 px-4 py-2 rounded-full">
                            {user.role === 'god' ? 'Administrador' : user.role === 'gratis' ? 'Gratis' : user.role === 'pro' ? 'Pro' : user.role === 'premium' ? 'Premium' : 'Desconocido'}
                          </div>
                          <div className="text-sm text-gray-500 bg-purple-50/50 px-4 py-2 rounded-full">
                            Registrado el {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          {user.role !== 'god' && (
                            <button
                              onClick={() => user.isBlocked ? handleUnblockUser(user.id) : handleBlockUser(user.id)}
                              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${user.isBlocked ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                            >
                              {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 