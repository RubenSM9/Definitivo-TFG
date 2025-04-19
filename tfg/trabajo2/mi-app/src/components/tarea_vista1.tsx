import { ReactNode } from 'react';
import Image from 'next/image';

interface TareaVistaProps {
  titulo: string;
  descripcion: string;
  imagen?: string;
  onDelete: () => void;
}


export default function TareaVista({ titulo, descripcion, imagen, onDelete }: TareaVistaProps) {
  return (
    <div className="flex items-center gap-6 py-6 px-6 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
        {imagen ? (
          <Image
          src={imagen}
          alt={titulo}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">{titulo}</h3>
        <p className="text-gray-300">{descripcion}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
          Editar
        </button>
        <button 
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
} 