import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Inicializa Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
   // Asegúrate de usar la versión correcta de la API
});

// Handler para la creación de la sesión de Stripe
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { priceId } = req.body; // El priceId enviado desde el frontend

      // Crear la sesión de Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId, // El ID del precio que pasa desde el frontend
            quantity: 1,
          },
        ],
        mode: 'subscription', // O 'payment', dependiendo de tu tipo de producto
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      });

      // Devuelve el ID de la sesión de Stripe
      res.status(200).json({ url: session.url });  // Cambié 'id' por 'url' para redirigir al usuario
    } catch (error) {
      console.error('Error al crear la sesión de checkout:', error);
      res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
  } else {
    // Si no es un método POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
