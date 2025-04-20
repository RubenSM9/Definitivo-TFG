import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface EtiquetaAltaProps {
  children: ReactNode;
  tareaId?: number;
}

export default function EtiquetaAlta({ children, tareaId }: EtiquetaAltaProps) {
  const router = useRouter();

  return (
    <div className="py-4 px-4 flex justify-center">
      <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
        {children}
        {tareaId && (
          <button
            onClick={() => router.push(`/tarea/${tareaId}`)}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Ver Tarea
          </button>
        )}
      </div>
    </div>
  );
}
