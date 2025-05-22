'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';



interface Comentario {
  id: string;
  texto: string;
  fecha: string;
}

interface Subtarea {
  id: string;
  nombre: string;
  completada: boolean;
  prioridad: string;
  fechaLimite?: string;
  comentarios: Comentario[];
}

interface Tarea {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaLimite?: string;
  prioridad: string;
  asignado?: string;
  subtareas: Subtarea[];
  completada: boolean;
}

interface Tarjeta {
  id: string;
  nombre: string;
  prioridad: string;
  tareas: Tarea[];
  compartidoCon?: string[];
  userId: string;
}


export default function BoardPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [tarjeta, setTarjeta] = useState<any>(null);
  const [newTarea, setNewTarea] = useState({
    nombre: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: 'Media',
    asignado: '',
  });
  const [selectedTarea, setSelectedTarea] = useState<any>(null);
  const [draggedTarea, setDraggedTarea] = useState<any>(null);
  const [draggedFrom, setDraggedFrom] = useState<string>('');
  const [showCrearTarea, setShowCrearTarea] = useState(false); // <-- nuevo estado para mostrar formulario

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const actual = stored.find((t: any) => t.id === id);

    if (actual) {
      actual.tareas = actual.tareas.map((t: any) => ({
        ...t,
        id: t.id || crypto.randomUUID(),
      }));
      setTarjeta(actual);

      const updated = stored.map((t: any) => (t.id === id ? actual : t));
      localStorage.setItem('tarjetas', JSON.stringify(updated));
    }
  }, [id]);

  const volver = () => {
    router.back();
  };

  const agregarTarea = () => {
    if (!newTarea.nombre.trim()) return;
    const updated = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const index = updated.findIndex((t: any) => t.id === id);

    if (index !== -1) {
      const nueva = {
        id: crypto.randomUUID(),
        ...newTarea,
        lista: 'Pendiente',
      };
      updated[index].tareas.push(nueva);
      localStorage.setItem('tarjetas', JSON.stringify(updated));
      setTarjeta(updated[index]);
      setNewTarea({
        nombre: '',
        descripcion: '',
        fechaLimite: '',
        prioridad: 'Media',
        asignado: '',
      });
      setShowCrearTarea(false);
    }
  };

  const eliminarTarea = (tareaId: string) => {
    const updated = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const tarjetaIndex = updated.findIndex((t: any) => t.id === id);

    if (tarjetaIndex !== -1) {
      updated[tarjetaIndex].tareas = updated[tarjetaIndex].tareas.filter((ta: any) => ta.id !== tareaId);
      localStorage.setItem('tarjetas', JSON.stringify(updated));
      setTarjeta(updated[tarjetaIndex]);
    }
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
        const tareas = updated[index].tareas;
        const tareaIndex = tareas.findIndex((t: any) => t.id === draggedTarea.id);
        if (tareaIndex !== -1) {
          tareas[tareaIndex].lista = nuevaLista;
          localStorage.setItem('tarjetas', JSON.stringify(updated));
          setTarjeta({ ...updated[index] });
        }
      }
    }
  };

  if (!tarjeta) return <div className="p-6">Tarjeta no encontrada</div>;

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center flex-1">{tarjeta.nombre}</h2>
        <Settings className="w-8 h-8 text-gray-600 hover:text-gray-800 cursor-pointer" />
      </div>

      <button
        onClick={volver}
        className="mb-4 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg shadow-md"
      >
        Volver
      </button>

      <div className="flex space-x-4">
        {['Pendiente', 'En Progreso', 'Hecho'].map((estado, idx) => (
            <div
            key={estado}
            className="flex flex-col p-4 border-2 rounded-lg bg-white shadow-lg w-1/3 max-h-[70vh] overflow-y-auto"
            onDrop={(e) => handleDrop(e, estado)}
            onDragOver={allowDrop}
          >
            <h3
              className={`font-semibold mb-2 text-lg ${estado === 'Pendiente'
                ? 'text-green-600'
                : estado === 'En Progreso'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
                }`}
            >
              {estado}
            </h3>

            <ul className="space-y-2 mb-4">
              {tarjeta.tareas
                .filter((t: any) => t.lista === estado)
                .map((t: any) => (
                  <li
                    key={t.id}
                    className="relative bg-gray-100 p-3 rounded-lg text-black shadow-md hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                    draggable
                    onDragStart={() => handleDragStart(t, estado)}
                    onClick={() => setSelectedTarea(t)}
                  >
                    <span>{t.nombre}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarTarea(t.id);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                    >
                      ×
                    </button>
                    <div
                      className={`absolute bottom-0 left-0 w-full h-2 rounded-b-lg ${estado === 'Pendiente'
                        ? 'bg-green-400'
                        : estado === 'En Progreso'
                          ? 'bg-yellow-400'
                          : 'bg-blue-400'
                        }`}
                    ></div>
                  </li>
                ))}
            </ul>

            {/* Botón solo en la primera columna */}
            {idx === 0 && (
              <button
                onClick={() => setShowCrearTarea(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                + Agregar Tarea
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de creación de tarea */}
      <AnimatePresence>
        {showCrearTarea && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowCrearTarea(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[500px] bg-gray-100 rounded-2xl shadow-2xl p-8 z-50 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center mb-4">Crear Nueva Tarea</h2>
                <input
                  type="text"
                  value={newTarea.nombre}
                  onChange={(e) => setNewTarea({ ...newTarea, nombre: e.target.value })}
                  placeholder="Nombre de la tarea"
                  className="w-full p-2 border rounded-lg shadow-md"
                />
                <textarea
                  value={newTarea.descripcion}
                  onChange={(e) => setNewTarea({ ...newTarea, descripcion: e.target.value })}
                  placeholder="Descripción de la tarea"
                  className="w-full p-2 border rounded-lg shadow-md"
                />
                <input
                  type="date"
                  value={newTarea.fechaLimite}
                  onChange={(e) => setNewTarea({ ...newTarea, fechaLimite: e.target.value })}
                  className="w-full p-2 border rounded-lg shadow-md"
                />
                <select
                  value={newTarea.prioridad}
                  onChange={(e) => setNewTarea({ ...newTarea, prioridad: e.target.value })}
                  className="w-full p-2 border rounded-lg shadow-md"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
                <input
                  type="text"
                  value={newTarea.asignado}
                  onChange={(e) => setNewTarea({ ...newTarea, asignado: e.target.value })}
                  placeholder="Asignado a..."
                  className="w-full p-2 border rounded-lg shadow-md"
                />
                <button
                  onClick={agregarTarea}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                  Crear Tarea
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de vista de tarea */}
      <AnimatePresence>
        {selectedTarea && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSelectedTarea(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[500px] bg-gray-100 rounded-2xl shadow-2xl p-8 z-50 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">{selectedTarea.nombre}</h2>
                <p className="mb-2"><strong>Descripción:</strong> {selectedTarea.descripcion || 'Sin descripción'}</p>
                <p className="mb-2"><strong>Fecha límite:</strong> {selectedTarea.fechaLimite || 'No establecida'}</p>
                <p className="mb-2">
                  <strong>Prioridad:</strong>{' '}
                  <span className={selectedTarea.prioridad === 'Alta' ? 'text-red-600' :
                    selectedTarea.prioridad === 'Media' ? 'text-yellow-600' : 'text-green-600'}>
                    {selectedTarea.prioridad}
                  </span>
                </p>
                <p className="mb-6"><strong>Asignado a:</strong> {selectedTarea.asignado || 'No asignado'}</p>

                <button
                  onClick={() => setSelectedTarea(null)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
