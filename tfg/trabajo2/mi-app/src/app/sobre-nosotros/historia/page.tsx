// components/HistoriaZentasker.tsx
'use client'; // 👈 Asegúrate si estás usando client components

import React from "react";

export default function HistoriaZentasker() {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Nuestra Historia</h1>
      <p className="text-lg mb-4">
        Zentasker nació de la pasión compartida de dos amigos por el desarrollo y la tecnología. 
        Estudiando juntos Desarrollo de Aplicaciones Web, siempre soñamos con crear algo que pudiera 
        tener un impacto real en la vida de las personas.
      </p>
      <p className="text-lg mb-4">
        Una tarde, mientras compartíamos ideas sobre cómo podríamos aplicar nuestros conocimientos, 
        surgió una pregunta: <strong>¿Cómo podríamos ayudar a las personas a organizarse mejor y ser más productivas?</strong> 
        Así fue como, de forma natural, nació la idea de Zentasker: una plataforma intuitiva, eficiente y pensada para 
        acompañar a los usuarios en el logro de sus objetivos diarios.
      </p>
      <p className="text-lg mb-4">
        Desde entonces, hemos trabajado con ilusión y compromiso para construir un gestor de tareas moderno, 
        sencillo de usar y adaptable a cualquier necesidad, siempre con el objetivo de hacer la vida un poco más fácil 
        para todos.
      </p>
     
      {/* Aquí añadimos la imagen */}
      <div className="flex justify-center">
        <img 
          src="/images/Equipo.jpg" 
          alt="Equipo Zentasker" 
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>
    </section>
  );
}