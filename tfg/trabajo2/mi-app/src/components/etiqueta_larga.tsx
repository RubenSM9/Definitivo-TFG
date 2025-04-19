import { ReactNode } from 'react';

interface EtiquetaLargaProps {
  children: ReactNode;
}

export default function EtiquetaLarga({ children }: EtiquetaLargaProps) {
  return (
    <div className="min-h-[calc(100vh-6rem)] w-full flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        {children}
      </div>
    </div>
  );
}
