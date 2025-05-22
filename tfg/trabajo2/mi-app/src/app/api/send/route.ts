import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const { to, subject, html } = await req.json();

  try {
    await sgMail.send({
      to,
      from: 'zentasker@gmail.com',
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SendGrid error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

