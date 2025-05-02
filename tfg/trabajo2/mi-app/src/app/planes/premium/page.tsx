'use client';

import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Plan Gratis',
    price: '0€/mes',
    priceId: null,
    description: 'Comienza sin coste. Funciones básicas para probar la plataforma.',
    color: 'from-gray-800 to-gray-900',
    advantages: [
      '✅ Acceso limitado a funciones',
      '✅ Perfecto para empezar',
    ],
    disadvantages: [
      '❌ Sin soporte',
      '❌ Sin acceso a funciones premium',
      '❌ Anuncios visibles',
    ],
  },
  {
    name: 'Plan Pro',
    price: '9,99€/mes',
    priceId: 'price_1RKLSxCOoodDo9d8ZSw9cqrB',
    description: 'Ideal para usuarios individuales que buscan acceso completo a herramientas estándar.',
    color: 'from-purple-700 to-purple-900',
    advantages: [
      '✅ Acceso completo a funciones estándar',
      '✅ Actualizaciones regulares',
      '✅ Panel de usuario personalizado',
    ],
    disadvantages: [
      '❌ Sin soporte prioritario',
      '❌ Sin acceso anticipado a nuevas funciones',
    ],
  },
  {
    name: 'Plan Premium',
    price: '19,99€/mes',
    priceId: 'price_1RKLTLCOoodDo9d8u3GvQ5za',
    description: 'Todo lo del Pro, pero con más poder, prioridad y exclusividad.',
    color: 'from-purple-600 to-pink-600',
    advantages: [
      '✅ Todo lo del plan Pro',
      '✅ Soporte prioritario 24/7',
      '✅ Acceso anticipado a funciones beta',
      '✅ Invitaciones a eventos exclusivos',
    ],
    disadvantages: [
      '❌ Coste mensual más alto',
    ],
  },
];

export default function PremiumPage() {
  const router = useRouter();

  const handleCheckout = async (priceId: string | null) => {
    if (!priceId) return;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Error al iniciar el checkout');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-extrabold text-center mb-16 text-purple-400 drop-shadow-lg">
        🚀 Elige Tu Poder: Planes Premium
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-gradient-to-br ${plan.color} rounded-2xl shadow-xl p-8 flex flex-col justify-between transform hover:scale-105 transition`}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
              <p className="text-xl font-semibold mb-6 text-lime-200">{plan.price}</p>
              <p className="mb-4 text-gray-200 italic">{plan.description}</p>

              <div className="mb-4">
                <h3 className="text-green-400 font-bold mb-2">✅ Ventajas</h3>
                <ul className="list-disc list-inside text-green-300 space-y-1">
                  {plan.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-red-400 font-bold mb-2">❌ Desventajas</h3>
                <ul className="list-disc list-inside text-red-300 space-y-1">
                  {plan.disadvantages.map((dis, i) => (
                    <li key={i}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            {plan.priceId && (
              <button
                onClick={() => handleCheckout(plan.priceId)}
                className="mt-8 bg-black border border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Elegir {plan.name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
