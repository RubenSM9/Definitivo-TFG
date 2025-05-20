'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TareaCrear from '@/components/tarea_crear';
import TareaPrevia from '@/components/tarea_previa';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, deleteCard } from '@/firebase/firebaseOperations';
import Image from 'next/image';
import EtiquetaCompleta from '@/components/etiqueta_completa';

export default function FirstPage() {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = async () => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const cards = await getUserCards(auth.currentUser.uid);
      setTarjetas(cards);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
      setError('Error al cargar las tarjetas. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCard(id);
      await cargarTarjetas();
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
      setError('Error al eliminar la tarjeta. Por favor, intenta de nuevo.');
    }
  };

  const tarjetasFiltradas = tarjetas.filter((t) => {
    const coincideBusqueda = t.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePrioridad = filtroPrioridad ? t.prioridad === filtroPrioridad : true;
    return coincideBusqueda && coincidePrioridad;
  });

  return (
      <EtiquetaCompleta>
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

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
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
      </EtiquetaCompleta>
  );
}
