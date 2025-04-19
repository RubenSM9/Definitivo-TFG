// components/TareaPrevia.tsx
'use client';

import { Settings } from 'lucide-react';

interface TareaPreviaProps {
  name: string;
  onSettingsClick?: () => void;
}

const TareaPrevia: React.FC<TareaPreviaProps> = ({ name, onSettingsClick }) => {
  return (
    <div className="bg-gray-800 py-15 p-4 rounded-lg shadow-md flex flex-col justify-between w-full">
      <div className="flex items-center space-x-4 mb-2">
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-semibold bg-gray-700">
          {name[0]?.toUpperCase() || 'U'}
        </div>
        <p className="text-sm font-medium text-white">{name}</p>
      </div>
      <button
        onClick={onSettingsClick}
        className="text-gray-400 hover:text-white transition mt-1 flex items-center gap-1 text-xs"
        title="Ajustes"
      >
        <Settings className="w-4 h-4" />
        Ajustes
      </button>
    </div>
  );
};

export default TareaPrevia;
