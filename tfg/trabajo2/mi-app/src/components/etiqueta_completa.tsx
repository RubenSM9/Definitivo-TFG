import { ReactNode } from 'react';

interface EtiquetaCompletaProps {
  children: ReactNode;
}

export default function EtiquetaCompleta({ children }: EtiquetaCompletaProps) {
  return (
    <div className="min-h-[calc(100vh-6rem)] w-full mx-auto p-4">
      <div className="h-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        {children}
      </div>
    </div>
  );
}    