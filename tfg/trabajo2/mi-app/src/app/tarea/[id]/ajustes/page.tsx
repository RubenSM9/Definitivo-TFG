'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, updateCard, deleteCard } from '@/firebase/firebaseOperations';
import EtiquetaCompleta from '@/components/etiqueta_completa';

interface Tarjeta {
  id: string;
  nombre: string;
  prioridad: string;
  tareas: any[];
}

interface FirebaseCard {
  id: string;
  nombre: string;
  prioridad: string;
  tareas: any[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function AjustesTarjeta() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Tarjeta>({
    id: '',
    nombre: '',
    prioridad: 'Media',
    tareas: []
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!auth.currentUser) {
          router.push('/login');
          return;
        }

        const cards = await getUserCards(auth.currentUser.uid) as FirebaseCard[];
        const card = cards.find(c => c.id === id);
        
        if (card) {
          setFormData({
            id: card.id,
            nombre: card.nombre || '',
            prioridad: card.prioridad || 'Media',
            tareas: card.tareas || []
          });
        } else {
          console.log("No se encontró la tarjeta");
          router.push('/first');
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      const cardData = {
        nombre: formData.nombre,
        prioridad: formData.prioridad,
        tareas: formData.tareas || []
      };

      await updateCard(id, cardData);
      router.push('/first');
    } catch (error) {
      console.error("Error al actualizar la tarjeta:", error);
      alert("Error al actualizar la tarjeta. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      try {
        if (!auth.currentUser) {
          router.push('/login');
          return;
        }

        await deleteCard(id);
        router.push('/first');
      } catch (error) {
        console.error("Error al eliminar la tarjeta:", error);
        alert("Error al eliminar la tarjeta. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const volver = () => {
    router.back();
  };

  if (loading) {
    return (
      <EtiquetaCompleta>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </EtiquetaCompleta>
    );
  }

  return (
    <EtiquetaCompleta>
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
        Ajustes de Tarjeta
      </h1>

      {/* Botón Volver */}
      <button
        onClick={volver}
        className="mb-4 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg shadow-md"
      >
        Volver
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre de la Tarjeta
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prioridad
          </label>
          <select
            value={formData.prioridad}
            onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-between pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Eliminar Tarjeta
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={volver}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </EtiquetaCompleta>
  );
}
