'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InformacionTarea() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tareaId = searchParams.get('id');

  const [tarea, setTarea] = useState<any>(null);

  useEffect(() => {
    if (tareaId) {
      const tarjetas = JSON.parse(localStorage.getItem('tarjetas') || '[]');
      for (const tarjeta of tarjetas) {
        const encontrada = tarjeta.tareas.find((t: any) => t.id === tareaId);
        if (encontrada) {
          setTarea(encontrada);
          break;
        }
      }
    }
  }, [tareaId]);

  if (!tarea) {
    return <div className="p-6">Cargando tarea...</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg shadow-md"
      >
        Volver
      </button>

      <h1 className="text-3xl font-bold mb-4">Detalles de la Tarea</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Nombre:</h2>
          <p>{tarea.nombre}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Estado:</h2>
          <p>{tarea.lista}</p>
        </div>
      </div>
    </div>
  );
}
