'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
  fechaLimite: string;
  etiquetas: string[];
  estado: string;
  miembros: string[];
  checklist: string[];
  comentarios: string[];
  color: string;
}

export default function DetalleTarea() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  const [tarea, setTarea] = useState<Tarea | null>(null);

  useEffect(() => {
    const tareas: Tarea[] = JSON.parse(localStorage.getItem('tareas') || '[]');
    const tareaEncontrada = tareas.find((t) => t.id.toString() === id);
    if (tareaEncontrada) {
      setTarea(tareaEncontrada);
    }
  }, [id]);

  if (!tarea) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Tarea no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4" style={{ color: tarea.color }}>
          {tarea.titulo}
        </h1>

        <p className="mb-6 text-gray-300">{tarea.descripcion}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Prioridad:</h3>
            <p className="text-sm">{tarea.prioridad}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Fecha límite:</h3>
            <p className="text-sm">{tarea.fechaLimite || 'Sin fecha'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {tarea.etiquetas.map((etiqueta, i) => (
                <span
                  key={i}
                  className="bg-purple-700 text-sm px-3 py-1 rounded-full"
                >
                  {etiqueta}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Estado:</h3>
            <p className="text-sm capitalize">{tarea.estado}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push('/first')}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
