'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TareaCrear from '@/components/tarea_crear';
import TareaPrevia from '@/components/tarea_previa';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, deleteCard, getCardsSharedWithEmail, CardData } from '@/firebase/firebaseOperations';
import Image from 'next/image';
import EtiquetaCompleta from '@/components/etiqueta_completa';

interface Tarjeta extends CardData {
  id: string;
}

export default function FirstPage() {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
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
      const [cardsPropias, cardsCompartidas] = await Promise.all([
        getUserCards(auth.currentUser.uid),
        getCardsSharedWithEmail(auth.currentUser.email || '')
      ]);
      
      // Ensure all cards have an id and convert to Tarjeta type
      const todas = [...cardsPropias, ...cardsCompartidas]
        .filter(c => c.id) // Filter out cards without id
        .map(c => ({ ...c, id: c.id || '' })) // Ensure id is string
        .filter((c, index, self) => // Remove duplicates
          index === self.findIndex(t => t.id === c.id)
        ) as Tarjeta[];
      
      setTarjetas(todas);
    } catch (error) {
      console.error('Error loading cards:', error);
      setError('Error loading cards. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCard(id);
      await cargarTarjetas();
    } catch (error) {
      console.error('Error deleting card:', error);
      setError('Error deleting card. Please try again.');
    }
  };

  const tarjetasFiltradas = tarjetas.filter((t) => {
    const coincideBusqueda = t.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePrioridad = filtroPrioridad ? t.prioridad === filtroPrioridad : true;
    return coincideBusqueda && coincidePrioridad;
  });

  return (
    <EtiquetaCompleta>
      {/* Left sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-white/50 backdrop-blur-lg text-gray-800 rounded-l-3xl shadow-inner">
        <h2 className="text-xl font-semibold mb-6">Filters</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Search by name</label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Search..."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Priority</label>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All</option>
            <option value="baja">Low</option>
            <option value="media">Medium</option>
            <option value="alta">High</option>
          </select>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Right content */}
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
