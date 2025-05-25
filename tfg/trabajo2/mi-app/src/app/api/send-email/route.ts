import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/emailService';

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    const result = await sendEmail({
      to,
      subject,
      text,
      html,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Error sending email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-email route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 