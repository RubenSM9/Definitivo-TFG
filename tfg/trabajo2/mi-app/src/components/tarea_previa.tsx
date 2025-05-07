'use client';

import { Settings, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TareaPrevia({
  tarjeta,
  onDelete,
}: {
  tarjeta: any;
  onDelete?: () => void;
}) {
  const router = useRouter();

  const irAVistaTareas = () => {
    router.push(`/tarea/${tarjeta.id}`);
  };

  return (
    <div className="bg-gray-800 py-4 px-4 rounded-lg shadow-md flex flex-col justify-between w-full">
      {/* Parte clicable que lleva a la vista de tareas */}
      <div
        onClick={irAVistaTareas}
        className="flex items-center space-x-4 mb-2 cursor-pointer hover:bg-gray-700 rounded p-2 transition"
      >
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-semibold bg-gray-700">
          {tarjeta.nombre?.[0]?.toUpperCase() || 'U'}
        </div>
        <p className="text-sm font-medium text-white">{tarjeta.nombre}</p>
      </div>

      {/* Botones de Ajustes y Eliminar */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => router.push(`/tarea/${tarjeta.id}/ajustes`)}
          className="text-gray-400 hover:text-white transition text-xs flex items-center gap-1"
        >
          <Settings className="w-4 h-4" /> Ajustes
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition text-xs flex items-center gap-1"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}