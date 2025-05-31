'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { updateUserRole, getUserProfile } from '@/firebase/firebaseOperations';

const plans = [
  {
    name: 'Plan Gratis',
    price: '0€/mes',
    priceId: null,
    description: 'Comienza sin coste. Funciones básicas para probar la plataforma.',
    color: 'from-gray-800 to-gray-900',
    advantages: [
      '✅ Acceso limitado a funciones',
      '✅Tareas Ilimitadas',
    ],
    disadvantages: [
      '❌ Sin soporte',
      '❌ Sin acceso a funciones premium',
      '❌ No puedes compartir tareas',
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
      '✅ Sed renueva cada 30 dias',
    ],
    disadvantages: [
      '❌ Sin soporte prioritario',
      '❌ Sin acceso anticipado a nuevas funciones',
      '❌ Solo puede compartir 3 tareas'
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
      '✅ Sin restricciones puede compartir infinitas tareas',
      '✅ Se renueva cada 40 dias ',
    ],
    disadvantages: [
    ],
  },
];

export default function PremiumPage() {
  const router = useRouter();

  const handleChangePlanAndSendEmail = async (newRole: 'gratis' | 'pro' | 'premium') => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Debes iniciar sesión para cambiar de plan.');
      router.push('/login');
      return;
    }

    try {
      const userProfile = await getUserProfile(currentUser.uid);
      const oldRole = userProfile?.role;

      if (oldRole === newRole) {
        alert(`Ya tienes el plan ${newRole}.`);
        return;
      }

      await updateUserRole(currentUser.uid, newRole);

      let action = '';
      if (newRole === 'gratis' && (oldRole === 'pro' || oldRole === 'premium')) {
        action = 'bajado a';
      } else if (newRole === 'pro' && oldRole === 'gratis') {
        action = 'subido a';
      } else if (newRole === 'pro' && oldRole === 'premium') {
        action = 'bajado a';
      } else if (newRole === 'premium' && (oldRole === 'gratis' || oldRole === 'pro')) {
        action = 'subido a';
      }

      const subject = 'Tu plan en Zentasker ha sido actualizado';
      const message = `<p>Hola ${userProfile?.displayName || currentUser.email},</p><p>Te informamos que tu plan en Zentasker ha sido ${action} <strong>${newRole}</strong>.</p><p>Si tienes alguna pregunta, no dudes en contactarnos.</p><p>Saludos,<br/>El equipo de Zentasker</p>`;

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: currentUser.email,
            subject: subject,
            message: message,
          }),
        });

        const data = await response.json();
        if (data.success) {
          console.log(`Email de cambio de plan enviado a ${currentUser.email}`);
          alert(`Tu plan ha sido actualizado a ${newRole} y se ha enviado un correo de confirmación.`);
        } else {
          console.error(`Error al enviar email de cambio de plan a ${currentUser.email}:`, data.error);
          alert(`Tu plan ha sido actualizado a ${newRole}, pero hubo un error al enviar el correo de confirmación.`);
        }
      } catch (emailError) {
        console.error(`Error de red al intentar enviar email de cambio de plan a ${currentUser.email}:`, emailError);
        alert(`Tu plan ha sido actualizado a ${newRole}, pero hubo un error de red al enviar el correo de confirmación.`);
      }

      // Refresh the page to show the updated plan details if necessary
      // router.refresh(); // Or update local state

    } catch (error: any) {
      console.error('Error changing user plan:', error);
      // Log more specific details if available
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
      alert('Error al cambiar tu plan.');
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
                <ul className="list-disc list-inside text-red-300 space-y-1">
                  {plan.disadvantages.map((dis, i) => (
                    <li key={i}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            {plan.priceId && (
              <button
                onClick={() => handleChangePlanAndSendEmail(plan.name === 'Plan Gratis' ? 'gratis' : plan.name === 'Plan Pro' ? 'pro' : 'premium')}
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