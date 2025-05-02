'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SubscribeButton = ({ priceId }: { priceId: string }) => {
  const handleClick = async () => {
    const res = await fetch('/api/create-checkout-session', { // Cambié la URL a /api/create-checkout-session
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirige al usuario a la URL de Stripe Checkout
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl shadow-lg transition"
    >
      Suscribirse
    </button>
  );
};

export default SubscribeButton;
