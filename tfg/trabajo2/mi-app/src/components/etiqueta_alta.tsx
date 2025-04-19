import { ReactNode } from 'react';

interface EtiquetaAltaProps {
  children: ReactNode;
}

export default function EtiquetaAlta({ children }: EtiquetaAltaProps) {
  return (
    <div className="py-4 px-4 flex justify-center">
      <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        {children}
      </div>
    </div>
  );
}
