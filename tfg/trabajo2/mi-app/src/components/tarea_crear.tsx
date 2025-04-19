// components/TareaCrear.tsx
'use client';

import { Plus } from 'lucide-react';

interface TareaCrearProps {
  onClick?: () => void;
}

const TareaCrear: React.FC<TareaCrearProps> = ({ onClick }) => {
  return (
    <div
        className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition w-full"
        onClick={onClick}
    >

      <p className="text-sm font-medium text-center text-gray-800 dark:text-gray-100 mb-3">
        Crear tareas
      </p>
      <button className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 transition">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TareaCrear;
