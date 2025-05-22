'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Settings, Calendar, Users, Tag, Clock, BarChart2, Filter, Search, Share2, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { auth } from '@/firebase/firebaseConfig';
import { 
  createCard, 
  getUserCards, 
  updateCard, 
  deleteCard,
  addTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  addComment,
  getAllUserEmails,
  getCardById
} from '@/firebase/firebaseOperations';
import EtiquetaCompleta from '@/components/etiqueta_completa';

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
  const [tarjeta, setTarjeta] = useState<Tarjeta | null>(null);
  const [newTarea, setNewTarea] = useState({
    nombre: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: 'Media',
    asignado: '',
    etiquetas: [] as string[],
  });
  const [draggedTarea, setDraggedTarea] = useState<any>(null);
  const [draggedFrom, setDraggedFrom] = useState<string>('');
  const [showCrearTarea, setShowCrearTarea] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<any>(null);
  const [nuevaSubtarea, setNuevaSubtarea] = useState('');
  const [nuevaSubtareaPrioridad, setNuevaSubtareaPrioridad] = useState('Media');
  const [nuevaSubtareaFechaLimite, setNuevaSubtareaFechaLimite] = useState('');
  const [nuevaSubtareaComentario, setNuevaSubtareaComentario] = useState('');
  const [mostrarComentarios, setMostrarComentarios] = useState<{ [key: string]: boolean }>({});
  const [filtros, setFiltros] = useState({
    busqueda: '',
    prioridad: '',
    estado: '',
    fecha: '',
  });
  const [estadisticas, setEstadisticas] = useState({
    totalTareas: 0,
    completadas: 0,
    pendientes: 0,
    atrasadas: 0,
  });
  const [showCompartir, setShowCompartir] = useState(false);
  const [correosCompartir, setCorreosCompartir] = useState('');
  const [loadingCompartir, setLoadingCompartir] = useState(false);
  const [errorCompartir, setErrorCompartir] = useState('');

  const esPropietario = tarjeta && (tarjeta as any).userId === auth.currentUser?.uid;

  // Función para cargar los datos de Firestore
  const cargarDatos = async () => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const card = await getCardById(id);
      if (card && typeof card === 'object' && 'nombre' in card && 'prioridad' in card && 'tareas' in card && Array.isArray(card.tareas)) {
        setTarjeta(card as Tarjeta);
      } else {
        console.log("No se encontró la tarjeta o está incompleta");
        router.push('/first');
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  useEffect(() => {
    if (tarjeta) {
      const stats = {
        totalTareas: tarjeta.tareas.length,
        completadas: tarjeta.tareas.filter((t: Tarea) => t.completada).length,
        pendientes: tarjeta.tareas.filter((t: Tarea) => !t.completada).length,
        atrasadas: tarjeta.tareas.filter((t: Tarea) => t.fechaLimite && estaAtrasada(t.fechaLimite)).length,
      };
      setEstadisticas(stats);
    }
  }, [tarjeta]);

  const handleTareaClick = (tarea: Tarea) => {
    setSelectedTarea({
      ...tarea,
      completada: tarea.completada ?? false,
      subtareas: tarea.subtareas ?? []
    });
  };

  const handleTareaCompletion = async (tarea: Tarea) => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const nuevaTarea = {
        ...tarea,
        completada: !tarea.completada
      };

      await updateTask(id, tarea.id, nuevaTarea);

      // Actualizar el estado local
      setSelectedTarea(nuevaTarea);
      
      // Actualizar la tarjeta local
      setTarjeta(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tareas: prev.tareas.map(t => 
            t.id === tarea.id ? nuevaTarea : t
          )
        };
      });

      await cargarDatos();
    } catch (error) {
      console.error("Error al actualizar estado de la tarea:", error);
    }
  };

  const handleSubtareaChange = useCallback(async (sub: any) => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      await updateSubtask(id, selectedTarea.id, sub.id, {
        completada: !sub.completada,
        nombre: sub.nombre,
        prioridad: sub.prioridad,
        fechaLimite: sub.fechaLimite
      });

      // Solo actualizar el estado de la tarea si tiene subtareas
      if (selectedTarea.subtareas && selectedTarea.subtareas.length > 0) {
        const todasCompletadas = selectedTarea.subtareas.every((s: Subtarea) => 
          s.id === sub.id ? !sub.completada : s.completada
        );

        // Actualizar el estado de la tarea si es necesario
        if (todasCompletadas !== selectedTarea.completada) {
          await updateTask(id, selectedTarea.id, {
            ...selectedTarea,
            completada: todasCompletadas
          });
        }

        // Actualizar el estado local
        setSelectedTarea((prev: Tarea) => ({
          ...prev,
          subtareas: prev.subtareas.map((s: Subtarea) => 
            s.id === sub.id ? { ...s, completada: !s.completada } : s
          ),
          completada: todasCompletadas
        }));
      } else {
        // Si no hay subtareas, solo actualizar la subtarea
        setSelectedTarea((prev: Tarea) => ({
          ...prev,
          subtareas: prev.subtareas.map((s: Subtarea) => 
            s.id === sub.id ? { ...s, completada: !s.completada } : s
          )
        }));
      }

      await cargarDatos();
    } catch (error) {
      console.error("Error al actualizar subtarea:", error);
    }
  }, [selectedTarea, id]);

  const volver = () => router.back();

  const agregarTarea = async () => {
    if (!newTarea.nombre.trim()) return;
    
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const tareaData = {
        ...newTarea,
        id: Date.now().toString(),
        subtareas: [],
        completada: false
      };

      await addTask(id, tareaData);

      // Actualizar la tarjeta local
      setTarjeta(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tareas: [...prev.tareas, tareaData]
        };
      });

      setNewTarea({
        nombre: '',
        descripcion: '',
        fechaLimite: '',
        prioridad: 'Media',
        asignado: '',
        etiquetas: []
      });
      setShowCrearTarea(false);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      alert("Error al crear la tarea. Por favor, inténtalo de nuevo.");
    }
  };

  const eliminarTarea = async (tareaId: string) => {
    try {
      await deleteTask(id, tareaId);
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

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

  const calcularProgreso = (tarea: any) => {
    if (!tarea?.subtareas || tarea.subtareas.length === 0) return 0;
    const completadas = tarea.subtareas.filter((s: any) => s.completada).length;
    return Math.round((completadas / tarea.subtareas.length) * 100);
  };
  
  const eliminarSubtarea = async (subId: string) => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      await deleteSubtask(id, selectedTarea.id, subId);
      await cargarDatos();
    } catch (error) {
      console.error("Error al eliminar subtarea:", error);
    }
  };
  

  const agregarSubtarea = async () => {
    if (!nuevaSubtarea.trim()) return;

    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      // Asegurarnos de que la tarea seleccionada tenga un array de subtareas
      if (!selectedTarea.subtareas) {
        selectedTarea.subtareas = [];
      }

      const nuevaSubtareaData = {
        id: Date.now().toString(),
      nombre: nuevaSubtarea,
      completada: false,
        prioridad: nuevaSubtareaPrioridad,
        fechaLimite: nuevaSubtareaFechaLimite,
        comentarios: []
      };

      await addSubtask(id, selectedTarea.id, nuevaSubtareaData);

      // Actualizar el estado local inmediatamente
      setSelectedTarea((prev: Tarea) => ({
        ...prev,
        subtareas: [...(prev.subtareas || []), nuevaSubtareaData]
      }));

    setNuevaSubtarea('');
      setNuevaSubtareaPrioridad('Media');
      setNuevaSubtareaFechaLimite('');
      
      // Recargar los datos en segundo plano
      cargarDatos();
    } catch (error) {
      console.error("Error al agregar subtarea:", error);
    }
  };

  const agregarComentario = async (subId: string) => {
    if (!nuevaSubtareaComentario.trim()) return;

    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      await addComment(id, selectedTarea.id, subId, {
        texto: nuevaSubtareaComentario,
        fecha: new Date().toISOString()
      });

      setNuevaSubtareaComentario('');
      await cargarDatos();
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const estaAtrasada = (fechaLimite: string) => {
    if (!fechaLimite) return false;
    return new Date(fechaLimite) < new Date();
  };

  const tareasFiltradas = tarjeta?.tareas.filter((tarea: Tarea) => {
    const coincideBusqueda = tarea.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const coincidePrioridad = filtros.prioridad ? tarea.prioridad === filtros.prioridad : true;
    const coincideEstado = filtros.estado ? 
      (filtros.estado === 'completada' ? tarea.completada :
       filtros.estado === 'pendiente' ? !tarea.completada : true) : true;
    const coincideFecha = filtros.fecha ? tarea.fechaLimite === filtros.fecha : true;
    return coincideBusqueda && coincidePrioridad && coincideEstado && coincideFecha;
  });

  const handleCompartir = async () => {
    setLoadingCompartir(true);
    setErrorCompartir('');
    try {
      const correos = correosCompartir
        .split(/[\n,]+/)
        .map(c => c.trim())
        .filter(Boolean);
      if (!correos.length) {
        setErrorCompartir('Introduce al menos un correo.');
        setLoadingCompartir(false);
        return;
      }
      // Actualizar la tarjeta en Firebase
      await updateCard(id, {
        ...tarjeta,
        compartidoCon: correos,
      });
      setShowCompartir(false);
      setCorreosCompartir('');
    } catch (e) {
      setErrorCompartir('Error al compartir la tarea.');
    }
    setLoadingCompartir(false);
  };

  if (!tarjeta) return <div className="p-6">Tarjeta no encontrada</div>;


  return (
      <div className="max-w-7xl mt-10 mx-auto">
          {/* Header con estadísticas */}
          <div className="bg-white/80 p-4 rounded-xl shadow-sm border-purple-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-purple-800">{tarjeta?.nombre}</h2>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  
                  {tarjeta?.compartidoCon && tarjeta.compartidoCon.length > 0 && (
                    <>
                      <span className="text-xs text-gray-500 ml-2">Compartido con:</span>
                      {tarjeta.compartidoCon.map((correo) => (
                        <span key={correo} title={correo} className="flex items-center gap-1">
                          <span className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-base shadow" style={{minWidth: '2rem'}}>
                            {correo[0]?.toUpperCase() || '?'}
                          </span>
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={volver}
                  className="py-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm transition-all duration-200"
                >
                  Volver
                </button>
                {esPropietario && (
                  <button
                    onClick={() => setShowCrearTarea(true)}
                    className="py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
                  >
                    + Nueva Tarea
                  </button>
                )}
                {esPropietario && (
                  <button
                    onClick={() => setShowCompartir(true)}
                    className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" /> Compartir
                  </button>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
              <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="text-purple-600" />
                  <h3 className="font-semibold text-black">Total Tareas</h3>
                </div>
                <p className="text-2xl font-bold text-purple-800">{estadisticas.totalTareas}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="text-green-600" />
                  <h3 className="font-semibold text-black">Completadas</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{estadisticas.completadas}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-yellow-600" />
                  <h3 className="font-semibold text-black">Pendientes</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="text-red-600" />
                  <h3 className="font-semibold text-black">Atrasadas</h3>
                </div>
                <p className="text-2xl font-bold text-red-600">{estadisticas.atrasadas}</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-purple-200 p-6 mb-8 text-gray-800">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar tareas..."
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>
              <select
                value={filtros.prioridad}
                onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              >
                <option value="">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              >
                <option value="">Todos los estados</option>
                <option value="completada">Completadas</option>
                <option value="pendiente">Pendientes</option>
              </select>
              <input
                type="date"
                value={filtros.fecha}
                onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              />
            </div>
          </div>



          {/* Contenedor principal de tareas */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-[2.5rem] blur-xl opacity-20"></div>
            <div className="relative bg-white/80 p-4 rounded-xl shadow-sm border-4 border-purple-300 overflow-hidden shadow-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tareasFiltradas?.map((tarea: any) => (
                  <motion.div
                    key={tarea.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-200 cursor-pointer"
                    onClick={() => handleTareaClick(tarea)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900">{tarea.nombre}</h4>
                        {esPropietario && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                                eliminarTarea(tarea.id);
                              }
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label="Eliminar tarea"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      {tarea.descripcion && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{tarea.descripcion}</p>
                      )}

                      {tarea.subtareas?.length > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${calcularProgreso(tarea)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {calcularProgreso(tarea)}% completado
                          </p>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        {tarea.fechaLimite && (
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className={`${estaAtrasada(tarea.fechaLimite) ? 'text-red-500' : 'text-gray-500'}`}>
                              {new Date(tarea.fechaLimite).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {tarea.asignado && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2" />
                            {tarea.asignado}
                          </div>
                        )}

                        <div className="flex items-center text-sm">
                          <Tag className="w-4 h-4 mr-2" />
                          <span className={`px-2 py-1 rounded-full text-xs ${getPrioridadColor(tarea.prioridad)}`}>
                            {tarea.prioridad}
                        </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
      
      
      {/* Modal crear tarea */}
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
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] rounded-2xl border border-purple-300 overflow-hidden bg-white/90 backdrop-blur-xl shadow-xl p-8 z-50 text-gray-900"
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
                  className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                />
                <textarea 
                  value={newTarea.descripcion} 
                  onChange={(e) => setNewTarea({ ...newTarea, descripcion: e.target.value })} 
                  placeholder="Descripción de la tarea" 
                  className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date" 
                    value={newTarea.fechaLimite} 
                    onChange={(e) => setNewTarea({ ...newTarea, fechaLimite: e.target.value })} 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                  />
                  <select 
                    value={newTarea.prioridad} 
                    onChange={(e) => setNewTarea({ ...newTarea, prioridad: e.target.value })} 
                    className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
                </div>
                <input 
                  type="text" 
                  value={newTarea.asignado} 
                  onChange={(e) => setNewTarea({ ...newTarea, asignado: e.target.value })} 
                  placeholder="Asignado a..." 
                  className="w-full p-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200" 
                />
                <button 
                  onClick={agregarTarea} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-200"
                >
                  Crear Tarea
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal vista tarea */}
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
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[700px] h-[80vh] rounded-2xl border-4 border-purple-300 overflow-hidden bg-white/60 backdrop-blur-xl shadow-2xl z-50 text-gray-900"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
              <div className="h-full overflow-y-auto px-8">
        <div className="mt-6 text-left">
                  <div className="flex items-center space-x-4 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedTarea.completada ?? false}
                      onChange={() => handleTareaCompletion(selectedTarea)}
                      className="w-5 h-5 rounded-md border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <h2 className={`text-2xl font-bold ${selectedTarea.completada ? 'line-through text-gray-500' : ''}`}>
                      {selectedTarea.nombre}
                    </h2>
                  </div>
                  {selectedTarea.descripcion && (
                    <p className={`text-gray-600 mb-4 ${selectedTarea.completada ? 'line-through' : ''}`}>
                      {selectedTarea.descripcion}
                    </p>
                  )}

                  {/* Barra de progreso */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-4 transition-all duration-300"
                        style={{ width: `${calcularProgreso(selectedTarea)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {calcularProgreso(selectedTarea)}% completado
                    </p>
                  </div>

          {/* Formulario para agregar nuevas subtareas */}
                  <div className="space-y-4 pb-4">
                    <div className="flex space-x-3">
            <input
              type="text"
              value={nuevaSubtarea}
              onChange={(e) => setNuevaSubtarea(e.target.value)}
              placeholder="Nueva subtarea"
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              aria-label="Escribir nueva subtarea"
            />
            <button
              onClick={agregarSubtarea}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-lg shadow-md transform hover:scale-105 transition duration-150 ease-in-out"
              aria-label="Agregar subtarea"
            >
              +
            </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={nuevaSubtareaPrioridad}
                        onChange={(e) => setNuevaSubtareaPrioridad(e.target.value)}
                        className="p-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                      <input
                        type="date"
                        value={nuevaSubtareaFechaLimite}
                        onChange={(e) => setNuevaSubtareaFechaLimite(e.target.value)}
                        className="p-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
          </div>

          {/* Lista de subtareas */}
                  <ul className="space-y-2 pb-8">
            {selectedTarea.subtareas && selectedTarea.subtareas.map((sub: any) => (
              <motion.li 
                key={sub.id}
                className="bg-white p-3 rounded-lg shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={sub.completada}
                  onChange={() => handleSubtareaChange(sub)}
                  className="rounded-md border-gray-300 text-green-500"
                  aria-label={`Marcar subtarea "${sub.nombre}" como completada`}
                />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                <span className={sub.completada ? 'line-through text-gray-500' : ''}>
                  {sub.nombre}
                </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPrioridadColor(sub.prioridad)}`}>
                        {sub.prioridad}
                      </span>
                      {sub.fechaLimite && (
                        <span className={`text-xs ${estaAtrasada(sub.fechaLimite) ? 'text-red-500' : 'text-gray-500'}`}>
                          {new Date(sub.fechaLimite).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {sub.comentarios?.length > 0 && (
                      <div className="mt-1 text-sm text-gray-500">
                        {sub.comentarios[sub.comentarios.length - 1].texto}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMostrarComentarios({ ...mostrarComentarios, [sub.id]: !mostrarComentarios[sub.id] })}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      💬
                    </button>
                    {esPropietario && (
                      <button
                        onClick={() => eliminarSubtarea(sub.id)}
                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                        aria-label="Eliminar subtarea"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Sección de comentarios */}
                {mostrarComentarios[sub.id] && (
                  <div className="mt-3 pl-8 border-t pt-3">
                    <div className="space-y-2">
                      {sub.comentarios?.map((comentario: any) => (
                        <div key={comentario.id} className="text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>{comentario.texto}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(comentario.fecha).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <input
                        type="text"
                        value={nuevaSubtareaComentario}
                        onChange={(e) => setNuevaSubtareaComentario(e.target.value)}
                        placeholder="Nuevo comentario"
                        className="flex-1 p-2 text-sm border rounded"
                      />
                      {esPropietario && (
                        <button
                          onClick={() => agregarComentario(sub.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Comentar
                        </button>
                        
                      )}
                    </div>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
                </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

      {/* Modal Compartir */}
      <AnimatePresence>
        {showCompartir && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowCompartir(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[500px] rounded-2xl border border-blue-300 overflow-hidden bg-white/90 backdrop-blur-xl shadow-xl p-8 z-50 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2"><Share2 className="w-5 h-5" /> Compartir tarea</h2>
              <textarea
                value={correosCompartir}
                onChange={e => setCorreosCompartir(e.target.value)}
                placeholder="Introduce uno o varios correos, separados por coma o salto de línea"
                className="w-full p-3 border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-2"
                rows={4}
              />
              {errorCompartir && <div className="text-red-500 mb-2">{errorCompartir}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCompartir(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                  disabled={loadingCompartir}
                >
                  Cancelar
                </button>
                {esPropietario && (
                  <button
                    onClick={handleCompartir}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={loadingCompartir}
                  >
                    {loadingCompartir ? 'Compartiendo...' : 'Compartir'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
