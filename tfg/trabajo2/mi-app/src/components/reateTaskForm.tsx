// components/CreateTaskForm.tsx
import { useState } from "react";
import { createTaskAndSendEmail } from "../app/services/firebaseEmail";

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(""); // De momento puedes pedirlo, luego lo cogemos del auth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTaskAndSendEmail(title, description, email);

    setTitle("");
    setDescription("");
    setEmail("");
    alert("Tarea creada y correo enviado (si está bien configurado) ✅");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Crear Nueva Tarea</h2>
      <input
        type="text"
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-4 w-full"
        required
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-4 w-full"
        required
      />
      <input
        type="email"
        placeholder="Tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4 w-full"
        required
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Crear Tarea
      </button>
    </form>
  );
}
