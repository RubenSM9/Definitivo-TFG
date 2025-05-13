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
