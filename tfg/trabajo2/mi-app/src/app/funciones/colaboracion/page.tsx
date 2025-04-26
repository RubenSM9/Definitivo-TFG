// PowerUpApp.tsx
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Definimos las interfaces para las Tarjetas y Notas
interface Note {
  id: number;
  content: string;
  cardId: number;
}

interface Card {
  id: number;
  title: string;
  description: string;
  notes: Note[];
}

const PowerUpApp: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Simulamos la carga de tarjetas y notas desde una API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Aquí utilizamos una API de ejemplo o una API personalizada si la tienes
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const data = response.data.slice(0, 5); // Solo obtenemos 5 tarjetas para ejemplo

        const cardsWithNotes = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.body,
          notes: [],
        }));

        setCards(cardsWithNotes);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleAddNote = (cardId: number) => {
    if (newNote.trim()) {
      const updatedCards = cards.map(card =>
        card.id === cardId
          ? {
              ...card,
              notes: [...card.notes, { id: Date.now(), content: newNote, cardId }],
            }
          : card
      );
      setCards(updatedCards);
      setNewNote(''); // Limpiamos el campo de nota
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando tarjetas...</div>;
  }

  return (
    <div className="p-4">
      {cards.map(card => (
        <div key={card.id} className="border rounded-2xl shadow-md p-4 bg-white mb-4">
          <h3 className="text-lg font-bold">{card.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{card.description}</p>

          {/* Mostrar Notas */}
          <div className="mb-2">
            <h4 className="font-semibold">Notas:</h4>
            {card.notes.length === 0 ? (
              <p>No hay notas aún.</p>
            ) : (
              card.notes.map(note => (
                <div key={note.id} className="border p-2 rounded mb-2">
                  <p>{note.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario para agregar nueva nota */}
          <div className="flex items-center">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="border p-2 flex-1 mr-2 rounded"
              placeholder="Agregar una nueva nota"
            />
            <button
              onClick={() => handleAddNote(card.id)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Añadir Nota
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PowerUpApp;
