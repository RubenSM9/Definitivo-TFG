'use client';

import { useState } from 'react';

export default function ContactoForm() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'enviado' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado('cargando');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'zentaskerempresa@gmail.com',
          subject: 'Nuevo mensaje desde la web',
          text: `Email: ${email}\nMensaje: ${mensaje}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Nuevo mensaje desde la web</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Mensaje:</strong> ${mensaje}</p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px;">Este es un email automático, por favor no responda a este mensaje.</p>
              </div>
            </div>
          `,
        }),
      });

      if (res.ok) {
        setEstado('enviado');
        setEmail('');
        setMensaje('');
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      console.error(error);
      setEstado('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
      <input
        type="email"
        placeholder="Tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 w-full"
      />
      <textarea
        placeholder="Tu mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
        className="border p-2 w-full h-32"
      />
      <button
        type="submit"
        disabled={estado === 'cargando'}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {estado === 'cargando' ? 'Enviando...' : 'Enviar'}
      </button>

      {estado === 'enviado' && <p className="text-green-600">✅ Mensaje enviado correctamente.</p>}
      {estado === 'error' && <p className="text-red-600">❌ Ocurrió un error al enviar.</p>}
    </form>
  );
}
