'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, updateCard, deleteCard } from '@/firebase/firebaseOperations';
import EtiquetaCompleta from '@/components/etiqueta_completa';
import Image from 'next/image';

interface Tarea {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaLimite?: string;
  prioridad: string;
  asignado?: string;
  subtareas: any[];
  completada: boolean;
  etiquetas: string[];
  imagen?: string;
}

interface Tarjeta {
  id: string;
  nombre: string;
  prioridad: string;
  tareas: Tarea[];
}

export default function AjustesTarea() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Tarjeta>({
    id: '',
    nombre: '',
    prioridad: 'Media',
    tareas: []
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!auth.currentUser) {
          router.push('/login');
          return;
        }

        const cards = await getUserCards(auth.currentUser.uid);
        const card = cards.find(c => c.id === id);

        if (card) {
          const tarjeta = card as Tarjeta;

          setFormData({
            id: tarjeta.id,
            nombre: tarjeta.nombre || '',
            prioridad: tarjeta.prioridad || 'Media',
            tareas: tarjeta.tareas || []
          });

          if (tarjeta.tareas.length > 0 && tarjeta.tareas[0].imagen) {
            setPreviewUrl(tarjeta.tareas[0].imagen);
          }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
      setFormData({ ...formData, tareas: formData.tareas.map((tarea) => ({ ...tarea, imagen: url })) });
    }
  };

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

      <button
        onClick={volver}
        className="mb-4 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg shadow-md"
      >
        Volver
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 relative">
            <div className="w-full h-full bg-gray-700 rounded-lg overflow-hidden">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Sin imagen</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

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
