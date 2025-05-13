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
    <div className="flex w-full max-w-7xl rounded-3xl border border-purple-300 overflow-hidden bg-white/30 backdrop-blur-xl shadow-xl">
      
      {/* Sidebar izquierda */}
      <div className="w-full md:w-1/4 p-6 bg-white/50 backdrop-blur-lg text-gray-800 rounded-l-3xl shadow-inner">
        <h2 className="text-xl font-semibold mb-6">Filtros</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Buscar por nombre</label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Buscar..."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Prioridad</label>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      {/* Contenido derecho */}
      <div className="w-full md:w-3/4 p-6 bg-white/40 backdrop-blur-lg rounded-r-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
