'use client';

import { useRouter } from 'next/navigation';
import { Settings, Trash2, Users } from 'lucide-react';
import { auth } from '@/firebase/firebaseConfig';
import { deleteCard, Task } from '@/firebase/firebaseOperations';

interface Tarea {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaLimite?: string;
  prioridad: string;
  asignado?: string;
  subtareas: any[];
  completada: boolean;
}

interface Tarjeta {
  id: string;
  nombre: string;
  prioridad: string;
  tareas: Task[];
  compartidoCon?: string[];
  userId: string;
}

interface TareaPreviaProps {
  tarjeta: Tarjeta;
  onDelete: () => void;
}

export default function TareaPrevia({ tarjeta, onDelete }: TareaPreviaProps) {
  const router = useRouter();
  const isCompartida = tarjeta.compartidoCon && tarjeta.compartidoCon.length > 0;

  const irAVistaTareas = () => {
    router.push(`/tarea/${tarjeta.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      try {
        if (!auth.currentUser) {
          router.push('/login');
          return;
        }

        await deleteCard(tarjeta.id);
        onDelete(); // Notificar al componente padre para actualizar la lista
      } catch (error) {
        console.error("Error al eliminar la tarjeta:", error);
        alert("Error al eliminar la tarjeta. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className={`bg-white/50 backdrop-blur-md border rounded-2xl shadow-lg p-4 flex flex-col justify-between transition hover:shadow-xl w-full ${isCompartida ? 'border-blue-400' : 'border-purple-200'}`}>
      
      {/* Parte clicable que lleva a la vista de tareas */}
      <div
        onClick={irAVistaTareas}
        className="flex items-center gap-4 cursor-pointer rounded-xl p-3 transition hover:bg-purple-100"
      >
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg ${isCompartida ? 'border-blue-400 bg-blue-100 text-blue-800' : 'border-purple-400 bg-purple-100 text-purple-800'}`}>
          {tarjeta.nombre?.[0]?.toUpperCase() || 'U'}
        </div>
        <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
          {tarjeta.nombre}
          {isCompartida && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-2">
              <Users className="w-4 h-4" /> Compartida
            </span>
          )}
        </p>
      </div>

      {/* Botones de Ajustes y Eliminar */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/tarea/${tarjeta.id}/ajustes`);
          }}
          className="text-purple-600 hover:text-purple-800 transition text-sm flex items-center gap-1"
        >
          <Settings className="w-4 h-4" /> Ajustes
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      
    </div>
  );
}