import { ReactNode } from 'react';

interface EtiquetaCompletaProps {
  children: ReactNode;
}

export default function EtiquetaCompleta({ children }: EtiquetaCompletaProps) {
  return (
    <div className="flex w-full max-w-7xl mx-auto rounded-3xl border border-purple-300 overflow-hidden bg-white/30 backdrop-blur-xl shadow-xl h-fit mt-10">
      {children}
    </div>
  );
}    