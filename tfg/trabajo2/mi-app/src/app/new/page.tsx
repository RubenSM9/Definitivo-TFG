'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function New() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [prioridad, setPrioridad] = useState('media');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevasTarjetas = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const nueva = { id: uuidv4(), nombre, tareas: [], prioridad };
    nuevasTarjetas.push(nueva);
    localStorage.setItem('tarjetas', JSON.stringify(nuevasTarjetas));

    router.push('/first');
  };

  const getBordeColor = () => {
    switch (prioridad) {
      case 'alta':
        return 'border-b-4 border-red-500';
      case 'media':
        return 'border-b-4 border-yellow-400';
      case 'baja':
        return 'border-b-4 border-green-500';
      default:
        return '';
    }
  };

  return (
    <div className={`p-6 max-w-md mx-auto bg-gray-800 rounded-lg shadow-md text-white ${getBordeColor()}`}>
      <h2 className="text-xl font-bold mb-4">Crear nueva tarjeta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la tarjeta"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
        />

        <div>
          <label className="block text-sm mb-1">Prioridad</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white font-semibold rounded hover:shadow-lg transition"
        >
          Crear tarjeta
        </button>
      </form>
    </div>
  );
}