import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configurar SendGrid con la API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { email, subject, message } = await request.json();

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

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar el email' },
      { status: 500 }
    );
  }
} 