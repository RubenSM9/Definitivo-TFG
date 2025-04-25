'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TareaCrear() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/new')}
      className="bg-gray-800 py-4 px-4 rounded-lg shadow-md flex flex-col justify-center items-center w-full cursor-pointer hover:bg-gray-700 transition"
    >
      <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold bg-gray-700 text-white mb-2">
        <Plus className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-white">Crear Nueva Tarjeta</p>
    </div>
  );
}
