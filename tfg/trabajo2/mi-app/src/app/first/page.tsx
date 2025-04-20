'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EtiquetaCompleta from '../../components/etiqueta_completa';
import EtiquetaAlta from '../../components/etiqueta_alta';
import TareaPrevia from '@/components/tarea_previa';
import TareaCrear from '@/components/tarea_crear';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  fechaLimite?: string;
  prioridad?: string;
  etiquetas?: string;
}

export default function First() {
  const router = useRouter();
  const [tareas, setTareas] = useState<Tarea[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tareas') || '[]');
    setTareas(data);
  }, []);

  const handleDelete = (id: number) => {
    const newTareas = tareas.filter(tarea => tarea.id !== id);
    setTareas(newTareas);
    localStorage.setItem('tareas', JSON.stringify(newTareas));
  };

  const handleSettings = (id: number) => {
    router.push(`/ajustes/${id}`);
  };

  const agregarTarea = () => {
    router.push('/new');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        
        {/* Usuario */}
        <div className="space-y-10">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center text-lg font-bold">
              U
            </div>
            <p className="text-sm font-medium">Usuario</p>
          </div>

          {/* Funcionalidades */}
          <div className="mt-4">
            <h3 className="text-sm uppercase text-gray-400 mb-4 tracking-wider text-center">Funcionalidades</h3>
            
          </div>
        </div>

        
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Mis Vistas</h2>

        {/* Lista de tareas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tareas.map((tarea) => (
            <div key={tarea.id} className="relative">
              <TareaPrevia
                name={tarea.titulo}
                onSettingsClick={() => handleSettings(tarea.id)}
                imagen={tarea.imagen}
                tareaId={tarea.id}
              />
            </div>
          ))}
        </div>

        {/* Botón para crear nueva tarea */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-end">
          <TareaCrear onClick={agregarTarea} />
        </div>

      </main>
    </div>
  );
}
