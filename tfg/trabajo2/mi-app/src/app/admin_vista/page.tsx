'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import Header from '@/components/header';
import { updateUserBlockedStatus, updateUserRole } from '@/firebase/firebaseOperations';

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  role: 'god' | 'gratis' | 'pro' | 'premium';
  isBlocked?: boolean;
  proStartDate?: string;
  premiumStartDate?: string;
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

  const handleBlockUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres bloquear a este usuario?')) {
      try {
        await updateUserBlockedStatus(userId, true);
        fetchUsers();

        // Find the blocked user's email from the current users list
        const blockedUser = users.find(user => user.id === userId);

        if (blockedUser) {
          // Send email notification
          try {
            const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: blockedUser.email,
                subject: 'Tu cuenta ha sido bloqueada',
                message: `<p>Hola ${blockedUser.displayName || blockedUser.email},</p><p>Te informamos que tu cuenta en Zentasker ha sido bloqueada por un administrador. Si crees que ha sido un error, por favor contacta con soporte.</p><p>Saludos,<br/>El equipo de Zentasker</p>`,
              }),
            });

            const data = await response.json();
            if (data.success) {
              console.log(`Email de bloqueo enviado a ${blockedUser.email}`);
            } else {
              console.error(`Error al enviar email de bloqueo a ${blockedUser.email}:`, data.error);
            }
          } catch (emailError) {
            console.error(`Error de red al intentar enviar email de bloqueo a ${blockedUser.email}:`, emailError);
          }
        }

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
        fetchUsers();
      } catch (error) {
        console.error('Error unblocking user:', error);
        alert('Error al desbloquear usuario.');
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      // Find the user in the current users list to get their current role
      const userToUpdate = users.find(user => user.id === userId);
      const oldRole = userToUpdate?.role;

      await updateUserRole(userId, newRole);
      fetchUsers();

      // Send email notification if the role actually changed and user was found
      if (userToUpdate && oldRole !== newRole) {
        let action = '';
        if (newRole === 'gratis' && (oldRole === 'pro' || oldRole === 'premium')) {
          action = 'bajado a';
        } else if (newRole === 'pro' && oldRole === 'gratis') {
          action = 'subido a';
        } else if (newRole === 'pro' && oldRole === 'premium') {
          action = 'bajado a';
        } else if (newRole === 'premium' && (oldRole === 'gratis' || oldRole === 'pro')) {
          action = 'subido a';
        } else if (newRole === 'god') {
           action = 'cambiado a'; // Assuming changing to god is a special case
        }

        const subject = 'Tu plan en Zentasker ha sido actualizado';
        const message = `<p>Hola ${userToUpdate.displayName || userToUpdate.email},</p><p>Te informamos que tu plan en Zentasker ha sido ${action} <strong>${newRole}</strong>.</p><p>Si tienes alguna pregunta, no dudes en contactarnos.</p><p>Saludos,<br/>El equipo de Zentasker</p>`;

        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userToUpdate.email,
              subject: subject,
              message: message,
            }),
          });

          const data = await response.json();
          if (data.success) {
            console.log(`Email de cambio de plan enviado a ${userToUpdate.email}`);
          } else {
            console.error(`Error al enviar email de cambio de plan a ${userToUpdate.email}:`, data.error);
          }
        } catch (emailError) {
          console.error(`Error de red al intentar enviar email de cambio de plan a ${userToUpdate.email}:`, emailError);
        }
      }

    } catch (error) {
      console.error('Error changing user role:', error);
      alert('Error al cambiar el plan del usuario.');
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'god') {
        router.push('/first');
        return;
      }
    };

    checkAdmin();
    fetchUsers();
  }, [router, fetchUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
            
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
                        {(user.role === 'pro' && user.proStartDate) && (
                          <div className="text-sm text-gray-500 bg-purple-50/50 px-4 py-2 rounded-full">
                            {(() => {
                              const startDate = new Date(user.proStartDate);
                              const endDate = new Date(startDate);
                              endDate.setDate(startDate.getDate() + 30);
                              const today = new Date();
                              const timeDiff = endDate.getTime() - today.getTime();
                              const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                              return daysRemaining > 0 ? `Días Pro restantes: ${daysRemaining}` : 'Plan Pro expirado';
                            })()}
                          </div>
                        )}
                        {(user.role === 'premium' && user.premiumStartDate) && (
                          <div className="text-sm text-gray-500 bg-purple-50/50 px-4 py-2 rounded-full">
                            {(() => {
                              const startDate = new Date(user.premiumStartDate);
                              const endDate = new Date(startDate);
                              endDate.setDate(startDate.getDate() + 40);
                              const today = new Date();
                              const timeDiff = endDate.getTime() - today.getTime();
                              const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                              return daysRemaining > 0 ? `Días Premium restantes: ${daysRemaining}` : 'Plan Premium expirado';
                            })()}
                          </div>
                        )}
                        {user.id !== auth.currentUser?.uid && (
                          <div className="flex items-center gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                              className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-50/50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                            >
                              <option value="gratis">Gratis</option>
                              <option value="pro">Pro</option>
                              <option value="premium">Premium</option>
                            </select>
                          </div>
                        )}
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
  );
}