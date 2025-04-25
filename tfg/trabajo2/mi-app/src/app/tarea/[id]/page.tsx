'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BoardPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [tarjeta, setTarjeta] = useState<any>(null);
  const [tarea, setTarea] = useState('');
  const [draggedTarea, setDraggedTarea] = useState<any>(null);
  const [draggedFrom, setDraggedFrom] = useState<string>('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const actual = stored.find((t: any) => t.id === id);
    setTarjeta(actual);
  }, [id]);

  const agregarTarea = () => {
    if (!tarea.trim()) return;
    const updated = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const index = updated.findIndex((t: any) => t.id === id);

    if (index !== -1) {
      const nuevaTarea = { nombre: tarea, lista: 'Pendiente' };
      updated[index].tareas.push(nuevaTarea);
      localStorage.setItem('tarjetas', JSON.stringify(updated));
      setTarjeta(updated[index]);
      setTarea('');
    }
  };

  const volver = () => {
    router.back();
  };

  const siguienteLista = (lista: string) => {
    if (lista === 'Pendiente') return 'En Progreso';
    if (lista === 'En Progreso') return 'Hecho';
    return 'Hecho';
  };

  const moverTarea = (tareaIndex: number, listaActual: string, nuevaLista: string) => {
    const updated = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const index = updated.findIndex((t: any) => t.id === id);

    if (index !== -1) {
      const tareasActuales = updated[index].tareas;
      let count = -1;
      const tarea = tareasActuales.find((t: any) => {
        if (t.lista === listaActual) count++;
        return count === tareaIndex;
      });

      if (tarea) {
        tarea.lista = nuevaLista;
        localStorage.setItem('tarjetas', JSON.stringify(updated));
        setTarjeta({ ...updated[index] });
      }
    }
  };

  const handleDragStart = (tarea: any, lista: string) => {
    setDraggedTarea(tarea);
    setDraggedFrom(lista);
  };

  const handleDrop = (e: React.DragEvent, nuevaLista: string) => {
    e.preventDefault();
    if (draggedTarea && draggedFrom !== nuevaLista) {
      const updated = JSON.parse(localStorage.getItem('tarjetas') || '[]');
      const index = updated.findIndex((t: any) => t.id === id);

      if (index !== -1) {
        const tarea = draggedTarea;
        const tareas = updated[index].tareas;
        const tareaIndex = tareas.findIndex((t: any) => t.id === tarea.id);
        if (tareaIndex !== -1) {
          tareas[tareaIndex].lista = nuevaLista;
          localStorage.setItem('tarjetas', JSON.stringify(updated));
          setTarjeta({ ...updated[index] });
        }
      }
    }
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!tarjeta) return <div className="p-6">Tarjeta no encontrada</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{tarjeta.nombre}</h2>

      <button
        onClick={volver}
        className="mb-4 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg shadow-md"
      >
        Volver
      </button>

      <div className="flex space-x-4">
        {['Pendiente', 'En Progreso', 'Hecho'].map((estado) => (
          <div
            key={estado}
            className={`p-4 border-2 rounded-lg bg-white shadow-lg w-1/3 ${
              estado === 'Pendiente'
                ? 'border-green-300'
                : estado === 'En Progreso'
                ? 'border-yellow-400'
                : 'border-blue-400'
            }`}
            onDrop={(e) => handleDrop(e, estado)}
            onDragOver={allowDrop}
          >
            <h3
              className={`font-semibold mb-2 text-lg ${
                estado === 'Pendiente'
                  ? 'text-green-600'
                  : estado === 'En Progreso'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`}
            >
              {estado}
            </h3>
            <ul className="space-y-2">
              {tarjeta.tareas
                .filter((t: any) => t.lista === estado)
                .map((t: any, index: number) => (
                  <li
                    key={index}
                    className="bg-gray-100 p-3 rounded-lg text-black shadow-md hover:bg-gray-200"
                    draggable
                    onDragStart={() => handleDragStart(t, estado)}
                  >
                    {t.nombre}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={tarea}
          onChange={(e) => setTarea(e.target.value)}
          placeholder="Nueva tarea"
          className="w-full p-2 border rounded-lg mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={agregarTarea}
          className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
        >
          Agregar tarea
        </button>
      </div>
    </div>
  );
}
