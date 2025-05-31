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
  <div className="max-w-2xl mx-auto mt-10 mb-20 px-4">
    <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-sky-400 bg-clip-text text-transparent mb-10">
      Ajustes de Tarjeta
    </h1>

    <div className="mb-6 text-left">
      <button
        onClick={volver}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← Volver
      </button>
    </div>

    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border-4 border-purple-300">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre de la Tarjeta
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 shadow-sm transition"
            required
          />
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            value={formData.prioridad}
            onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition"
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-md"
          >
             Eliminar Tarjeta
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={volver}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-xl transition-colors shadow-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-md"
            >
               Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</EtiquetaCompleta>

  );
}
