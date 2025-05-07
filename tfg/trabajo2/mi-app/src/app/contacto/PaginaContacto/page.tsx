'use client';
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado correctamente ✨');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a0029] to-black p-8 text-white">
      <h1 className="text-4xl font-bold text-purple-400 text-center mb-6">Contáctanos</h1>

      {/* Teléfono directo */}
      <div className="max-w-xl mx-auto bg-[#2a003f] border border-purple-700 rounded-xl p-6 mb-10 text-center shadow-md">
        <p className="text-lg mb-2 text-purple-200">¿Prefieres hablar con un humano?</p>
        <a
          href="tel:+34722754808"
          className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition"
        >
          📞 Llama al 722 754 808
        </a>
        <p className="text-sm mt-2 text-gray-400">Sin robots. Sin menús. Solo atención directa.</p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-[#1c1c1c] border border-purple-700 rounded-2xl p-8 shadow-lg space-y-6"
      >
        <div>
          <label className="block text-sm text-purple-300 mb-1">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-black text-white border border-purple-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>
        <div>
          <label className="block text-sm text-purple-300 mb-1">Correo electrónico</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-black text-white border border-purple-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>
        <div>
          <label className="block text-sm text-purple-300 mb-1">Mensaje</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full bg-black text-white border border-purple-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
