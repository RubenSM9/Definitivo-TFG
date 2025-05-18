'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { createCard } from '@/firebase/firebaseOperations';

export default function New() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const cardData = {
        nombre,
        prioridad,
        tareas: []
      };

      await createCard(auth.currentUser.uid, cardData);
      router.push('/first');
    } catch (error) {
      console.error('Error al crear tarjeta:', error);
      setError('Error al crear la tarjeta. Por favor, intenta de nuevo.');
    }
  };

  const getBordeColor = () => {
    switch (prioridad) {
      case 'alta':
        return 'border-b-4 border-red-400';
      case 'media':
        return 'border-b-4 border-yellow-300';
      case 'baja':
        return 'border-b-4 border-green-300';
      default:
        return '';
    }
  };

  return (
    <div className={`p-8 max-w-md mx-auto bg-white/50 backdrop-blur-md rounded-2xl shadow-xl text-gray-800 ${getBordeColor()}`}>
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Crear nueva tarjeta</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la tarjeta"
          className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Prioridad</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:brightness-90 transition"
        >
          Crear tarjeta
        </button>
      </form>
    </div>
  );
}
