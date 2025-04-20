// components/TareaPrevia.tsx
'use client';

import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TareaPreviaProps {
  name: string;
  onSettingsClick?: () => void;
  imagen?: string;
  tareaId?: number;
}

const TareaPrevia: React.FC<TareaPreviaProps> = ({ name, onSettingsClick, imagen, tareaId }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tareaId) {
      router.push(`/tarea/${tareaId}`);
    }
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSettingsClick?.();
  };

  return (
    <div 
      onClick={handleClick}
      className={`py-15 p-4 rounded-lg shadow-md flex flex-col justify-between w-full relative overflow-hidden min-h-[120px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer ${
        imagen ? '' : 'bg-gray-800'
      }`}
      style={imagen ? {
        backgroundImage: `url(${imagen})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      {/* Overlay para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-semibold bg-gray-700">
            {name[0]?.toUpperCase() || 'U'}
          </div>
          <p className="text-sm font-medium text-white">{name}</p>
        </div>
        <button
          onClick={handleSettings}
          className="text-gray-400 hover:text-white transition flex items-center gap-1 text-xs"
          title="Ajustes"
        >
          <Settings className="w-4 h-4" />
          Ajustes
        </button>
      </div>
    </div>
  );
};

export default TareaPrevia;
