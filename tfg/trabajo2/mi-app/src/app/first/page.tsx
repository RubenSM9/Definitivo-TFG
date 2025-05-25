'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TareaCrear from '@/components/tarea_crear';
import TareaPrevia from '@/components/tarea_previa';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, deleteCard, getCardsSharedWithEmail, CardData } from '@/firebase/firebaseOperations';
import EtiquetaCompleta from '@/components/etiqueta_completa';
import { CalendarDays } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Tarjeta extends CardData {
  id: string;
}

export default function FirstPage() {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [agendaFecha, setAgendaFecha] = useState<Date | null>(new Date());
  const [agendaVisible, setAgendaVisible] = useState(false);
  const [notasDiarias, setNotasDiarias] = useState<Record<string, string[]>>({});

  const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = async () => {
    try {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }
      const [cardsPropias, cardsCompartidas] = await Promise.all([
        getUserCards(auth.currentUser.uid),
        getCardsSharedWithEmail(auth.currentUser.email || '')
      ]);

      const todas = [...cardsPropias, ...cardsCompartidas]
        .filter(c => c.id)
        .map(c => ({ ...c, id: c.id || '' }))
        .filter((c, index, self) => index === self.findIndex(t => t.id === c.id)) as Tarjeta[];

      setTarjetas(todas);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const guardarNota = () => {
    const fechaKey = agendaFecha?.toISOString().split('T')[0] || '';
    const valores = horas.map(hora => {
      const input = document.getElementById(`input-${hora}`) as HTMLInputElement;
      return input ? input.value : '';
    });
    setNotasDiarias(prev => ({ ...prev, [fechaKey]: valores }));
    setAgendaVisible(false);
    alert('Agenda actualizada');
  };

  const tarjetasFiltradas = tarjetas;

  const fechaActual = agendaFecha?.toISOString().split('T')[0] || '';
  const valoresGuardados = notasDiarias[fechaActual] || Array(24).fill('');

  return (
    <EtiquetaCompleta>
      <div className="w-full md:w-3/4 p-6 bg-white/40 backdrop-blur-lg rounded-r-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tarjetasFiltradas.map((tarjeta) => (
            <TareaPrevia
              key={tarjeta.id}
              tarjeta={tarjeta}
              onDelete={() => deleteCard(tarjeta.id)}
            />
          ))}
          <TareaCrear />
        </div>

        <button
          onClick={() => setAgendaVisible(!agendaVisible)}
          className="mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm"
        >
          {agendaVisible ? 'Cerrar Agenda' : 'Abrir Agenda Diaria'}
        </button>

        {agendaVisible && (
          <div className="mt-6 p-6 bg-white text-black rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
              <CalendarDays className="w-6 h-6" /> Agenda Diaria - {fechaActual}
            </h2>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700">Seleccionar fecha:</label>
              <DatePicker
                selected={agendaFecha}
                onChange={(date) => setAgendaFecha(date)}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {horas.map((hora, i) => (
                <div key={hora} className="flex items-center gap-4">
                  <label className="w-16 text-sm font-bold text-purple-700">{hora}</label>
                  <input
                    id={`input-${hora}`}
                    type="text"
                    defaultValue={valoresGuardados[i] || ''}
                    placeholder={`Actividad para las ${hora}`}
                    className="flex-1 px-4 py-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={guardarNota}
              className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </EtiquetaCompleta>
  );
}
