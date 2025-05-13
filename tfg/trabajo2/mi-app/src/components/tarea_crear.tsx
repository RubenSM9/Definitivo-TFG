'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TareaCrear() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/new')}
      className="bg-white/40 backdrop-blur-md border border-purple-200 rounded-2xl shadow-md flex flex-col justify-center items-center w-full cursor-pointer p-6 transition hover:bg-purple-100 hover:border-purple-300"
    >
      <div className="w-12 h-12 rounded-full bg-purple-200 text-purple-700 border-2 border-purple-400 flex items-center justify-center font-bold text-lg mb-2">
        <Plus className="w-6 h-6" />
      </div>
      <p className="text-base font-semibold text-purple-800">Crear Nueva Tarjeta</p>
    </div>
  );
}
