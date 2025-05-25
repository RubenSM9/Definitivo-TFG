'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TareaCrear from '@/components/tarea_crear';
import TareaPrevia from '@/components/tarea_previa';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, deleteCard, getCardsSharedWithEmail, CardData } from '@/firebase/firebaseOperations';
import Image from 'next/image';
import EtiquetaCompleta from '@/components/etiqueta_completa';
import { Filter, Calendar as CalendarIcon, Grid } from 'lucide-react';
import { MdGridView, MdCalendarMonth } from "react-icons/md";
import Calendar from '@/components/Calendar';

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
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [selectedTask, setSelectedTask] = useState<any>(null);

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
      
      const todas = [...cardsPropias, ...cardsCompartidas]
        .filter(c => c.id)
        .map(c => ({ ...c, id: c.id || '' }))
        .filter((c, index, self) =>
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

  const handleSelectTask = (task: any) => {
    setSelectedTask(task);
  };

  return (
    <EtiquetaCompleta>
      {/* View mode toggle buttons - Solo en móvil */}
      <div className="md:hidden fixed bottom-8 right-4 z-50 flex gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <Grid className="h-6 w-6" />
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <CalendarIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Filter className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile filters overlay */}
      <div className={`
        md:hidden fixed inset-0 bg-black/50 z-40
        transition-opacity duration-300
        ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setShowFilters(false)} />

      {/* Mobile filters panel */}
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
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
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
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-800">Search by name</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Search..."
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-800">Priority</label>
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
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex w-full">
        {/* Left sidebar */}
        <div className="w-1/4 p-6 bg-white/50 backdrop-blur-lg text-gray-800 rounded-l-3xl shadow-inner">
          <h2 className="text-xl font-semibold mb-6">Filters</h2>

          {/* View mode buttons - Desktop */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-2 px-4 rounded-xl shadow-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {/* <MdGridView className="h-5 w-5" /> */}
                {/* <span className="text-xl">&#x25a3;</span> */} {/* Icono de Cuadrícula (Unicode) */}
                <span>Vista Cuadrícula</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 py-2 px-4 rounded-xl shadow-sm transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {/* <MdCalendarMonth className="h-5 w-5" /> */}
                {/* <span className="text-xl">&#x1F4C5;</span> */} {/* Icono de Calendario (Unicode) */}
                <span>Calendario</span>
              </div>
            </button>
          </div>

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
        <div className="w-3/4 p-6 bg-white/40 backdrop-blur-lg rounded-r-3xl">
          {viewMode === 'grid' ? (
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Calendar tasks={tarjetasFiltradas} onSelectTask={handleSelectTask} />
              </div>
              {selectedTask && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedTask.nombre}</h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">{selectedTask.descripcion}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        selectedTask.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                        selectedTask.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedTask.prioridad}
                      </span>
                    </div>
                    {selectedTask.fechaLimite && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Fecha límite:</span>
                        <span className="text-sm text-gray-600">
                          {new Date(selectedTask.fechaLimite).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedTask.asignado && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Asignado a:</span>
                        <span className="text-sm text-gray-600">{selectedTask.asignado}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile content */}
      <div className="md:hidden w-full p-6 bg-white/40 backdrop-blur-lg rounded-3xl">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tarjetasFiltradas.map((tarjeta) => (
              <TareaPrevia
                key={tarjeta.id}
                tarjeta={tarjeta}
                onDelete={() => handleDelete(tarjeta.id)}
              />
            ))}
            <TareaCrear />
          </div>
        ) : (
          <div className="space-y-6">
            <Calendar tasks={tarjetasFiltradas} onSelectTask={handleSelectTask} />
            {selectedTask && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedTask.nombre}</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedTask.descripcion}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      selectedTask.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                      selectedTask.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedTask.prioridad}
                    </span>
                  </div>
                  {selectedTask.fechaLimite && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Fecha límite:</span>
                      <span className="text-sm text-gray-600">
                        {new Date(selectedTask.fechaLimite).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedTask.asignado && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Asignado a:</span>
                      <span className="text-sm text-gray-600">{selectedTask.asignado}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </EtiquetaCompleta>
  );
}
