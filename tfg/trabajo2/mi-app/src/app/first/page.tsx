'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TareaCrear from '@/components/tarea_crear';
import TareaPrevia from '@/components/tarea_previa';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, deleteCard, getCardsSharedWithEmail, CardData } from '@/firebase/firebaseOperations';
import Image from 'next/image';
import EtiquetaCompleta from '@/components/etiqueta_completa';
import { Filter, Share2, Search } from 'lucide-react';

interface Tarjeta extends CardData {
  id: string;
}

export default function FirstPage() {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
      {/* Mobile filter toggle button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden fixed bottom-32 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <Filter className="h-6 w-6" />
      </button>

      {/* Mobile filters overlay */}
      <div className={`
        md:hidden fixed inset-0 bg-black/50 z-40
        transition-opacity duration-300
        ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setShowFilters(false)} />

      {/* Filtros - Mobile version */}
      <div className={`
        md:hidden
        fixed top-0 right-0 h-full w-80
        bg-white/80 p-4 rounded-xl shadow-sm border border-purple-200
        transform transition-transform duration-300
        ${showFilters ? 'translate-x-0' : 'translate-x-full'}
        z-50
        overflow-y-auto
      `}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500"
            />
          </div>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          >
            <option value="">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
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
