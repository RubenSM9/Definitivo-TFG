/**
 * Página de Creación de Nueva Tarea
 * Formulario para crear una nueva tarea con todos sus detalles
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EtiquetaCompleta from '../../components/etiqueta_completa';

export default function NewTask() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null as File | null,
    fechaLimite: '',
    prioridad: 'media',
    etiquetas: ''
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Leer tareas actuales desde localStorage
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas') || '[]');
  
    // Crear una nueva tarea con los datos del formulario
    const nuevaTarea = {
      ...formData,
      imagen: previewUrl, // Guardamos la URL de la imagen generada
    };
  
    // Agregarla a la lista y guardar en localStorage
    const nuevasTareas = [...tareasGuardadas, nuevaTarea];
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
  
    // Redirigir a la página de lista
    router.push('/list');
  };
  

  return (
    <EtiquetaCompleta>
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
        Crear Nueva Tarea
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de imagen */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 relative">
            <div className="w-full h-full bg-gray-700 rounded-lg overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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
        <div className="flex gap-4 justify-end pt-6">
          <button
            type="button"
            onClick={() => router.push('/list')}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Crear Tarea
          </button>
        </div>
      </form>
    </EtiquetaCompleta>
  );
}
