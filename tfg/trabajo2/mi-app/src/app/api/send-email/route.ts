import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configurar SendGrid con la API key
const apiKey = process.env.SENDGRID_API_KEY || '';
console.log('API Key configurada:', apiKey ? 'Sí' : 'No');
console.log('EMAIL_FROM configurado:', process.env.EMAIL_FROM || 'No configurado');
sgMail.setApiKey(apiKey);

export async function POST(request: Request) {
  console.log('API /api/send-email llamada');
  try {
    const { email, subject, message } = await request.json();
    console.log('Datos recibidos:', { email, subject, message });

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'your-verified-sender@yourdomain.com',
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="color: #666; line-height: 1.6;">${message}</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">Este es un email automático, por favor no responda a este mensaje.</p>
          </div>
        </div>
      `,
    };

    console.log('Configuración del email:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject
    });

    console.log('Enviando email con SendGrid...');
    const response = await sgMail.send(msg);
    console.log('Respuesta de SendGrid:', response);
    console.log('Email enviado correctamente');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error detallado al enviar email:', error);
    if (error.response) {
      console.error('Detalles del error de SendGrid:', {
        body: error.response.body,
        statusCode: error.response.statusCode
      });
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Error al enviar el email', details: error.response?.body },
      { status: 500 }
    );
  }
} 