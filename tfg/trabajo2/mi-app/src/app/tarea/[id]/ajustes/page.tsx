'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AjustesTarjeta() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [tarjeta, setTarjeta] = useState<any>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');

  useEffect(() => {
    if (!id) return; // evita ejecutar sin id

    const tarjetasStr = localStorage.getItem('tarjetas');
    if (!tarjetasStr) return;

    const tarjetas = JSON.parse(tarjetasStr);
    const actual = tarjetas.find((t: any) => t.id === id);

    if (actual) {
      setTarjeta(actual);
      setNuevoNombre(actual.nombre);
    }
  }, [id]);

  const guardarCambios = () => {
    if (!tarjeta) return;

    const tarjetas = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const index = tarjetas.findIndex((t: any) => t.id === id);

    if (index !== -1) {
      tarjetas[index].nombre = nuevoNombre;
      localStorage.setItem('tarjetas', JSON.stringify(tarjetas));
      router.back();
    }
  };

  const eliminarTarjeta = () => {
    const tarjetas = JSON.parse(localStorage.getItem('tarjetas') || '[]');
    const nuevas = tarjetas.filter((t: any) => t.id !== id);
    localStorage.setItem('tarjetas', JSON.stringify(nuevas));
    router.push('/');
  };

  if (!tarjeta) {
    return <div className="p-6 text-center text-red-600 font-bold">Tarjeta no encontrada</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ajustes de Tarjeta</h1>

      <div className="space-y-4">
        <label className="block font-semibold">Nombre de la Tarjeta</label>
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
        />

        <button
          onClick={guardarCambios}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Guardar Cambios
        </button>

        <hr className="my-6" />

        <button
          onClick={eliminarTarjeta}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Eliminar Tarjeta
        </button>
      </div>
    </div>
  );
}
