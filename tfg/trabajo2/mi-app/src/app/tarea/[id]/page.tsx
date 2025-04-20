'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EtiquetaCompleta from '@/components/etiqueta_completa';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  fechaLimite?: string;
  prioridad?: string;
  etiquetas?: string;
  estado: 'todo' | 'doing' | 'done';
}

export default function TareaDetalle() {
  const router = useRouter();
  const params = useParams();
  const [tareas, setTareas] = useState<Tarea[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tareas') || '[]');
    // Asegurarse de que todas las tareas tengan un estado
    const tareasConEstado = data.map((tarea: Tarea) => ({
      ...tarea,
      estado: tarea.estado || 'todo'
    }));
    setTareas(tareasConEstado);
  }, []);

  const moverTarea = (id: number, nuevoEstado: 'todo' | 'doing' | 'done') => {
    const nuevasTareas = tareas.map(tarea => 
      tarea.id === id ? { ...tarea, estado: nuevoEstado } : tarea
    );
    setTareas(nuevasTareas);
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
  };

  const Columnas = {
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done'
  };

  return (
    <EtiquetaCompleta>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(Columnas).map(([estado, titulo]) => (
          <div key={estado} className="bg-gray-800/50 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">{titulo}</h2>
            <div className="space-y-4">
              {tareas
                .filter(tarea => tarea.estado === estado)
                .map(tarea => (
                  <div
                    key={tarea.id}
                    className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => router.push(`/tarea/${tarea.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{tarea.titulo}</h3>
                      <div className="flex gap-2">
                        {estado !== 'todo' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moverTarea(tarea.id, 'todo');
                            }}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            ←
                          </button>
                        )}
                        {estado !== 'done' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moverTarea(tarea.id, estado === 'todo' ? 'doing' : 'done');
                            }}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                    {tarea.descripcion && (
                      <p className="text-sm text-gray-400 line-clamp-2">{tarea.descripcion}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </EtiquetaCompleta>
  );
} 