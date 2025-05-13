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
    <div className="bg-white/50 backdrop-blur-md border border-purple-200 rounded-2xl shadow-lg p-4 flex flex-col justify-between transition hover:shadow-xl w-full">
      
      {/* Parte clicable que lleva a la vista de tareas */}
      <div
        onClick={irAVistaTareas}
        className="flex items-center gap-4 cursor-pointer rounded-xl p-3 transition hover:bg-purple-100"
      >
        <div className="w-10 h-10 rounded-full border-2 border-purple-400 bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
          {tarjeta.nombre?.[0]?.toUpperCase() || 'U'}
        </div>
        <p className="text-base font-semibold text-gray-800">{tarjeta.nombre}</p>
      </div>


      {/* Botones de Ajustes y Eliminar */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => router.push(`/tarea/${tarjeta.id}/ajustes`)}
          className="text-purple-600 hover:text-purple-800 transition text-sm flex items-center gap-1"
        >
          <Settings className="w-4 h-4" /> Ajustes
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
