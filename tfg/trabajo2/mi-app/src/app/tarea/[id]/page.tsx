'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
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
  getCardById,
  Task,
  Subtask,
  Comment,
  CardData,
  getUserProfile,
  addEmailsToCardSharedWith
} from '@/firebase/firebaseOperations';
import EtiquetaCompleta from '@/components/etiqueta_completa';

interface Tarjeta extends CardData {
  id: string;
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
  const [draggedTarea, setDraggedTarea] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string>('');
  const [showCrearTarea, setShowCrearTarea] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<Task | null>(null);
  const [nuevaSubtarea, setNuevaSubtarea] = useState('');
  const [nuevaSubtareaPrioridad, setNuevaSubtareaPrioridad] = useState('Media');
  const [nuevaSubtareaFechaLimite, setNuevaSubtareaFechaLimite] = useState('');
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
  const [showFilters, setShowFilters] = useState(false);
  const [userRole, setUserRole] = useState<'god' | 'gratis' | 'pro' | 'premium' | null>(null);
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);

  // Cache for user display names
  const [userNamesCache, setUserNamesCache] = useState<{ [key: string]: string }>({});

  // Function to get user display name from cache or fetch it
  const getUserDisplayName = useCallback(async (userId: string) => {
    if (userNamesCache[userId]) {
      return userNamesCache[userId];
    }
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        setUserNamesCache(prev => ({ ...prev, [userId]: userProfile.displayName }));
        return userProfile.displayName;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
    return 'Usuario desconocido'; // Default name if profile not found or error
  }, [userNamesCache]);

  const esPropietario = tarjeta && tarjeta.userId === auth.currentUser?.uid;

  // Función para cargar los datos de Firestore
  const cargarDatos = async () => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      // Cargar perfil del usuario para obtener el rol
      const userProfile = await getUserProfile(auth.currentUser.uid);
      if (userProfile) {
        setUserRole(userProfile.role);
      }

      const card = await getCardById(id);
      if (card && typeof card === 'object' && 'nombre' in card && 'prioridad' in card && 'tareas' in card && Array.isArray(card.tareas)) {
        const cardData = card as Tarjeta;
        
        // Collect all unique completer user IDs from subtareas
        const completerUserIds = new Set<string>();
        cardData.tareas.forEach(tarea => {
          tarea.subtareas?.forEach(sub => {
            if (sub.completada && sub.completedByUserId) {
              completerUserIds.add(sub.completedByUserId);
            }
          });
        });

        // Fetch and cache user names for all completer user IDs
        const fetchUserNamePromises = Array.from(completerUserIds).map(userId => getUserDisplayName(userId));
        await Promise.all(fetchUserNamePromises);

        setTarjeta(cardData);
        
        // Si hay una tarea seleccionada, actualizarla con los datos frescos
        if (selectedTarea) {
          const updatedSelectedTarea = cardData.tareas.find(t => t.id === selectedTarea.id);
          if (updatedSelectedTarea) {
            setSelectedTarea({ ...updatedSelectedTarea, subtareas: updatedSelectedTarea.subtareas ?? [] });
          }
        }
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
        completadas: tarjeta.tareas.filter((t: Task) => t.completada).length,
        pendientes: tarjeta.tareas.filter((t: Task) => !t.completada).length,
        atrasadas: tarjeta.tareas.filter((t: Task) => t.fechaLimite && estaAtrasada(t.fechaLimite)).length,
      };
      setEstadisticas(stats);
    }
  }, [tarjeta]);

  // Handle input change for dedicated hours
  const handleHoursInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log('Input change detected. Value:', value); // Log input change
    // Update selectedTarea with the new input value
    setSelectedTarea(prev => {
      if (!prev) return prev;
      return { ...prev, newHoursInput: value }; // Store input value in selectedTarea
    });
    console.log('selectedTarea.newHoursInput after state update:', value); // Log state after update
  };

  // Handle adding dedicated hours
  const handleAddHours = async () => {
    const hoursToAdd = parseFloat(selectedTarea?.newHoursInput || ''); // Get value from selectedTarea
    if (isNaN(hoursToAdd) || hoursToAdd <= 0 || !selectedTarea) {
      alert('Por favor, ingresa un número de horas válido.');
      return;
    }

    try {
      const currentHours = selectedTarea.horasDedicadas ?? 0;
      const updatedHours = currentHours + hoursToAdd;

      await updateTask(id, selectedTarea.id, {
        horasDedicadas: updatedHours
      });

      // Update local state
      setSelectedTarea(prev => {
        if (!prev) return prev;
        return { ...prev, horasDedicadas: updatedHours, newHoursInput: '' }; // Reset input value
      });

    } catch (error) {
      console.error('Error adding dedicated hours:', error);
      alert('Error al añadir horas dedicadas.');
    }
  };

  // Fetch completer names when selected task changes
  useEffect(() => {
    if (selectedTarea?.subtareas) {
      selectedTarea.subtareas.forEach(sub => {
        if (sub.completada && sub.completedByUserId && !userNamesCache[sub.completedByUserId]) {
          getUserDisplayName(sub.completedByUserId);
        }
      });
    }
  }, [selectedTarea, getUserDisplayName, userNamesCache]);

  // Effect to log state changes for debugging
  useEffect(() => {
    console.log('showHoursDropdown changed:', showHoursDropdown);
  }, [showHoursDropdown]);

  const handleTareaClick = (tarea: Task) => {
    setSelectedTarea({
      ...tarea,
      completada: tarea.completada ?? false,
      subtareas: tarea.subtareas ?? []
    });
  };

  const handleTareaCompletion = async (tarea: Task) => {
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

      // Actualizar selectedTarea localmente para re-renderizar el modal
      setSelectedTarea(nuevaTarea);

      await cargarDatos();
    } catch (error) {
      console.error("Error al actualizar estado de la tarea:", error);
    }
  };

  const handleSubtareaChange = useCallback(async (sub: Subtask) => {
    try {
      if (!auth.currentUser || !selectedTarea) {
        router.push('/login');
        return;
      }

      await updateSubtask(id, selectedTarea.id, sub.id, {
        completada: !sub.completada,
        completedByUserId: !sub.completada ? auth.currentUser.uid : null,
        titulo: sub.titulo,
        prioridad: sub.prioridad,
        fechaLimite: sub.fechaLimite
      });

      // If subtask is now completed, fetch and cache the completer's name
      if (!sub.completada && auth.currentUser) { // Check if it was just marked as completed
        await getUserDisplayName(auth.currentUser.uid);
      }

      // Actualizar selectedTarea localmente para re-renderizar el modal
      setSelectedTarea(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          subtareas: prev.subtareas.map((s: Subtask) => 
            s.id === sub.id ? { ...s, completada: !sub.completada } : s
          )
        };
      });

      // Verificar si todas las subtareas están completadas para actualizar la tarea padre
      if (selectedTarea) { // selectedTarea is the task parent
        const updatedSubtasks = selectedTarea.subtareas.map((s: Subtask) => 
          s.id === sub.id ? { ...s, completada: !sub.completada } : s
        );
        const allSubtasksCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(s => s.completada);
        
        if (selectedTarea.completada !== allSubtasksCompleted) {
          await updateTask(id, selectedTarea.id, {
            completada: allSubtasksCompleted
          });
        }
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
        titulo: newTarea.nombre,
        nombre: newTarea.nombre,
        descripcion: newTarea.descripcion,
        fechaLimite: newTarea.fechaLimite,
        prioridad: newTarea.prioridad,
        asignado: newTarea.asignado,
        subtareas: [],
        completada: false
      };

      await addTask(id, tareaData);

      // Recargar los datos para obtener la tarea recién creada con el ID real de Firebase
      await cargarDatos();

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
      if (!auth.currentUser || !selectedTarea) {
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
    if (!nuevaSubtarea.trim() || !selectedTarea) return;

    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const nuevaSubtareaData = {
        titulo: nuevaSubtarea,
        nombre: nuevaSubtarea,
        completada: false,
        prioridad: nuevaSubtareaPrioridad,
        fechaLimite: nuevaSubtareaFechaLimite,
        comments: []
      };

      // Primero actualizar Firebase
      await addSubtask(id, selectedTarea.id, nuevaSubtareaData);

      // Actualizar selectedTarea localmente para mostrar la nueva subtarea inmediatamente
      setSelectedTarea(prev => {
        if (!prev) return prev;
        // Generar un ID temporal para la nueva subtarea antes de que cargarDatos la reemplace con el ID de Firebase
        const tempSubtaskId = Date.now().toString(); 
        console.log("SelectedTarea antes de cargarDatos:", { ...prev, subtareas: [...(prev.subtareas || []), { ...nuevaSubtareaData, id: tempSubtaskId, createdAt: new Date().toISOString() } as Subtask ] });
        return {
          ...prev,
          subtareas: [...(prev.subtareas || []), { ...nuevaSubtareaData, id: tempSubtaskId, createdAt: new Date().toISOString() } as Subtask ]
        };
      });

      // Recargar los datos para obtener el ID real de Firebase y asegurar consistencia
      await cargarDatos();
      console.log("Tarjeta después de cargarDatos:", tarjeta);
      console.log("SelectedTarea después de cargarDatos:", selectedTarea);

      // Limpiar el formulario
      setNuevaSubtarea('');
      setNuevaSubtareaPrioridad('Media');
      setNuevaSubtareaFechaLimite('');
    } catch (error) {
      console.error("Error al agregar subtarea:", error);
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

  const tareasFiltradas = tarjeta?.tareas.filter((tarea: Task) => {
    const coincideBusqueda = tarea.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const coincidePrioridad = filtros.prioridad ? tarea.prioridad === filtros.prioridad : true;
    const coincideEstado = filtros.estado ? 
      (filtros.estado === 'completada' ? tarea.completada :
       filtros.estado === 'pendiente' ? !tarea.completada : true) : true;
    const coincideFecha = filtros.fecha ? tarea.fechaLimite === filtros.fecha : true;
    return coincideBusqueda && coincidePrioridad && coincideEstado && coincideFecha;
  });

  const sortedAndFilteredTareas = tareasFiltradas?.sort((a, b) => {
    if (!a.fechaLimite && !b.fechaLimite) return 0;
    if (!a.fechaLimite) return 1;
    if (!b.fechaLimite) return -1;
    return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
  });

  const handleCompartir = async () => {
    setLoadingCompartir(true);
    setErrorCompartir('');
    try {
      // Verificar si el usuario es gratis
      if (userRole === 'gratis') {
        alert('Debes mejorar tu plan para poder compartir');
        setLoadingCompartir(false);
        return;
      }

      // Verificar límite para usuarios Pro
      if (userRole === 'pro') {
        if (!auth.currentUser) {
          // Esto no debería ocurrir gracias al chequeo inicial, pero para seguridad del linter
          alert('Error de autenticación. Intenta recargar la página.');
          setLoadingCompartir(false);
          return;
        }
        const ownedCards = await getUserCards(auth.currentUser.uid);
        const sharedCount = ownedCards.filter(card => card.compartidoCon && card.compartidoCon.length > 0).length;
        if (sharedCount >= 3) {
          alert('Limite de tu plan alcanzado, mejora tu plan');
          setLoadingCompartir(false);
          return;
        }
      }

      const correos = correosCompartir
        .split(/[\n,]+/)
        .map(c => c.trim())
        .filter(Boolean);
      if (!correos.length) {
        setErrorCompartir('Introduce al menos un correo.');
        setLoadingCompartir(false);
        return;
      }

      if (!tarjeta) {
        setErrorCompartir('Error: No se encontró la tarea.');
        setLoadingCompartir(false);
        return;
      }

      // Actualizar la tarjeta en Firebase usando arrayUnion
      await addEmailsToCardSharedWith(id, correos);

      // Enviar notificaciones por email
      const currentUser = auth.currentUser;
      if (currentUser) {
        let emailsEnviados = 0;
        let emailsFallidos = 0;
        let erroresDetallados: string[] = [];
        
        for (const correo of correos) {
          try {
            const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: correo,
                subject: `${currentUser.email} ha compartido una tarea contigo`,
                message: `${currentUser.email} ha compartido la tarea "${tarjeta.nombre}" contigo. Puedes acceder a ella desde tu panel de tareas compartidas.`
              }),
            });

            const data = await response.json();
            if (data.success) {
              emailsEnviados++;
            } else {
              emailsFallidos++;
              const errorDetail = data.details ? `: ${JSON.stringify(data.details)}` : '';
              erroresDetallados.push(`Error al enviar a ${correo}: ${data.error || 'Error desconocido'}${errorDetail}`);
            }
          } catch (error) {
            emailsFallidos++;
            erroresDetallados.push(`Error al enviar a ${correo}: Error de conexión`);
          }
        }

        // Mostrar mensaje detallado según el resultado
        if (emailsEnviados > 0 && emailsFallidos === 0) {
          alert(`Tarea compartida exitosamente.\nSe enviaron ${emailsEnviados} notificaciones por correo.`);
        } else if (emailsEnviados > 0 && emailsFallidos > 0) {
          alert(`Tarea compartida.\nSe enviaron ${emailsEnviados} notificaciones.\nFallaron ${emailsFallidos} envíos:\n${erroresDetallados.join('\n')}`);
        } else {
          alert(`Tarea compartida, pero fallaron todos los envíos de correo:\n${erroresDetallados.join('\n')}`);
        }
      }

      setShowCompartir(false);
      setCorreosCompartir('');
    } catch (e) {
      console.error('Error general:', e);
      setErrorCompartir('Error al compartir la tarea.');
    }
    setLoadingCompartir(false);
  };

  if (!tarjeta) return <div className="p-6">Tarjeta no encontrada</div>;


  return (
      <div className="max-w-7xl mt-10 mx-auto">
          {/* Mobile filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden fixed bottom-40 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <Filter className="h-6 w-6" />
          </button>

          {/* Mobile new task button */}
          {esPropietario && (
            <button
              onClick={() => setShowCrearTarea(true)}
              className="md:hidden fixed bottom-24 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          {/* Mobile share button */}
          {esPropietario && (
            <button
              onClick={() => {
                if (userRole === 'gratis') {
                  alert('Debes mejorar tu plan para poder compartir');
                } else {
                  setShowCompartir(true);
                }
              }}
              className="md:hidden fixed bottom-8 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
              <Share2 className="h-6 w-6" />
            </button>
          )}

          {/* Mobile filters overlay */}
          <div className={`
            md:hidden fixed inset-0 bg-black/50 z-40
            transition-opacity duration-300
            ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `} onClick={() => setShowFilters(false)} />

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
              <div className="hidden md:flex space-x-4">
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
                    onClick={() => {
                      if (userRole === 'gratis') {
                        alert('Debes mejorar tu plan para poder compartir');
                      } else {
                        setShowCompartir(true);
                      }
                    }}
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

          {/* Filtros - Mobile version */}
          <div className={`
            md:hidden
            fixed top-0 right-0 h-full w-80
            bg-white/80 p-4 rounded-xl shadow-sm border border-purple-200
            transform transition-transform duration-300
            ${showFilters ? 'translate-x-0' : 'translate-x-full'}
            z-50
            overflow-y-auto
          `}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
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

          {/* Filtros - Desktop version */}
          <div className="hidden md:block bg-white/80 p-4 rounded-xl shadow-sm border border-purple-200 p-6 mb-8 text-gray-800">
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
                {sortedAndFilteredTareas?.map((tarea: any) => (
                  <motion.div
                    key={tarea.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-b-2 ${tarea.completada ? 'border-green-500' : estaAtrasada(tarea.fechaLimite) ? 'border-red-500' : 'border-yellow-500'}`}
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
              <div key={selectedTarea.id} className={`h-full overflow-y-auto px-8 pb-8 border-b-4 ${selectedTarea.completada ? 'border-green-500' : estaAtrasada(selectedTarea.fechaLimite || '') ? 'border-red-500' : 'border-gray-300'}`}>
        <div className="mt-6 text-left">
                  {/* Header con checkbox, titulo, ajustes y reloj */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
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

                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => router.push(`/tarea/${id}/ajustes`)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Ajustes de la tarjeta"
                      >
                        <Settings size={20} />
                      </button>

                      {/* Clock Icon and Dropdown */}
                      <div className="relative">
                        <button 
                          onClick={() => {
                            console.log('Toggling dropdown. Current showHoursDropdown:', showHoursDropdown, 'Current newHours state:', selectedTarea?.newHoursInput); // Log before toggle
                            setShowHoursDropdown(!showHoursDropdown);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Ver horas dedicadas"
                        >
                          <Clock size={20} />
                        </button>
                        
                        {showHoursDropdown && selectedTarea && (
                          <div className="absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg py-2 px-4 z-10 w-40 text-gray-900">
                            <p className="text-sm font-semibold text-gray-800 mb-2 text-center">
                              Total Horas: {selectedTarea.horasDedicadas ?? 0}
                            </p>
                            {/* Input and button to add hours */}
                            <div className="flex space-x-2 items-center">
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={selectedTarea?.newHoursInput ?? ''}
                                onChange={handleHoursInputChange}
                                placeholder="+"
                                className="w-16 p-1 border rounded text-center text-sm"
                              />
                              <button
                                onClick={handleAddHours}
                                className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded"
                              >
                                Añadir
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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

                      {sub.completada && sub.completedByUserId && (
                        <span className="text-xs text-gray-500 mt-1">
                          Completado por: <span className="font-semibold">{userNamesCache[sub.completedByUserId] || 'Cargando...'}</span>
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