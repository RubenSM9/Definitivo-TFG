'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EtiquetaCompleta from '@/components/etiqueta_completa';
import Image from 'next/image';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  fechaLimite?: string;
  prioridad?: string;
  etiquetas?: string;
  lista: string; // Agregado para manejar el estado de la tarea (Pendiente, En Progreso, Hecho)
}

export default function AjustesTarea() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : 0;
  const [formData, setFormData] = useState<Tarea>({
    id: 0,
    titulo: '',
    descripcion: '',
    imagen: '',
    fechaLimite: '',
    prioridad: 'media',
    etiquetas: '',
    lista: 'Pendiente' // Establecemos el estado inicial de la tarea
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cargar los datos de la tarea
    const tareas = JSON.parse(localStorage.getItem('tareas') || '[]');
    const tarea = tareas.find((t: Tarea) => t.id === id);
    if (tarea) {
      setFormData(tarea);
      if (tarea.imagen) {
        setPreviewUrl(tarea.imagen);
      }
    } else {
      // Si no se encuentra la tarea, redirigir al dashboard
      router.push('/dashboard');
    }
    
    // Cleanup function
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [id, router, previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Limpiar la URL anterior si existe
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
      setFormData({ ...formData, imagen: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Leer tareas actuales
    const tareas = JSON.parse(localStorage.getItem('tareas') || '[]');
    
    // Actualizar la tarea
    const nuevasTareas = tareas.map((t: Tarea) => 
      t.id === id ? { ...formData, imagen: previewUrl } : t
    );
    
    // Guardar en localStorage
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
    
    // Redirigir a first
    router.push('/dashboard');
  };

  const handleDelete = () => {
    // Leer tareas actuales
    const tareas = JSON.parse(localStorage.getItem('tareas') || '[]');
    
    // Filtrar la tarea a eliminar
    const nuevasTareas = tareas.filter((t: Tarea) => t.id !== id);
    
    // Guardar en localStorage
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
    
    // Redirigir a first
    router.push('/dashboard');
  };

  const volver = () => {
    router.back(); // Volver a la página anterior
  };

  return (
    <EtiquetaCompleta>
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
        Editar Tarea
      </h1>

      {/* Botón Volver */}
      <button
        onClick={volver}
        className="mb-4 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg shadow-md"
      >
        Volver
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de imagen */}
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

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título de la tarea
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all h-32 resize-none"
            required
          />
        </div>

        {/* Fecha límite */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fecha límite
          </label>
          <input
            type="date"
            value={formData.fechaLimite}
            onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
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
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        {/* Etiquetas */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            value={formData.etiquetas}
            onChange={(e) => setFormData({ ...formData, etiquetas: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="ej: urgente, proyecto, reunión"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-between pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Eliminar Tarea
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/first')}
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
