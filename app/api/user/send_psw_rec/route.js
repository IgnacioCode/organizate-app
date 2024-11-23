import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {

  const { recipientEmail, emailSubject } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Organizate <organizatepswrecovery@resend.dev>',
      to: [recipientEmail],
      subject: emailSubject,
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      console.log(error);
      
      return NextResponse.json({ message: 'Error enviando el email', success:false }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email enviado exitosamente', success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error enviando el email', success:false }, { status: 500 });
  }
}
