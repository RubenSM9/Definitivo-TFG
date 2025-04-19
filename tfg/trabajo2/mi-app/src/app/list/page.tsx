'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EtiquetaCompleta from '../../components/etiqueta_completa';
import TareaVista from '../../components/tarea_vista1';

interface Tarea {
  titulo: string;
  descripcion: string;
  imagen?: string;
}

export default function List() {
  const router = useRouter();
  const [tareas, setTareas] = useState<Tarea[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tareas') || '[]');
    setTareas(data);
  }, []);

  const handleDelete = (index: number) => {
    const newTareas = tareas.filter((_, i) => i !== index);
    setTareas(newTareas);
    localStorage.setItem('tareas', JSON.stringify(newTareas));
  };

  return (
    <EtiquetaCompleta>
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
        Mis Tareas
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/new')}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Agregar Tarea
        </button>
      </div>

      {tareas.map((tarea, index) => (
        <div key={index} className="mb-4">
          <TareaVista
            titulo={tarea.titulo}
            descripcion={tarea.descripcion}
            imagen={tarea.imagen}
            onDelete={() => handleDelete(index)}
          />
        </div>
      ))}
    </EtiquetaCompleta>
  );
}
