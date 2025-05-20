import { ReactNode } from 'react';

interface EtiquetaIdProps {
  children: ReactNode;
}

export default function EtiquetaId({ children }: EtiquetaIdProps) {
  return (
    <div className="flex w-full max-w-7xl mx-auto rounded-3xl border border-black overflow-hidden bg-white shadow-xl h-fit mt-10">
      <div className="w-full p-8">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
} 