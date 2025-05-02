'use client';

import React from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

interface Plan {
  name: string;
  price: string;
  advantages: string[];
  disadvantages: string[];
  priceId?: string;
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
    priceId: 'price_prod_SEp7m4iK7hFDcy',
    advantages: ['Acceso a todas las funciones', 'Soporte prioritario', 'Sin anuncios'],
    disadvantages: ['Soporte', 'Sin acceso Anticipado'],
  },
  {
    name: 'Plan Premium',
    price: '$19.99/mes',
    priceId: 'price_prod_SEp7pBEzWNlkMC',
    advantages: ['Funciones exclusivas', 'Soporte 24/7', 'Acceso anticipado a nuevas funciones'],
    disadvantages: ['Costo elevado'],
  },
];

const PremiumPage = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSelectPlan = async (priceId: string) => {
    if (!stripe || !elements) return;

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const session = await res.json();
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Elige tu Plan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-purple-300 font-bold mb-2">{plan.price}</p>
            <button
              onClick={() => plan.priceId && handleSelectPlan(plan.priceId)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white mt-4"
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumPage;
