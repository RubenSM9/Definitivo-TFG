import React from 'react';

interface Plan {
  name: string;
  price: string;
  advantages: string[];
  disadvantages: string[];
}

const plans: Plan[] = [
  {
    name: 'Plan Básico',
    price: 'Gratis',
    advantages: ['Acceso limitado a funciones', 'Soporte básico'],
    disadvantages: ['Sin acceso a funciones premium', 'Anuncios incluidos'],
  },
  {
    name: 'Plan Pro',
    price: '$9.99/mes',
    advantages: ['Acceso a todas las funciones', 'Soporte prioritario', 'Sin anuncios'],
    disadvantages: ['Soporte', 'Sin acceso Anticipado'],
  },
  {
    name: 'Plan Premium',
    price: '$19.99/mes',
    advantages: ['Funciones exclusivas', 'Soporte 24/7', 'Acceso anticipado a nuevas funciones'],
    disadvantages: ['Costo elevado'],
  },
];

const PremiumPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a0029] to-black text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-purple-400">Elige tu Plan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`bg-[#1c1c1c] border-2 rounded-2xl p-6 shadow-xl transform transition hover:scale-105 hover:border-purple-500 ${
              i === 2 ? 'border-purple-600' : 'border-gray-700'
            }`}
          >
            <h2 className="text-2xl font-bold text-purple-300 mb-2">{plan.name}</h2>
            <p className="text-lg font-semibold text-purple-200 mb-4">{plan.price}</p>

            <div className="mb-4">
              <h3 className="text-purple-400 font-semibold">Ventajas</h3>
              <ul className="list-disc list-inside text-sm text-green-400 mt-2 space-y-1">
                {plan.advantages.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-purple-400 font-semibold">Desventajas</h3>
              <ul className="list-disc list-inside text-sm text-red-400 mt-2 space-y-1">
                {plan.disadvantages.map((disadv, idx) => (
                  <li key={idx}>{disadv}</li>
                ))}
              </ul>
            </div>

            <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition">
              Elegir {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumPage;
