'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { getUserCards, Task, CardData } from '@/firebase/firebaseOperations';
import Calendar from '@/components/Calendar';

export default function CalendarPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      try {
        const cards = await getUserCards(auth.currentUser.uid);
        setCards(cards);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, [router]);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendario de Tareas</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar tasks={cards} onSelectTask={handleSelectTask} />
          </div>
          
          {selectedTask && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedTask.nombre}</h2>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedTask.descripcion}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedTask.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                    selectedTask.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedTask.prioridad}
                  </span>
                </div>
                {selectedTask.fechaLimite && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Fecha límite:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(selectedTask.fechaLimite).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedTask.asignado && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Asignado a:</span>
                    <span className="text-sm text-gray-600">{selectedTask.asignado}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 