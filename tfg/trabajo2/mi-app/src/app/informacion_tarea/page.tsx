'use client';
import { Suspense } from 'react';
import InformacionTareaClient from './InformacionTareaClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Cargando tarea...</div>}>
      <InformacionTareaClient />
    </Suspense>
  );
}
