import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { get_user_id_by_email } from '@/db/sql_func';
import { hashPassword } from '@/app/utils/general';
import { getRequestContext } from "@cloudflare/next-on-pages"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {

  const { recipientEmail, emailSubject } = await request.json();

  try {

    const hash_email = await hashPassword(recipientEmail + Date());
    
    const queryRecoverTable = "INSERT INTO RecoverPassword (user_id, token) VALUES (?, ?)";

    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare(queryRecoverTable).bind(await get_user_id_by_email(recipientEmail), hash_email).run();
    console.log(db_response);

    const { data, error } = await resend.emails.send({
      from: 'Organizate <organizatepswrecovery@resend.dev>',
      to: [recipientEmail],
      subject: emailSubject,
      react: EmailTemplate({ recoveryLink: `http://localhost:3000/recover?token=${hash_email}` }),
      //react: EmailTemplate({ recoveryLink: `https://organizate.com/recover?token=${hash_email}` }),
    });

    if (error) {
      console.log(error);
      
      return NextResponse.json({ message: 'Error enviando el email', success:false }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email enviado exitosamente', success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ message: 'Error enviando el email', success:false }, { status: 500 });
  }
}

export const runtime = 'edge'