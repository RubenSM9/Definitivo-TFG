'use client';

import { useEffect, useState } from 'react';
import TareaCrear from '@/components/tarea_crear';
import TareaPrevia from '@/components/tarea_previa';

export default function FirstPage() {
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = () => {
    const stored = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    setTarjetas(stored);
  };

  const handleDelete = (id: string) => {
    const nuevas = tarjetas.filter((t) => t.id !== id);
    localStorage.setItem('tarjetas', JSON.stringify(nuevas));
    setTarjetas(nuevas);
  };

  const tarjetasFiltradas = tarjetas.filter((t) => {
    const coincideBusqueda = t.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePrioridad = filtroPrioridad ? t.prioridad === filtroPrioridad : true;
    return coincideBusqueda && coincidePrioridad;
  });

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar izquierda */}
      <div className="w-full md:w-1/4 p-6 bg-gray-800 border-r border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">Buscar por nombre</label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
            placeholder="Buscar..."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">Prioridad</label>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      {/* Contenido derecho */}
      <div className="w-full md:w-3/4 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {tarjetasFiltradas.map((tarjeta) => (
            <TareaPrevia
              key={tarjeta.id}
              tarjeta={tarjeta}
              onDelete={() => handleDelete(tarjeta.id)}
            />
          ))}

          <TareaCrear />
        </div>
      </div>
    </div>
  );
}